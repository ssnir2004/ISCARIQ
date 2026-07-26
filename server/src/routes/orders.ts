import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

export const orderRouter = crudRouter({
  delegate: prisma.order,
  createSchema: z.object({
    orderNumber: z.string().min(1),
    projectId: z.string().min(1),
    customerSignedDate: z.coerce.date().optional(),
    status: z.string().optional(),
  }),
  updateSchema: z.object({
    orderNumber: z.string().min(1).optional(),
    customerSignedDate: z.coerce.date().optional(),
    status: z.string().optional(),
  }),
  include: { project: true },
});

export const productionOrderSchemas = {
  create: z.object({
    poNumber: z.string().regex(/^\d{7}$/, "Production order number must be exactly 7 digits"),
    projectId: z.string().min(1),
    status: z.string().optional(),
  }),
  update: z.object({
    poNumber: z.string().regex(/^\d{7}$/).optional(),
    status: z.string().optional(),
  }),
};

export const productionOrderRouter = crudRouter({
  delegate: prisma.productionOrder,
  createSchema: productionOrderSchemas.create,
  updateSchema: productionOrderSchemas.update,
  include: { project: true },
});
