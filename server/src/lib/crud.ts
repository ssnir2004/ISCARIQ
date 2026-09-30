import { Router } from "express";
import type { ZodSchema } from "zod";
import { Prisma } from "@prisma/client";

interface Delegate {
  findMany: (args?: any) => Promise<any>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
}

// Turns a Prisma write error into a status and a message fit for the UI
// (instead of Prisma's raw "Invalid `prisma.x.create()` invocation" text).
function writeError(e: unknown, body: Record<string, unknown>): { status: number; error: string } {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = e.meta?.target;
      const fields = Array.isArray(target) ? (target as string[]) : typeof target === "string" ? [target] : [];
      if (fields.length === 1 && typeof body[fields[0]] === "string") {
        return { status: 409, error: `"${body[fields[0]]}" already exists — ${fields[0] === "name" ? "names" : fields[0]} must be unique.` };
      }
      return { status: 409, error: `An item with the same ${fields.join(", ") || "values"} already exists.` };
    }
    if (e.code === "P2025") return { status: 404, error: "Not found" };
    if (e.code === "P2003") return { status: 409, error: "A related item it refers to doesn't exist or is still in use." };
  }
  console.error(e);
  return { status: 400, error: "Save failed" };
}

export function crudRouter(opts: {
  delegate: Delegate;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  include?: Record<string, unknown>;
  orderBy?: Record<string, unknown> | Record<string, unknown>[];
  // Turns validated input into Prisma `data` (e.g. id lists into relation writes).
  mapData?: (data: any, mode: "create" | "update") => any;
}) {
  const router = Router();
  const { delegate, createSchema, updateSchema, include, orderBy, mapData = (data) => data } = opts;

  router.get("/", async (_req, res) => {
    const items = await delegate.findMany({ include, orderBy });
    res.json(items);
  });

  router.get("/:id", async (req, res) => {
    const item = await delegate.findUnique({ where: { id: req.params.id }, include });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  router.post("/", async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      const item = await delegate.create({ data: mapData(parsed.data, "create"), include });
      res.status(201).json(item);
    } catch (e) {
      const { status, error } = writeError(e, parsed.data as Record<string, unknown>);
      res.status(status).json({ error });
    }
  });

  router.patch("/:id", async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      const item = await delegate.update({ where: { id: req.params.id }, data: mapData(parsed.data, "update"), include });
      res.json(item);
    } catch (e) {
      const { status, error } = writeError(e, parsed.data as Record<string, unknown>);
      res.status(status).json({ error });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await delegate.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          return res.status(404).json({ error: "Not found" });
        }
        if (e.code === "P2003") {
          return res.status(409).json({
            error: "Cannot delete: other records still reference this item. Remove or reassign them first.",
          });
        }
      }
      res.status(404).json({ error: e.message ?? "Delete failed" });
    }
  });

  return router;
}
