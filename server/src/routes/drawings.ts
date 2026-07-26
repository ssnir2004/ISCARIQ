import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

export const drawingRouter = crudRouter({
  delegate: prisma.drawing,
  createSchema: z.object({
    projectId: z.string().min(1),
    version: z.number().int().positive(),
    fileRef: z.string().optional(),
    sentDate: z.coerce.date().optional(),
    status: z.string().optional(),
  }),
  updateSchema: z.object({
    version: z.number().int().positive().optional(),
    fileRef: z.string().optional(),
    sentDate: z.coerce.date().optional(),
    status: z.string().optional(),
  }),
  orderBy: { version: "asc" },
});
