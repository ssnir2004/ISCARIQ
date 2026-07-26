import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

export const advisorRouter = Router();

const advisorQuerySchema = z.object({
  operationType: z.enum(["TURNING", "MILLING", "DRILLING", "GROOVING", "THREADING", "BORING"]),
  materialId: z.string().min(1),
  problemTagIds: z.array(z.string()).default([]),
  ap: z.number().optional(),
});

advisorRouter.post("/", async (req, res) => {
  const parsed = advisorQuerySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { operationType, materialId, problemTagIds, ap } = parsed.data;

  const conditions = await prisma.cuttingCondition.findMany({
    where: { operationType, materialId },
    include: { insert: { include: { problemMatches: { include: { problemTag: true } } } }, material: true },
  });

  const inApRange = (c: (typeof conditions)[number]) => {
    if (ap === undefined) return true;
    if (c.apMin !== null && ap < c.apMin) return false;
    if (c.apMax !== null && ap > c.apMax) return false;
    return true;
  };

  const ranked = conditions
    .map((c) => {
      const relevantMatches = c.insert.problemMatches.filter(
        (m) => problemTagIds.length === 0 || problemTagIds.includes(m.problemTagId)
      );
      const problemScore = relevantMatches.reduce((sum, m) => sum + 1 + m.priority, 0);
      const apFit = inApRange(c);
      return {
        insert: c.insert,
        cuttingCondition: {
          id: c.id,
          apMin: c.apMin,
          apMax: c.apMax,
          vcMin: c.vcMin,
          vcMax: c.vcMax,
          feedMin: c.feedMin,
          feedMax: c.feedMax,
          coolant: c.coolant,
          notes: c.notes,
        },
        material: c.material,
        matchedProblems: relevantMatches.map((m) => m.problemTag.name),
        score: problemScore + (apFit ? 1 : 0),
        apFit,
      };
    })
    // when problem tags were requested, only surface inserts that solve at least one of them
    .filter((r) => problemTagIds.length === 0 || r.matchedProblems.length > 0)
    .sort((a, b) => b.score - a.score || (b.apFit ? 1 : 0) - (a.apFit ? 1 : 0));

  res.json({ recommendations: ranked });
});
