import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

export const npaRouter = Router();

const attributeSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const bodySchema = z.object({
  npaNumber: z.string().optional(),
  title: z.string().min(1),
  category: z.string().optional(),
  applicationType: z.string().optional(),
  designation: z.string().optional(),
  publishDate: z.coerce.date().optional(),
  recommendedApplications: z.string().optional(),
  innovation: z.string().optional(),
  keyAdvantages: z.string().optional(),
  materialsText: z.string().optional(),
  notes: z.string().optional(),
  image: z.string().optional(),
  sourceFileName: z.string().optional(),
  sourceFileData: z.string().optional(),
  materialIds: z.array(z.string()).default([]),
  attributes: z.array(attributeSchema).default([]),
});

const include = {
  materials: true,
  attributes: { orderBy: { order: "asc" as const } },
};

npaRouter.get("/", async (_req, res) => {
  const items = await prisma.npa.findMany({ include, orderBy: { createdAt: "desc" } });
  res.json(items);
});

npaRouter.get("/:id", async (req, res) => {
  const item = await prisma.npa.findUnique({ where: { id: req.params.id }, include });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

npaRouter.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { materialIds, attributes, ...data } = parsed.data;
  try {
    const item = await prisma.npa.create({
      data: {
        ...data,
        materials: { connect: materialIds.map((id) => ({ id })) },
        attributes: { create: attributes.map((a, i) => ({ label: a.label, value: a.value, order: i })) },
      },
      include,
    });
    res.status(201).json(item);
  } catch (e: any) {
    res.status(409).json({ error: e.message ?? "Create failed" });
  }
});

npaRouter.patch("/:id", async (req, res) => {
  const parsed = bodySchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { materialIds, attributes, ...data } = parsed.data;
  try {
    const item = await prisma.npa.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(materialIds ? { materials: { set: materialIds.map((id) => ({ id })) } } : {}),
        ...(attributes
          ? {
              attributes: {
                deleteMany: {},
                create: attributes.map((a, i) => ({ label: a.label, value: a.value, order: i })),
              },
            }
          : {}),
      },
      include,
    });
    res.json(item);
  } catch (e: any) {
    res.status(404).json({ error: e.message ?? "Update failed" });
  }
});

npaRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.npa.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e: any) {
    res.status(404).json({ error: e.message ?? "Delete failed" });
  }
});
