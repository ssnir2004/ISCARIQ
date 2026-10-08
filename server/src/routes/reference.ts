import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import { crudRouter } from "../lib/crud.js";

// Material groups: the six ISO 513 groups plus SM (Sintered Materials).
const iso513GroupSchema = z.enum(["P", "M", "K", "N", "S", "H", "SM"]);
const gradeFamilySchema = z.enum(["CARBIDE", "CBN", "CERAMIC", "PCD"]);
type GradeFamily = z.infer<typeof gradeFamilySchema>;

// ISO 513 groups each grade family can be used for.
const FAMILY_GROUPS: Record<GradeFamily, string[]> = {
  CARBIDE: ["P", "M", "K", "N", "S", "H"],
  CBN: ["K", "S", "H", "SM"],
  CERAMIC: ["K", "S", "H"],
  PCD: ["N"],
};

// Board scopes (grade order, chart boxes) are "all" or an Application id,
// prefixed with "<FAMILY>:" for the non-carbide grade screens so each family
// keeps its own layout, e.g. "CBN:app-milling".
async function validScope(scope: string) {
  // A "~<grade set id>" suffix marks a grade group's own chart of a board.
  const bare = scope.replace(/^(CBN|CERAMIC|PCD):/, "").replace(/~[^~]+$/, "");
  return bare === "all" || (await prisma.application.findUnique({ where: { id: bare } })) !== null;
}

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
    iso513Group: iso513GroupSchema,
    name: z.string().min(1),
    description: z.string().optional(),
    commonUse: z.string().optional(),
    keyProperties: z.string().optional(),
    hardness: z.string().optional(),
    image: z.string().startsWith("data:image/", "Image must be an uploaded picture").nullable().optional(),
  }),
  updateSchema: z.object({
    iso513Group: iso513GroupSchema.optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    commonUse: z.string().optional(),
    keyProperties: z.string().optional(),
    hardness: z.string().optional(),
    image: z.string().startsWith("data:image/", "Image must be an uploaded picture").nullable().optional(),
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
  options: Pick<CrudOptions, "include" | "mapData" | "listWhere"> = {}
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
// Rejects materials a grade's family can't be used for (e.g. P on a CBN
// grade). The family comes from the body on create, from the DB on update.
async function checkFamilyGroups(req: Request, res: Response, next: NextFunction) {
  const groups: unknown = req.body?.iso513Groups;
  if (!Array.isArray(groups)) return next();
  let family: GradeFamily = "CARBIDE";
  if (req.method === "POST") {
    const parsed = gradeFamilySchema.safeParse(req.body?.family);
    if (parsed.success) family = parsed.data;
  } else {
    const grade = await prisma.grade.findUnique({ where: { id: req.params.id }, select: { family: true } });
    if (grade) family = grade.family;
  }
  const invalid = groups.filter((g) => !FAMILY_GROUPS[family].includes(String(g)));
  if (invalid.length > 0) {
    return res.status(400).json({ error: `${family} grades can only be used for ${FAMILY_GROUPS[family].join(", ")} (not ${invalid.join(", ")}).` });
  }
  next();
}

const gradeCrudRouter = glossaryRouter(
  prisma.grade,
  {
    family: gradeFamilySchema.optional(),
    setIds: z.array(z.string().min(1)).optional(),
    typeId: z.string().min(1).nullable().optional(),
    chartNote: z.string().trim().max(200).nullable().optional(),
    // Competitor grades it replaces, in order; rows without a name are dropped.
    competitors: z.array(z.object({ brand: z.string().trim().max(100).default(""), name: z.string().trim().max(100) })).optional(),
    // { [material]: setIds } for materials where the grade is in only some of
    // its groups.
    materialSets: z.record(z.string(), z.array(z.string().min(1))).optional(),
    substrateId: z.string().min(1).nullable().optional(),
    iso513Groups: z.array(iso513GroupSchema).default([]),
    applicationIds: z.array(z.string().min(1)).default([]),
    // { [applicationId]: groups } for applications where the grade covers
    // only some of its iso513Groups.
    applicationGroups: z.record(z.string(), z.array(iso513GroupSchema)).optional(),
  },
  {
    include: { applications: { orderBy: { name: "asc" } }, substrate: true, applicationGroups: true, sets: { orderBy: { name: "asc" } }, materialSets: true, type: true, competitors: { orderBy: { position: "asc" } } },
    // ?family=CBN lists one family's grades (each has its own screen).
    listWhere: (req) => {
      const family = gradeFamilySchema.safeParse(req.query.family);
      return family.success ? { family: family.data } : undefined;
    },
    mapData: ({ applicationIds, substrateId, setIds, typeId, applicationGroups, materialSets, competitors, ...data }, mode) => {
      if (competitors !== undefined) {
        const rows = (competitors as { brand: string; name: string }[])
          .filter((c) => c.name)
          .map((c, position) => ({ brand: c.brand, name: c.name, position }));
        data.competitors = mode === "create" ? { create: rows } : { deleteMany: {}, create: rows };
      }
      if (typeId) data.type = { connect: { id: typeId } };
      else if (typeId === null && mode === "update") data.type = { disconnect: true };
      if (materialSets !== undefined) {
        // Keep only real exceptions: materials the grade has, groups it has,
        // and lists that don't simply equal all of its groups.
        const groups: string[] | undefined = data.iso513Groups;
        const sets: string[] | undefined = setIds;
        const rows = Object.entries(materialSets as Record<string, string[]>)
          .filter(([g]) => iso513GroupSchema.safeParse(g).success && (!groups || groups.includes(g)))
          .map(([iso513Group, list]) => ({ iso513Group, setIds: [...new Set(sets ? list.filter((id) => sets.includes(id)) : list)] }))
          .filter((r) => !sets || r.setIds.length !== sets.length);
        data.materialSets = mode === "create" ? { create: rows } : { deleteMany: {}, create: rows };
      }
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
      if (setIds !== undefined) {
        const ids = [...new Set(setIds as string[])].map((id) => ({ id }));
        data.sets = mode === "create" ? { connect: ids } : { set: ids };
      }
      return data;
    },
  }
);

// A grade's groups must exist and belong to the grade's family.
async function checkGradeSet(req: Request, res: Response, next: NextFunction) {
  const setIds = req.body?.setIds;
  if (!Array.isArray(setIds) || setIds.length === 0) return next();
  let family: string | undefined = req.body?.family;
  if (!family && req.params.id) family = (await prisma.grade.findUnique({ where: { id: req.params.id }, select: { family: true } }))?.family;
  const ids = setIds.filter((id): id is string => typeof id === "string");
  const sets = await prisma.gradeSet.findMany({ where: { id: { in: ids } } });
  if (sets.length !== new Set(ids).size) return res.status(400).json({ error: "A selected group no longer exists." });
  const wrong = sets.find((s) => s.family !== (family ?? "CARBIDE"));
  if (wrong) return res.status(400).json({ error: `"${wrong.name}" is a group of ${wrong.family} grades.` });
  next();
}

// A grade's type must exist and belong to the grade's family.
async function checkGradeType(req: Request, res: Response, next: NextFunction) {
  const typeId = req.body?.typeId;
  if (typeof typeId !== "string" || !typeId) return next();
  let family: string | undefined = req.body?.family;
  if (!family && req.params.id) family = (await prisma.grade.findUnique({ where: { id: req.params.id }, select: { family: true } }))?.family;
  const type = await prisma.gradeType.findUnique({ where: { id: typeId } });
  if (!type) return res.status(400).json({ error: "That type no longer exists." });
  if (type.family !== (family ?? "CARBIDE")) return res.status(400).json({ error: `"${type.name}" is a type of ${type.family} grades.` });
  next();
}

export const gradeRouter = Router();
// Competitor brands already used (suggestions in the grade form).
gradeRouter.get("/competitor-brands", async (_req, res) => {
  const rows = await prisma.gradeCompetitor.findMany({ distinct: ["brand"], select: { brand: true }, orderBy: { brand: "asc" } });
  res.json(rows.map((r) => r.brand).filter(Boolean));
});
gradeRouter.post("/", checkFamilyGroups, checkGradeSet, checkGradeType);
gradeRouter.patch("/:id", checkFamilyGroups, checkGradeSet, checkGradeType);
gradeRouter.use(gradeCrudRouter);

// Per-family name lists managed from the grade form: GET ?family=CBN,
// POST { name, family }, PATCH { name }, DELETE (grades lose it).
type FamilyListDelegate = {
  findMany(args: object): Promise<unknown>;
  create(args: { data: { name: string; family: GradeFamily } }): Promise<unknown>;
  update(args: { where: { id: string }; data: { name: string } }): Promise<unknown>;
  deleteMany(args: { where: { id: string } }): Promise<unknown>;
};

function familyListRouter(delegate: FamilyListDelegate, noun: string) {
  const router = Router();
  const nameSchema = z.string().trim().min(1, "Name is required");

  async function save(res: Response, run: () => Promise<unknown>, name: string) {
    try {
      res.json(await run());
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return res.status(409).json({ error: `A ${noun} named "${name}" already exists.` });
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return res.status(404).json({ error: "Not found" });
      throw e;
    }
  }

  router.get("/", async (req, res) => {
    const family = gradeFamilySchema.safeParse(req.query.family);
    res.json(await delegate.findMany({ where: family.success ? { family: family.data } : undefined, orderBy: { name: "asc" } }));
  });

  router.post("/", async (req, res) => {
    const parsed = z.object({ name: nameSchema, family: gradeFamilySchema }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? `Invalid ${noun}` });
    res.status(201);
    await save(res, () => delegate.create({ data: parsed.data }), parsed.data.name);
  });

  router.patch("/:id", async (req, res) => {
    const parsed = z.object({ name: nameSchema }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? `Invalid ${noun}` });
    await save(res, () => delegate.update({ where: { id: req.params.id }, data: parsed.data }), parsed.data.name);
  });

  router.delete("/:id", async (req, res) => {
    await delegate.deleteMany({ where: { id: req.params.id } });
    res.status(204).end();
  });
  return router;
}

