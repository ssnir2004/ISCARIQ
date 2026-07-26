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

export function crudRouter(opts: {
  delegate: Delegate;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  include?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
}) {
  const router = Router();
  const { delegate, createSchema, updateSchema, include, orderBy } = opts;

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
      const item = await delegate.create({ data: parsed.data, include });
      res.status(201).json(item);
    } catch (e: any) {
      res.status(409).json({ error: e.message ?? "Create failed" });
    }
  });

  router.patch("/:id", async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      const item = await delegate.update({ where: { id: req.params.id }, data: parsed.data, include });
      res.json(item);
    } catch (e: any) {
      res.status(404).json({ error: e.message ?? "Update failed" });
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
