import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

const PROJECT_NUMBER = z.string().regex(/^\d{7}$/, "Project number must be exactly 7 digits");

const statusEnum = z.enum([
  "ASSIGNED",
  "IN_PROGRESS",
  "DRAWING_READY",
  "SENT_TO_BRANCH",
  "CUSTOMER_SIGNED",
  "PRODUCTION_PACKAGE_IN_PROGRESS",
  "PRODUCTION_PACKAGE_READY",
  "CLOSED",
]);

export const projectRouter = crudRouter({
  delegate: prisma.project,
  createSchema: z.object({
    projectNumber: PROJECT_NUMBER,
    rfqId: z.string().min(1),
    teamId: z.string().min(1),
    status: statusEnum.optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    projectNumber: PROJECT_NUMBER.optional(),
    rfqId: z.string().min(1).optional(),
    teamId: z.string().min(1).optional(),
    status: statusEnum.optional(),
    notes: z.string().optional(),
  }),
  include: {
    rfq: { include: { branch: true } },
    team: { include: { department: true } },
    drawings: true,
    order: true,
    productionOrder: true,
  },
  orderBy: { createdAt: "desc" },
});