// Grade groups (GradeSet): each group gets its own chart.
export const gradeSetRouter = familyListRouter(prisma.gradeSet as unknown as FamilyListDelegate, "group");
// Grade types (GradeType): the Grades map has a box per type.
export const gradeTypeRouter = familyListRouter(prisma.gradeType as unknown as FamilyListDelegate, "type");

// Rules of thumb per grade family: GET ?family=CBN (in order), POST
// { family, text } (added last), PATCH /:id { text }, DELETE /:id,
// PUT /order { family, ids } (new order).
export const gradeRuleRouter = Router();
const ruleText = z.string().trim().min(1, "Write the rule").max(1000);

gradeRuleRouter.get("/", async (req, res) => {
  const family = gradeFamilySchema.safeParse(req.query.family);
  res.json(
    await prisma.gradeRule.findMany({
      where: family.success ? { family: family.data } : undefined,
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    })
  );
});

gradeRuleRouter.post("/", async (req, res) => {
  const parsed = z.object({ family: gradeFamilySchema, text: ruleText }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid rule" });
  const last = await prisma.gradeRule.aggregate({ where: { family: parsed.data.family }, _max: { position: true } });
  res.status(201).json(await prisma.gradeRule.create({ data: { ...parsed.data, position: (last._max.position ?? -1) + 1 } }));
});

gradeRuleRouter.put("/order", async (req, res) => {
  const parsed = z.object({ family: gradeFamilySchema, ids: z.array(z.string().min(1)) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid order" });
  await prisma.$transaction(
    parsed.data.ids.map((id, position) => prisma.gradeRule.updateMany({ where: { id, family: parsed.data.family }, data: { position } }))
  );
  res.status(204).end();
});

gradeRuleRouter.patch("/:id", async (req, res) => {
  const parsed = z.object({ text: ruleText }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid rule" });
  const { count } = await prisma.gradeRule.updateMany({ where: { id: req.params.id }, data: parsed.data });
  if (count === 0) return res.status(404).json({ error: "Not found" });
  res.json(await prisma.gradeRule.findUnique({ where: { id: req.params.id } }));
});

gradeRuleRouter.delete("/:id", async (req, res) => {
  await prisma.gradeRule.deleteMany({ where: { id: req.params.id } });
  res.status(204).end();
});

// Recommended cutting conditions (GradeRecommendation): GET ?family= or
// ?gradeId=, POST, PATCH /:id, DELETE /:id. Grades must be of the
// recommendation's family and the material one its grades can be used for.
export const gradeRecommendationRouter = Router();

const recommendationInclude = {
  material: true,
  grades: { select: { id: true, name: true }, orderBy: { name: "asc" } },
  applications: { select: { id: true, name: true }, orderBy: { name: "asc" } },
} as const;

const recommendationSchema = z
  .object({
    family: gradeFamilySchema,
    materialId: z.string().min(1, "Choose a work material"),
    gradeIds: z.array(z.string().min(1)).min(1, "Choose at least one grade"),
    applicationIds: z.array(z.string().min(1)).default([]),
    rough: z.boolean().default(false),
    semiFinish: z.boolean().default(false),
    finish: z.boolean().default(false),
    vcMin: z.number().positive().nullable().optional(),
    vcRec: z.number().positive().nullable().optional(),
    vcMax: z.number().positive().nullable().optional(),
    apMin: z.number().positive().nullable().optional(),
    apMax: z.number().positive().nullable().optional(),
    feedMin: z.number().positive().nullable().optional(),
    feedMax: z.number().positive().nullable().optional(),
    dry: z.boolean().default(false),
    wet: z.boolean().default(false),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((r) => !(r.vcMin && r.vcRec && r.vcMin > r.vcRec) && !(r.vcRec && r.vcMax && r.vcRec > r.vcMax) && !(r.vcMin && r.vcMax && r.vcMin > r.vcMax), {
    message: "Cutting speeds must be min ≤ recommended ≤ max",
  })
  .refine((r) => !(r.apMin && r.apMax && r.apMin > r.apMax), { message: "Depth of cut must be min ≤ max" })
  .refine((r) => !(r.feedMin && r.feedMax && r.feedMin > r.feedMax), { message: "Feed must be min ≤ max" });

type RecommendationInput = z.infer<typeof recommendationSchema>;

async function checkRecommendation(data: RecommendationInput) {
  const material = await prisma.material.findUnique({ where: { id: data.materialId } });
  if (!material) return "That work material no longer exists.";
  if (!FAMILY_GROUPS[data.family].includes(material.iso513Group)) {
    return `${data.family} grades aren't used for ${material.name} (ISO ${material.iso513Group}).`;
  }
  const grades = await prisma.grade.findMany({ where: { id: { in: data.gradeIds } }, select: { family: true } });
  if (grades.length !== new Set(data.gradeIds).size) return "A selected grade no longer exists.";
  if (grades.some((g) => g.family !== data.family)) return `All grades must be ${data.family} grades.`;
  return null;
}

function recommendationData({ gradeIds, applicationIds, ...rest }: RecommendationInput, mode: "create" | "update") {
  const grades = [...new Set(gradeIds)].map((id) => ({ id }));
  const applications = [...new Set(applicationIds)].map((id) => ({ id }));
  return {
    ...rest,
    notes: rest.notes || null,
    grades: mode === "create" ? { connect: grades } : { set: grades },
    applications: mode === "create" ? { connect: applications } : { set: applications },
  };
}

gradeRecommendationRouter.get("/", async (req, res) => {
  const family = gradeFamilySchema.safeParse(req.query.family);
  const gradeId = typeof req.query.gradeId === "string" ? req.query.gradeId : undefined;
  res.json(
    await prisma.gradeRecommendation.findMany({
      where: { ...(family.success ? { family: family.data } : {}), ...(gradeId ? { grades: { some: { id: gradeId } } } : {}) },
      include: recommendationInclude,
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    })
  );
});

gradeRecommendationRouter.post("/", async (req, res) => {
  const parsed = recommendationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid recommendation" });
  const problem = await checkRecommendation(parsed.data);
  if (problem) return res.status(400).json({ error: problem });
  const last = await prisma.gradeRecommendation.aggregate({ where: { family: parsed.data.family }, _max: { position: true } });
  res.status(201).json(
    await prisma.gradeRecommendation.create({
      data: { ...recommendationData(parsed.data, "create"), position: (last._max.position ?? -1) + 1 },
      include: recommendationInclude,
    })
  );
});

gradeRecommendationRouter.patch("/:id", async (req, res) => {
  const parsed = recommendationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid recommendation" });
  const problem = await checkRecommendation(parsed.data);
  if (problem) return res.status(400).json({ error: problem });
  const exists = await prisma.gradeRecommendation.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) return res.status(404).json({ error: "Not found" });
  res.json(
    await prisma.gradeRecommendation.update({
      where: { id: req.params.id },
      data: recommendationData(parsed.data, "update"),
      include: recommendationInclude,
    })
  );
});

gradeRecommendationRouter.delete("/:id", async (req, res) => {
  await prisma.gradeRecommendation.deleteMany({ where: { id: req.params.id } });
  res.status(204).end();
});

// Tool families (ToolLine): GET ?family= (lines with grades of that family)
// or ?gradeId=, POST, PATCH /:id, DELETE /:id.
export const toolLineRouter = Router();

const toolLineInclude = {
  grades: { select: { id: true, name: true, family: true }, orderBy: { name: "asc" } },
  applications: { select: { id: true, name: true }, orderBy: { name: "asc" } },
  subApplication: true,
} as const;

const toolLineSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  gradeIds: z.array(z.string().min(1)).min(1, "Choose at least one grade"),
  applicationIds: z.array(z.string().min(1)).default([]),
  subApplicationId: z.string().min(1).nullable().optional(),
  insert: z.string().trim().max(100).nullable().optional(),
  image: z.string().startsWith("data:image/", "Image must be an uploaded picture").nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

function toolLineData({ gradeIds, applicationIds, subApplicationId, ...rest }: z.infer<typeof toolLineSchema>, mode: "create" | "update") {
  const grades = [...new Set(gradeIds)].map((id) => ({ id }));
  const applications = [...new Set(applicationIds)].map((id) => ({ id }));
  return {
    ...rest,
    insert: rest.insert || null,
    notes: rest.notes || null,
    image: rest.image || null,
    grades: mode === "create" ? { connect: grades } : { set: grades },
    applications: mode === "create" ? { connect: applications } : { set: applications },
    subApplication: subApplicationId ? { connect: { id: subApplicationId } } : mode === "update" ? { disconnect: true } : undefined,
  };
}

async function saveToolLine(res: Response, run: () => Promise<unknown>, name: string) {
  try {
    res.json(await run());
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: `A tool named "${name}" already exists.` });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P2025" || e.code === "P2018")) {
      return res.status(400).json({ error: "A selected grade, application or sub-application no longer exists." });
    }
    throw e;
  }
}

toolLineRouter.get("/", async (req, res) => {
  const family = gradeFamilySchema.safeParse(req.query.family);
  const gradeId = typeof req.query.gradeId === "string" ? req.query.gradeId : undefined;
  res.json(
    await prisma.toolLine.findMany({
      where: {
        ...(family.success ? { grades: { some: { family: family.data } } } : {}),
        ...(gradeId ? { grades: { some: { id: gradeId } } } : {}),
      },
      include: toolLineInclude,
      orderBy: { name: "asc" },
    })
  );
});

toolLineRouter.post("/", async (req, res) => {
  const parsed = toolLineSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid tool" });
  res.status(201);
  await saveToolLine(res, () => prisma.toolLine.create({ data: toolLineData(parsed.data, "create"), include: toolLineInclude }), parsed.data.name);
});

toolLineRouter.patch("/:id", async (req, res) => {
  const parsed = toolLineSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid tool" });
  const exists = await prisma.toolLine.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) return res.status(404).json({ error: "Not found" });
  await saveToolLine(
    res,
    () => prisma.toolLine.update({ where: { id: req.params.id }, data: toolLineData(parsed.data, "update"), include: toolLineInclude }),
    parsed.data.name
  );
});

toolLineRouter.delete("/:id", async (req, res) => {
  await prisma.toolLine.deleteMany({ where: { id: req.params.id } });
  res.status(204).end();
});

// Sub-applications for tool lines: GET (all), POST { name }.
export const toolSubApplicationRouter = Router();

toolSubApplicationRouter.get("/", async (_req, res) => {
  res.json(await prisma.toolSubApplication.findMany({ orderBy: { name: "asc" } }));
});

toolSubApplicationRouter.post("/", async (req, res) => {
  const parsed = z.object({ name: z.string().trim().min(1, "Name is required").max(100) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid name" });
  try {
    res.status(201).json(await prisma.toolSubApplication.create({ data: parsed.data }));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: `"${parsed.data.name}" already exists.` });
    }
    throw e;
  }
});

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

