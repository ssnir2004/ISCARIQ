import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

export const branchRouter = crudRouter({
  delegate: prisma.branch,
  createSchema: z.object({ name: z.string().min(1) }),
  updateSchema: z.object({ name: z.string().min(1).optional() }),
  orderBy: { name: "asc" },
});

export const departmentRouter = crudRouter({
  delegate: prisma.department,
  createSchema: z.object({ code: z.string().min(1), name: z.string().min(1) }),
  updateSchema: z.object({ code: z.string().min(1).optional(), name: z.string().min(1).optional() }),
  include: { teams: true },
  orderBy: { code: "asc" },
});

export const teamRouter = crudRouter({
  delegate: prisma.team,
  createSchema: z.object({
    code: z.string().min(1),
    description: z.string().min(1),
    isManager: z.boolean().optional(),
    departmentId: z.string().min(1),
  }),
  updateSchema: z.object({
    code: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    isManager: z.boolean().optional(),
    departmentId: z.string().min(1).optional(),
  }),
  include: { department: true },
  orderBy: { code: "asc" },
});

export const materialRouter = crudRouter({
  delegate: prisma.material,
  createSchema: z.object({
    iso513Group: z.enum(["P", "M", "K", "N", "S", "H"]),
    name: z.string().min(1),
    description: z.string().optional(),
  }),
  updateSchema: z.object({
    iso513Group: z.enum(["P", "M", "K", "N", "S", "H"]).optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
  orderBy: { iso513Group: "asc" },
});

export const problemTagRouter = crudRouter({
  delegate: prisma.problemTag,
  createSchema: z.object({ name: z.string().min(1) }),
  updateSchema: z.object({ name: z.string().min(1).optional() }),
  orderBy: { name: "asc" },
});

export const insertRouter = crudRouter({
  delegate: prisma.insert,
  createSchema: z.object({
    designation: z.string().min(1),
    item: z.string().optional(),
    shape: z.string().min(1),
    size: z.string().min(1),
    chipbreaker: z.string().min(1),
    grade: z.string().min(1),
    coatingType: z.string().optional(),
    substrate: z.string().optional(),
    coolantPreference: z.enum(["REQUIRED", "OPTIONAL", "AVOID"]).optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    designation: z.string().min(1).optional(),
    item: z.string().optional(),
    shape: z.string().min(1).optional(),
    size: z.string().min(1).optional(),
    chipbreaker: z.string().min(1).optional(),
    grade: z.string().min(1).optional(),
    coatingType: z.string().optional(),
    substrate: z.string().optional(),
    coolantPreference: z.enum(["REQUIRED", "OPTIONAL", "AVOID"]).optional(),
    notes: z.string().optional(),
  }),
  orderBy: { designation: "asc" },
});

export const cuttingConditionRouter = crudRouter({
  delegate: prisma.cuttingCondition,
  createSchema: z.object({
    insertId: z.string().min(1),
    materialId: z.string().min(1),
    operationType: z.enum(["TURNING", "MILLING", "DRILLING", "GROOVING", "THREADING", "BORING"]),
    apMin: z.number().optional(),
    apMax: z.number().optional(),
    vcMin: z.number().optional(),
    vcMax: z.number().optional(),
    feedMin: z.number().optional(),
    feedMax: z.number().optional(),
    coolant: z.enum(["REQUIRED", "OPTIONAL", "AVOID"]).optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    insertId: z.string().min(1).optional(),
    materialId: z.string().min(1).optional(),
    operationType: z.enum(["TURNING", "MILLING", "DRILLING", "GROOVING", "THREADING", "BORING"]).optional(),
    apMin: z.number().optional(),
    apMax: z.number().optional(),
    vcMin: z.number().optional(),
    vcMax: z.number().optional(),
    feedMin: z.number().optional(),
    feedMax: z.number().optional(),
    coolant: z.enum(["REQUIRED", "OPTIONAL", "AVOID"]).optional(),
    notes: z.string().optional(),
  }),
  include: { insert: true, material: true },
});

export const insertProblemMatchRouter = crudRouter({
  delegate: prisma.insertProblemMatch,
  createSchema: z.object({
    insertId: z.string().min(1),
    problemTagId: z.string().min(1),
    materialId: z.string().optional(),
    priority: z.number().optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    insertId: z.string().min(1).optional(),
    problemTagId: z.string().min(1).optional(),
    materialId: z.string().optional(),
    priority: z.number().optional(),
    notes: z.string().optional(),
  }),
  include: { insert: true, problemTag: true, material: true },
});
