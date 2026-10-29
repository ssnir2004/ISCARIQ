-- One-time: the QUICK-3-CHAM brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing QUICK-3-CHAM is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_quick_3_cham', 'QUICK-3-CHAM', 'Drilling', $u$Three flute drills with exchangeable heads (H3P, F3P flat, F3B counterboring) on D3N bodies, for up to 50% shorter cycle times than two flute drills; drilling depths 1.5xD to 10xD.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK3CHAM')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Three flute drills with exchangeable heads (H3P, F3P flat, F3B counterboring) on D3N bodies, for up to 50% shorter cycle times than two flute drills; drilling depths 1.5xD to 10xD.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK3CHAM' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK3CHAM'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_quick_3_cham_use_0', $u$Exchangeable 3 Flute Drilling Heads for Machining Carbon and Alloy Steel (ISO P) and Cast Iron (ISO K)$u$, $u$Heads$u$, 0, $u$[{"name": "H3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4297&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_1', $u$Exchangeable 3 Flute Flat Drilling Heads for Machining Carbon and Alloy Steel (ISO P) and Cast Iron (ISO K)$u$, $u$Heads$u$, 1, $u$[{"name": "F3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4654&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_2', $u$Exchangeable 3 Flute Counterboring Heads$u$, $u$Heads$u$, 2, $u$[{"name": "F3B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5115&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_3', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and One Flat Shank, Drilling Depth 3xD$u$, $u$Drill bodies$u$, 3, $u$[{"name": "D3N A-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4256&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_4', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and One Flat Shank, Drilling Depth 5xD$u$, $u$Drill bodies$u$, 4, $u$[{"name": "D3N A-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4295&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_5', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and One Flat Shank, Drilling Depth 1.5xD$u$, $u$Drill bodies$u$, 5, $u$[{"name": "D3N A-1.5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4423&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_6', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and Round Shank, Drilling Depth 1.5xD$u$, $u$Drill bodies$u$, 6, $u$[{"name": "D3N R-1.5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4426&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_7', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and Round Shank, Drilling Depth 3xD$u$, $u$Drill bodies$u$, 7, $u$[{"name": "D3N R-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4427&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_8', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and Round Shank, Drilling Depth 5xD$u$, $u$Drill bodies$u$, 8, $u$[{"name": "D3N R-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4428&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_9', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and One Flat Shank, Drilling Depth 8xD$u$, $u$Drill bodies$u$, 9, $u$[{"name": "D3N A-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4644&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_10', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and a Round Shank, Drilling Depth 8xD$u$, $u$Drill bodies$u$, 10, $u$[{"name": "D3N R-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4645&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_3_cham_use_11', $u$Exchangeable Head 3 Flute Drills with Coolant Holes and a Round Shank, Drilling Depth 10xD$u$, $u$Drill bodies$u$, 11, $u$[{"name": "D3N R-10D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5271&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK3CHAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
