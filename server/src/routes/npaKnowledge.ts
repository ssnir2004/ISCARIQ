import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

export const npaKnowledgeRouter = Router();

const APPLICATION_CATEGORIES = [
  "MILLING",
  "TURNING",
  "GROOVING",
  "PARTING",
  "DRILLING",
  "THREADING",
  "REAMING",
  "BORING",
  "OTHER",
] as const;

const AVAILABILITIES = ["IN_STOCK", "COMING_SOON", "ASK_PRICING", "NOT_SPECIFIED"] as const;
const ISO513_GROUPS = ["P", "M", "K", "N", "S", "H"] as const;

const bodySchema = z.object({
  npaNumber: z.string().min(1),
  title: z.string().min(1),
  publicationDate: z.coerce.date().optional(),
  productFamily: z.string().min(1),
  subFamily: z.string().optional(),
  insertDesignation: z.string().optional(),
  applicationCategory: z.enum(APPLICATION_CATEGORIES),
  subApplications: z.array(z.string()).default([]),
  iso513Groups: z.array(z.enum(ISO513_GROUPS)).min(1),
  workpieceMaterials: z.array(z.string()).default([]),
  innovation: z.string().optional(),
  advantages: z.array(z.string()).default([]),
  recommendedUse: z.string().min(1),
  bestForConditions: z.array(z.string()).default([]),
  avoidWhen: z.string().optional(),
  keySellingMessage: z.string().optional(),
  technicalNotes: z.string().optional(),
  pricingNotes: z.string().optional(),
  availability: z.enum(AVAILABILITIES).optional(),
  npaFileName: z.string().optional(),
  npaFileData: z.string().optional(),
  imageData: z.string().optional(),
  sourceLink: z.string().optional(),
});

npaKnowledgeRouter.get("/", async (_req, res) => {
  const items = await prisma.npaKnowledgeItem.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

npaKnowledgeRouter.get("/:id", async (req, res) => {
  const item = await prisma.npaKnowledgeItem.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

npaKnowledgeRouter.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const item = await prisma.npaKnowledgeItem.create({ data: parsed.data });
    res.status(201).json(item);
  } catch (e: any) {
    res.status(409).json({ error: e.message ?? "Create failed" });
  }
});

npaKnowledgeRouter.patch("/:id", async (req, res) => {
  const parsed = bodySchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const item = await prisma.npaKnowledgeItem.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(item);
  } catch (e: any) {
    res.status(404).json({ error: e.message ?? "Update failed" });
  }
});

npaKnowledgeRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.npaKnowledgeItem.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e: any) {
    res.status(404).json({ error: e.message ?? "Delete failed" });
  }
});

// ---------- Recommendation Finder ----------
// Rule-based scoring (no AI/external calls). Kept as small, isolated
// functions so an AI-assisted scorer or NPA-document parser can replace or
// augment calculateRecommendationScore()/parseNpaDocument() later without
// touching the route layer.

const recommendSchema = z.object({
  applicationCategory: z.enum(APPLICATION_CATEGORIES).optional(),
  iso513Group: z.enum(ISO513_GROUPS).optional(),
  subApplication: z.string().optional(),
  advantageTags: z.array(z.string()).default([]),
  conditionTags: z.array(z.string()).default([]),
  searchText: z.string().optional(),
});

function norm(s: string) {
  return s.trim().toLowerCase();
}

function tagMatches(tag: string, list: string[]) {
  const t = norm(tag);
  return list.some((v) => norm(v) === t || norm(v).includes(t) || t.includes(norm(v)));
}

// Placeholder for future AI-assisted parsing of a raw NPA document (PDF/MSG)
// into structured NpaKnowledgeItem fields. Not implemented in v1.
export async function parseNpaDocument(_fileData: string, _fileName: string): Promise<Partial<z.infer<typeof bodySchema>>> {
  throw new Error("parseNpaDocument is not implemented yet");
}

// Placeholder for future AI-assisted field extraction from free text.
export async function extractNpaKnowledgeFields(_rawText: string): Promise<Partial<z.infer<typeof bodySchema>>> {
  throw new Error("extractNpaKnowledgeFields is not implemented yet");
}

export function calculateRecommendationScore(
  item: {
    applicationCategory: string;
    iso513Groups: string[];
    subApplications: string[];
    advantages: string[];
    bestForConditions: string[];
    innovation: string | null;
    recommendedUse: string;
  },
  query: z.infer<typeof recommendSchema>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (query.iso513Group && item.iso513Groups.includes(query.iso513Group)) {
    score += 50;
    reasons.push(`ISO 513 group ${query.iso513Group} match`);
  }
  if (query.applicationCategory && item.applicationCategory === query.applicationCategory) {
    score += 35;
    reasons.push(`Application category ${query.applicationCategory} match`);
  }
  if (query.subApplication && tagMatches(query.subApplication, item.subApplications)) {
    score += 20;
    reasons.push(`Sub-application "${query.subApplication}" match`);
  }
  for (const tag of query.advantageTags) {
    if (tagMatches(tag, item.advantages)) {
      score += 20;
      reasons.push(`Advantage "${tag}" match`);
    }
  }
  for (const tag of query.conditionTags) {
    if (tagMatches(tag, item.bestForConditions)) {
      score += 15;
      reasons.push(`Condition "${tag}" match`);
    }
  }
  if (query.searchText) {
    const needle = norm(query.searchText);
    const haystack = `${item.innovation ?? ""} ${item.recommendedUse}`.toLowerCase();
    if (needle && haystack.includes(needle)) {
      score += 10;
      reasons.push(`"${query.searchText}" found in innovation/recommended use`);
    }
  }

  return { score, reasons };
}

npaKnowledgeRouter.post("/recommend", async (req, res) => {
  const parsed = recommendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const items = await prisma.npaKnowledgeItem.findMany({ orderBy: { createdAt: "desc" } });
  const ranked = items
    .map((item) => ({ item, ...calculateRecommendationScore(item, parsed.data) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json(ranked);
});