// :scope is a board scope (see validScope): "all" or an Application id (that
// application's board).
gradeOrderRouter.put("/:scope/:group", async (req, res) => {
  const { scope } = req.params;
  const group = iso513GroupSchema.safeParse(req.params.group);
  const parsed = gradeOrderSchema.safeParse(req.body);
  if (!group.success || !parsed.success) return res.status(400).json({ error: "Invalid group or gradeIds" });
  if (!(await validScope(scope))) return res.status(404).json({ error: "Unknown application" });
  const gradeIds = [...new Set(parsed.data.gradeIds)];
  const order = await prisma.gradeColumnOrder.upsert({
    where: { scope_iso513Group: { scope, iso513Group: group.data } },
    update: { gradeIds },
    create: { scope, iso513Group: group.data, gradeIds },
  });
  res.json(order);
});

// Boxes on the Hard/Tough chart; :scope is a board scope (see validScope), as
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
    // Stacking order: higher is drawn in front.
    z: z.number().int().optional(),
  })
  .refine((b) => b.x + b.w <= 100.001 && b.y + b.h <= 100.001, "Box must stay inside the chart");

// Merges several grades into one block: they all get the same box and a
// shared mergeId. Registered before "/:scope/:group/:gradeId" so "merge" and
// "block" aren't read as grade ids.
const mergeSchema = z.object({ gradeIds: z.array(z.string().min(1)).min(2), box: chartBoxSchema });

