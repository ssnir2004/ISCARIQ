import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

const RFQ_NUMBER = z.string().regex(/^\d{6}$/, "RFQ number must be exactly 6 digits");

const statusEnum = z.enum([
  "NEW",
  "UNDER_REVIEW",
  "SOLUTION_PROPOSED",
  "DRAWING_SENT",
  "CUSTOMER_SIGNED",
  "REJECTED",
  "CLOSED",
]);

export const rfqRouter = crudRouter({
  delegate: prisma.rfq,
  createSchema: z.object({
    rfqNumber: RFQ_NUMBER,
    branchId: z.string().min(1),
    customer: z.string().min(1).optional(),
    title: z.string().min(1),
    materialDescription: z.string().optional(),
    problemDescription: z.string().optional(),
    status: statusEnum.optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    rfqNumber: RFQ_NUMBER.optional(),
    branchId: z.string().min(1).optional(),
    customer: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    materialDescription: z.string().optional(),
    problemDescription: z.string().optional(),
    status: statusEnum.optional(),
    notes: z.string().optional(),
  }),
  include: {
    branch: true,
    projects: {
      include: {
        team: { include: { department: true } },
        order: true,
        productionOrder: true,
        drawings: true,
      },
    },
  },
  orderBy: { createdAt: "desc" },
});
