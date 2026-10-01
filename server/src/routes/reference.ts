import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

const iso513GroupSchema = z.enum(["P", "M", "K", "N", "S", "H"]);

export const branchRouter = crudRouter({
  delegate: prisma.branch,
  createSchema: z.object({ name: z.string().min(1) }),
  updateSchema: z.object({ name: z.string().min(1).optional() }),
  orderBy: { name: "asc" },
});

export const plantRouter = crudRouter({
  delegate: prisma.plant,
  createSchema: z.object({
    name: z.string().min(1),
    regionCode: z.string().optional(),
    specialties: z.string().optional(),
    mapView: z.enum(["WORLD", "GERMANY"]),
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    labelDx: z.number().min(-100).max(100).optional(),
    labelDy: z.number().min(-100).max(100).optional(),
    uncertain: z.boolean().optional(),
  }),
  updateSchema: z.object({
    name: z.string().min(1).optional(),
    regionCode: z.string().optional(),
    specialties: z.string().optional(),
    mapView: z.enum(["WORLD", "GERMANY"]).optional(),
    x: z.number().min(0).max(100).optional(),
    y: z.number().min(0).max(100).optional(),
    labelDx: z.number().min(-100).max(100).optional(),
    labelDy: z.number().min(-100).max(100).optional(),
    uncertain: z.boolean().optional(),
  }),
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

// The six ISO 513 categories (isCategory) are fixed: they can't be deleted
// or moved/renamed, only have their descriptive fields edited. Everything
// else is a subcategory of the category sharing its iso513Group.
export const materialRouter = Router();

materialRouter.patch("/:id", async (req, res, next) => {
  const material = await prisma.material.findUnique({ where: { id: req.params.id } });
  if (
    material?.isCategory &&
    ((req.body?.name !== undefined && req.body.name !== material.name) ||
      (req.body?.iso513Group !== undefined && req.body.iso513Group !== material.iso513Group))
  ) {
    return res.status(400).json({ error: "ISO 513 categories are fixed: their name and group can't be changed." });
  }
  next();
});

materialRouter.delete("/:id", async (req, res, next) => {
  const material = await prisma.material.findUnique({ where: { id: req.params.id } });
  if (material?.isCategory) {
    return res.status(409).json({ error: "ISO 513 categories are fixed and can't be deleted." });
  }
  next();
});

materialRouter.use(crudRouter({
  delegate: prisma.material,
  createSchema: z.object({
    iso513Group: z.enum(["P", "M", "K", "N", "S", "H"]),
    name: z.string().min(1),
    description: z.string().optional(),
    commonUse: z.string().optional(),
    keyProperties: z.string().optional(),
    hardness: z.string().optional(),
  }),
  updateSchema: z.object({
    iso513Group: z.enum(["P", "M", "K", "N", "S", "H"]).optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    commonUse: z.string().optional(),
    keyProperties: z.string().optional(),
    hardness: z.string().optional(),
  }),
  orderBy: [{ iso513Group: "asc" }, { isCategory: "desc" }, { name: "asc" }],
}));

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
    image: z.string().optional(),
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
    image: z.string().nullable().optional(),
  }),
  orderBy: { designation: "asc" },
});