gradeChartRouter.put("/:scope/:group/merge", async (req, res) => {
  const { scope } = req.params;
  const group = iso513GroupSchema.safeParse(req.params.group);
  const parsed = mergeSchema.safeParse(req.body);
  if (!group.success || !parsed.success) return res.status(400).json({ error: "Pick at least two grades to merge" });
  if (!(await validScope(scope))) return res.status(404).json({ error: "Unknown application" });
  const gradeIds = [...new Set(parsed.data.gradeIds)];
  if ((await prisma.grade.count({ where: { id: { in: gradeIds } } })) !== gradeIds.length) {
    return res.status(404).json({ error: "Unknown grade" });
  }
  const mergeId = randomUUID();
  const box = parsed.data.box;
  await prisma.$transaction(
    gradeIds.map((gradeId) =>
      prisma.gradeChartBox.upsert({
        where: { scope_iso513Group_gradeId: { scope, iso513Group: group.data, gradeId } },
        update: { ...box, mergeId },
        create: { scope, iso513Group: group.data, gradeId, ...box, mergeId },
      })
    )
  );
  res.json({ mergeId });
});

// Moves / resizes a merged block (every member keeps the same box).
gradeChartRouter.put("/:scope/:group/block/:mergeId", async (req, res) => {
  const box = chartBoxSchema.safeParse(req.body);
  if (!box.success) return res.status(400).json({ error: "Invalid box" });
  const { count } = await prisma.gradeChartBox.updateMany({ where: { mergeId: req.params.mergeId }, data: box.data });
  if (count === 0) return res.status(404).json({ error: "Block not found" });
  res.status(204).end();
});

