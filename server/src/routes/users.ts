import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { forgetUser, requireAdmin, ROLES, type AuthedRequest } from "../middleware/auth.js";

// Users (admins only): GET, POST, PATCH /:id (role and/or a new password),
// DELETE /:id. There is always at least one admin, and admins can't delete
// themselves or take away their own admin role.
export const userRouter = Router();
userRouter.use(requireAdmin);

const select = { id: true, email: true, role: true, createdAt: true } as const;
const name = z.string().trim().min(2, "User name must be at least 2 characters").max(100);
const password = z.string().min(8, "Password must be at least 8 characters");
const role = z.enum(ROLES as [string, ...string[]]);

const firstError = (error: z.ZodError) => error.issues[0]?.message ?? "Invalid input";

async function nameTaken(email: string, exceptId?: string) {
  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: { id: true } });
  return !!user && user.id !== exceptId;
}

userRouter.get("/", async (_req, res) => {
  res.json(await prisma.user.findMany({ select, orderBy: { createdAt: "asc" } }));
});

userRouter.post("/", async (req, res) => {
  const parsed = z.object({ email: name, password, role }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: firstError(parsed.error) });
  const { email, role: newRole } = parsed.data;
  if (await nameTaken(email)) return res.status(409).json({ error: "A user with this name already exists" });
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  res.status(201).json(await prisma.user.create({ data: { email, passwordHash, role: newRole }, select }));
});

userRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const parsed = z.object({ email: name.optional(), password: password.optional(), role: role.optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: firstError(parsed.error) });
  const id = req.params.id;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "No such user" });
  const { email, role: newRole } = parsed.data;
  if (newRole === "viewer" && user.role !== "viewer") {
    if (id === req.userId) return res.status(400).json({ error: "You can't take away your own admin role" });
  }
  if (email && (await nameTaken(email, id))) return res.status(409).json({ error: "A user with this name already exists" });
  const passwordHash = parsed.data.password ? await bcrypt.hash(parsed.data.password, 10) : undefined;
  const updated = await prisma.user.update({ where: { id }, data: { email, role: newRole, passwordHash }, select });
  forgetUser(id);
  res.json(updated);
});

userRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const id = req.params.id;
  if (id === req.userId) return res.status(400).json({ error: "You can't delete yourself" });
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "No such user" });
  await prisma.user.delete({ where: { id } });
  forgetUser(id);
  res.status(204).end();
});
