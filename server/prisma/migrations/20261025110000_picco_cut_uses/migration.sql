-- One-time: the PICCO-CUT brand (Solutions, Groove-Turn) gets its uses and
-- inserts, and a description if it has none. Uses it already has (same name,
-- ignoring case) are kept as they are; the new ones follow them.
UPDATE "Innovation" SET "description" = $u$Mini inserts (PICCO) for small bores: internal turning, profiling, boring, grooving, face grooving, threading and chamfering.$u$
WHERE "name" = 'PICCO-CUT' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_use_picco_cut_0', $u$Inserts for Internal Turning and Profiling$u$, 0, $u$[{"name": "PICCO R/L 090"}]$u$::jsonb),
  ('innovation_use_picco_cut_1', $u$Inserts for Internal Chamfering$u$, 1, $u$[{"name": "PICCO R/L 520", "note": "45°, 60°"}]$u$::jsonb),
  ('innovation_use_picco_cut_2', $u$Inserts with a 60° Internal Thread Profile for 2.4 mm Min. Bore Diameter$u$, 2, $u$[{"name": "PICCO R/L-60°-Thread"}]$u$::jsonb),
  ('innovation_use_picco_cut_3', $u$Inserts for Internal Turning and Chamfering Hard Steel - Up to 65 HRC$u$, 3, $u$[{"name": "PICCO R/LHD 050"}]$u$::jsonb),
  ('innovation_use_picco_cut_4', $u$Profiling Inserts with Coolant Channel Optimized for Machining Medical Parts$u$, 4, $u$[{"name": "PICCO R/LM"}]$u$::jsonb),
  ('innovation_use_picco_cut_5', $u$Inserts for Round Profile Face Grooving$u$, 5, $u$[{"name": "PICCO-010", "note": "round face groove"}]$u$::jsonb),
  ('innovation_use_picco_cut_6', $u$Inserts for Face Grooving$u$, 6, $u$[{"name": "PICCO-010/610"}]$u$::jsonb),
  ('innovation_use_picco_cut_7', $u$Inserts for Deep Face Grooving$u$, 7, $u$[{"name": "PICCO-015"}]$u$::jsonb),
  ('innovation_use_picco_cut_8', $u$Inserts with an Internal Coolant Channels for Deep Face Grooving$u$, 8, $u$[{"name": "PICCO-016/020"}]$u$::jsonb),
  ('innovation_use_picco_cut_9', $u$Inserts for 55° Internal Thread Profile$u$, 9, $u$[{"name": "PICCO-55°-Thread"}]$u$::jsonb),
  ('innovation_use_picco_cut_10', $u$Inserts for Grooving Along a Shaft Dmin 6 mm$u$, 10, $u$[{"name": "PICCO-620"}]$u$::jsonb),
  ('innovation_use_picco_cut_11', $u$Reinforced Boring Inserts with Internal Coolant Holes$u$, 11, $u$[{"name": "PICCO R/LX050", "note": "new"}]$u$::jsonb),
  ('innovation_use_picco_cut_12', $u$ISO Standard Inserts for Full Profile Threads$u$, 12, $u$[{"name": "PICCO ISO Full Profile"}]$u$::jsonb),
  ('innovation_use_picco_cut_13', $u$ISO Fine Pitch Inserts for Full Profile Threads$u$, 13, $u$[{"name": "PICCO ISO Full Profile Fine"}]$u$::jsonb),
  ('innovation_use_picco_cut_14', $u$CBN Tipped Inserts for Internal Turning, Profiling and Chamfering Hard Steel$u$, 14, $u$[{"name": "PICCO R 050", "note": "CBN"}]$u$::jsonb),
  ('innovation_use_picco_cut_15', $u$Inserts for Internal Turning and Chamfering Next to the Bottom of Blind Holes$u$, 15, $u$[{"name": "PICCO R 050.20"}]$u$::jsonb),
  ('innovation_use_picco_cut_16', $u$Inserts for Internal Grooving and Turning$u$, 16, $u$[{"name": "PICCO R/L 002-007"}]$u$::jsonb),
  ('innovation_use_picco_cut_17', $u$Full Radius Inserts for Internal Profiling$u$, 17, $u$[{"name": "PICCO R/L 004-007", "note": "full radius"}]$u$::jsonb),
  ('innovation_use_picco_cut_18', $u$Inserts for Internal Deep Profiling$u$, 18, $u$[{"name": "PICCO R/L 047"}]$u$::jsonb),
  ('innovation_use_picco_cut_19', $u$Inserts for Internal Turning and Chamfering$u$, 19, $u$[{"name": "PICCO R/L 050, 053, 055"}]$u$::jsonb),
  ('innovation_use_picco_cut_20', $u$Inserts with Chipformers for Internal Boring and Profiling$u$, 20, $u$[{"name": "PICCO R/L 050-C"}]$u$::jsonb),
  ('innovation_use_picco_cut_21', $u$Inserts for Internal Turning and 45° Chamfering$u$, 21, $u$[{"name": "PICCO R/L 060"}]$u$::jsonb),
  ('innovation_use_picco_cut_22', $u$Back Chamfering Inserts for Pre-Parting Operations$u$, 22, $u$[{"name": "PICCO R/L 070"}]$u$::jsonb),
  ('innovation_use_picco_cut_23', $u$Inserts for Internal Back Turning$u$, 23, $u$[{"name": "PICCO R/L 080"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON i."name" = 'PICCO-CUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