// Splits a merged block: ?keep=<gradeId> keeps the block's box for that
// grade; the others go back to the default layout.
gradeChartRouter.delete("/:scope/:group/block/:mergeId", async (req, res) => {
  const keep = typeof req.query.keep === "string" ? req.query.keep : undefined;
  await prisma.$transaction([
    prisma.gradeChartBox.deleteMany({ where: { mergeId: req.params.mergeId, ...(keep ? { gradeId: { not: keep } } : {}) } }),
    prisma.gradeChartBox.updateMany({ where: { mergeId: req.params.mergeId }, data: { mergeId: null } }),
  ]);
  res.status(204).end();
});

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
    const scopes = { OR: [{ scope: application.id }, { scope: { endsWith: `:${application.id}` } }] };
    await prisma.gradeColumnOrder.deleteMany({ where: scopes });
    await prisma.gradeChartBox.deleteMany({ where: scopes });
  }
  next();
});

applicationRouter.use(glossaryRouter(prisma.application));
export const coatingRouter = glossaryRouter(prisma.coating);

// IMC group companies: name, description and building image, plus field of
// activity and location.
export const imcCompanyRouter = glossaryRouter(prisma.imcCompany, {
  activity: z.string().trim().max(200).nullable().optional(),
  country: z.string().trim().max(100).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  website: z.string().trim().max(300).nullable().optional(),
  logo: z.string().startsWith("data:image/", "Logo must be an uploaded picture").nullable().optional(),
});

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
