import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "iscariq_session";

export type Role = "admin" | "viewer";
export const ROLES: Role[] = ["admin", "viewer"];

export interface AuthedRequest extends Request {
  userId?: string;
  role?: Role;
}

export function issueToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

export const SESSION_COOKIE = COOKIE_NAME;

// Each request checks the user still exists and reads its role, kept for a
// short while so every request doesn't query the database.
const USER_TTL_MS = 30_000;
const users = new Map<string, { role: Role | null; at: number }>();

export function forgetUser(id: string) {
  users.delete(id);
}

async function roleOf(id: string): Promise<Role | null> {
  const cached = users.get(id);
  if (cached && Date.now() - cached.at < USER_TTL_MS) return cached.role;
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  const role = user ? (user.role === "viewer" ? "viewer" : "admin") : null;
  users.set(id, { role, at: Date.now() });
  return role;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  let id: string;
  try {
    id = (jwt.verify(token, JWT_SECRET) as { sub: string }).sub;
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
  const role = await roleOf(id);
  if (!role) return res.status(401).json({ error: "This user no longer exists" });
  req.userId = id;
  req.role = role;
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.role !== "admin") return res.status(403).json({ error: "Only an admin can do this" });
  next();
}

// Viewers may read everything but change nothing, except searching the
// advisor (a POST that only reads). The menu is shared and arranged by admins.
export function viewersReadOnly(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.role === "admin" || ["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.method === "POST" && req.path.replace(/\/+$/, "") === "/advisor") return next();
  return res.status(403).json({ error: "View-only user: changes are not allowed" });
}