export const toolRouter = crudRouter({
  delegate: prisma.tool,
  createSchema: z.object({
    designation: z.string().min(1),
    item: z.string().optional(),
    tailConnection: z.string().min(1),
    tailSize: z.string().min(1),
    noseConnection: z.string().min(1),
    noseSize: z.string().min(1),
    notes: z.string().optional(),
    image: z.string().optional(),
  }),
  updateSchema: z.object({
    designation: z.string().min(1).optional(),
    item: z.string().optional(),
    tailConnection: z.string().min(1).optional(),
    tailSize: z.string().min(1).optional(),
    noseConnection: z.string().min(1).optional(),
    noseSize: z.string().min(1).optional(),
    notes: z.string().optional(),
    image: z.string().nullable().optional(),
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

type CrudOptions = Parameters<typeof crudRouter>[0];

function glossaryRouter(
  delegate: CrudOptions["delegate"],
  extraFields: z.ZodRawShape = {},
  options: Pick<CrudOptions, "include" | "mapData"> = {}
) {
  return crudRouter({
    ...options,
    delegate,
    createSchema: z
      .object({
        name: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
      })
      .extend(extraFields),
    updateSchema: z
      .object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().nullable().optional(),
      })
      .merge(z.object(extraFields).partial()),
    orderBy: { name: "asc" },
  });
}

export const shapeRouter = glossaryRouter(prisma.shape);
export const chipbreakerRouter = glossaryRouter(prisma.chipbreaker);
export const gradeRouter = glossaryRouter(
  prisma.grade,
  {
    substrateId: z.string().min(1).nullable().optional(),
    iso513Groups: z.array(z.enum(["P", "M", "K", "N", "S", "H"])).default([]),
    applicationIds: z.array(z.string().min(1)).default([]),
    // { [applicationId]: groups } for applications where the grade covers
    // only some of its iso513Groups.
    applicationGroups: z.record(z.string(), z.array(iso513GroupSchema)).optional(),
  },
  {
    include: { applications: { orderBy: { name: "asc" } }, substrate: true, applicationGroups: true },
    mapData: ({ applicationIds, substrateId, applicationGroups, ...data }, mode) => {
      if (applicationGroups !== undefined) {
        // Keep only real exceptions: applications the grade has, groups it
        // has, and lists that don't simply equal all of its groups.
        const groups: string[] | undefined = data.iso513Groups;
        const apps: string[] | undefined = applicationIds;
        const rows = Object.entries(applicationGroups as Record<string, string[]>)
          .filter(([appId]) => !apps || apps.includes(appId))
          .map(([applicationId, list]) => ({
            applicationId,
            iso513Groups: [...new Set(groups ? list.filter((g) => groups.includes(g)) : list)],
          }))
          .filter((r) => !groups || r.iso513Groups.length !== groups.length);
        data.applicationGroups = mode === "create" ? { create: rows } : { deleteMany: {}, create: rows };
      }
      if (applicationIds !== undefined) {
        const ids = applicationIds.map((id: string) => ({ id }));
        data.applications = mode === "create" ? { connect: ids } : { set: ids };
      }
      // Relation writes (applications) require the relation form here too.
      if (substrateId) data.substrate = { connect: { id: substrateId } };
      else if (substrateId === null && mode === "update") data.substrate = { disconnect: true };
      return data;
    },
  }
);

// Trials / case studies per grade. The list omits the (large) image so the
// Grades screen can show counts cheaply; GET /:id returns it.
export const gradeCaseRouter = Router();

const caseSelect = {
  id: true,
  gradeId: true,
  applicationId: true,
  iso513Group: true,
  title: true,
  notes: true,
  createdAt: true,
  application: { select: { id: true, name: true } },
} as const;

const gradeCaseSchema = z.object({
  gradeId: z.string().min(1),
  applicationId: z.string().min(1).nullable().optional(),
  iso513Group: iso513GroupSchema.nullable().optional(),
  title: z.string().min(1),
  notes: z.string().nullable().optional(),
  image: z.string().startsWith("data:image/", "Image must be an uploaded picture"),
});

gradeCaseRouter.get("/", async (req, res) => {
  const gradeId = typeof req.query.gradeId === "string" ? req.query.gradeId : undefined;
  res.json(await prisma.gradeCase.findMany({ where: { gradeId }, select: caseSelect, orderBy: { createdAt: "desc" } }));
});

gradeCaseRouter.get("/:id", async (req, res) => {
  const item = await prisma.gradeCase.findUnique({
    where: { id: req.params.id },
    include: { application: { select: { id: true, name: true } }, grade: { select: { id: true, name: true } } },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

gradeCaseRouter.post("/", async (req, res) => {
  const parsed = gradeCaseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid case" });
  try {
    res.status(201).json(await prisma.gradeCase.create({ data: parsed.data, select: caseSelect }));
  } catch (e: any) {
    res.status(409).json({ error: e.message ?? "Create failed" });
  }
});

gradeCaseRouter.patch("/:id", async (req, res) => {
  const parsed = gradeCaseSchema.omit({ gradeId: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid case" });
  try {
    res.json(await prisma.gradeCase.update({ where: { id: req.params.id }, data: parsed.data, select: caseSelect }));
  } catch (e: any) {
    res.status(404).json({ error: e.message ?? "Update failed" });
  }
});

gradeCaseRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.gradeCase.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// A substrate still used by grades can't be deleted, so grades don't
// silently lose it.
export const substrateRouter = Router();

substrateRouter.delete("/:id", async (req, res, next) => {
  const substrate = await prisma.substrate.findUnique({
    where: { id: req.params.id },
    include: { grades: { select: { name: true }, orderBy: { name: "asc" } } },
  });
  if (substrate && substrate.grades.length > 0) {
    return res.status(409).json({
      error: `"${substrate.name}" is used by ${substrate.grades.length} grade(s): ${substrate.grades
        .map((g) => g.name)
        .join(", ")}. Change their substrate first.`,
    });
  }
  next();
});

substrateRouter.use(
  glossaryRouter(
    prisma.substrate,
    {
      hardness: z.number().positive().nullable().optional(),
      toughness: z.number().positive().nullable().optional(),
    },
    {
      include: {
        grades: {
          select: { id: true, name: true, iso513Groups: true, applications: { select: { id: true, name: true } } },
          orderBy: { name: "asc" },
        },
      },
    }
  )
);

export const gradeOrderRouter = Router();

gradeOrderRouter.get("/", async (_req, res) => {
  res.json(await prisma.gradeColumnOrder.findMany());
});

const gradeOrderSchema = z.object({ gradeIds: z.array(z.string().min(1)) });

// :scope is "all" (the overall board) or the id of an Application (that
// application's board).
gradeOrderRouter.put("/:scope/:group", async (req, res) => {
  const { scope } = req.params;
  const group = iso513GroupSchema.safeParse(req.params.group);
  const parsed = gradeOrderSchema.safeParse(req.body);
  if (!group.success || !parsed.success) return res.status(400).json({ error: "Invalid group or gradeIds" });
  if (scope !== "all" && !(await prisma.application.findUnique({ where: { id: scope } }))) {
    return res.status(404).json({ error: "Unknown application" });
  }
  const gradeIds = [...new Set(parsed.data.gradeIds)];
  const order = await prisma.gradeColumnOrder.upsert({
    where: { scope_iso513Group: { scope, iso513Group: group.data } },
    update: { gradeIds },
    create: { scope, iso513Group: group.data, gradeIds },
  });
  res.json(order);
});

// Boxes on the Hard/Tough chart; :scope is "all" or an Application id, as
// for grade-order.
export const gradeChartRouter = Router();

gradeChartRouter.get("/", async (_req, res) => {
  res.json(await prisma.gradeChartBox.findMany());
});

const MIN_BOX = 4;
const chartBoxSchema = z
  .object({
    x: z.number().min(0).max(100 - MIN_BOX),
    y: z.number().min(0).max(100 - MIN_BOX),
    w: z.number().min(MIN_BOX).max(100),
    h: z.number().min(MIN_BOX).max(100),
  })
  .refine((b) => b.x + b.w <= 100.001 && b.y + b.h <= 100.001, "Box must stay inside the chart");

async function validScope(scope: string) {
  return scope === "all" || (await prisma.application.findUnique({ where: { id: scope } })) !== null;
}

gradeChartRouter.put("/:scope/:group/:gradeId", async (req, res) => {
  const { scope, gradeId } = req.params;
  const group = iso513GroupSchema.safeParse(req.params.group);
  const box = chartBoxSchema.safeParse(req.body);
  if (!group.success || !box.success) return res.status(400).json({ error: "Invalid group or box" });
  if (!(await validScope(scope))) return res.status(404).json({ error: "Unknown application" });
  if (!(await prisma.grade.findUnique({ where: { id: gradeId } }))) return res.status(404).json({ error: "Unknown grade" });
  const saved = await prisma.gradeChartBox.upsert({
    where: { scope_iso513Group_gradeId: { scope, iso513Group: group.data, gradeId } },
    update: box.data,
    create: { scope, iso513Group: group.data, gradeId, ...box.data },
  });
  res.json(saved);
});

// Resets one chart to the default layout derived from the board ranking.
gradeChartRouter.delete("/:scope/:group", async (req, res) => {
  const group = iso513GroupSchema.safeParse(req.params.group);
  if (!group.success) return res.status(400).json({ error: "Invalid group" });
  await prisma.gradeChartBox.deleteMany({ where: { scope: req.params.scope, iso513Group: group.data } });
  res.status(204).end();
});

// An application still selected on grades can't be deleted, so it doesn't
// silently disappear from them.
export const applicationRouter = Router();

applicationRouter.delete("/:id", async (req, res, next) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
    include: { grades: { select: { name: true }, orderBy: { name: "asc" } } },
  });
  if (application && application.grades.length > 0) {
    return res.status(409).json({
      error: `"${application.name}" is used by ${application.grades.length} grade(s): ${application.grades
        .map((g) => g.name)
        .join(", ")}. Remove it from those grades first.`,
    });
  }
  // Its board's saved order and chart layout go with it.
  if (application) {
    await prisma.gradeColumnOrder.deleteMany({ where: { scope: application.id } });
    await prisma.gradeChartBox.deleteMany({ where: { scope: application.id } });
  }
  next();
});

applicationRouter.use(glossaryRouter(prisma.application));
export const coatingRouter = glossaryRouter(prisma.coating);

export const testReportRouter = crudRouter({
  delegate: prisma.testReport,
  createSchema: z.object({
    insertId: z.string().min(1),
    testNo: z.string().min(1),
    testDate: z.coerce.date(),
    description: z.string().optional(),
    result: z.string().min(1),
    country: z.string().optional(),
    customer: z.string().optional(),
    performer: z.string().optional(),
  }),
  updateSchema: z.object({
    insertId: z.string().min(1).optional(),
    testNo: z.string().min(1).optional(),
    testDate: z.coerce.date().optional(),
    description: z.string().optional(),
    result: z.string().min(1).optional(),
    country: z.string().optional(),
    customer: z.string().optional(),
    performer: z.string().optional(),
  }),
  include: { insert: true, files: true },
  orderBy: { testDate: "desc" },
});

export const testReportFileRouter = crudRouter({
  delegate: prisma.testReportFile,
  createSchema: z.object({
    testReportId: z.string().min(1),
    fileName: z.string().min(1),
    fileData: z.string().min(1),
    description: z.string().optional(),
    fileDate: z.coerce.date().optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    fileName: z.string().min(1).optional(),
    fileData: z.string().min(1).optional(),
    description: z.string().optional(),
    fileDate: z.coerce.date().nullable().optional(),
    notes: z.string().optional(),
  }),
  orderBy: { createdAt: "desc" },
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
