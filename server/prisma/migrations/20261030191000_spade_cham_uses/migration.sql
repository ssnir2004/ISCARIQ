-- One-time: the SPADE-CHAM brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing SPADE-CHAM is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_spade_cham', 'SPADE-CHAM', 'Drilling', $u$Large diameter drills (33 – 40 mm) carrying self-locking indexable heads (HFP, IFP, IFHP) on DFN bodies, for 1.5xD to 8xD drilling depths.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SPADECHAM')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Large diameter drills (33 – 40 mm) carrying self-locking indexable heads (HFP, IFP, IFHP) on DFN bodies, for 1.5xD to 8xD drilling depths.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SPADECHAM' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SPADECHAM'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_spade_cham_use_0', $u$Exchangeable DFN Drill Heads for Carbon and Alloy Steel (ISO P) and Cast Iron (ISO K)$u$, $u$Heads$u$, 0, $u$[{"name": "HFP-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3352&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_1', $u$Exchangeable DFN Drill Heads for Machining ISO P, ISO M and High Temp. Alloys (ISO S) Materials$u$, $u$Heads$u$, 1, $u$[{"name": "IFP-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4334&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_2', $u$Exchangeable DFN Drill Heads for Machining Construction Beams and Structural Steel Materials$u$, $u$Heads$u$, 2, $u$[{"name": "IFHP-BD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5241&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_3', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and Flat Shank. Drilling Depth: 1.5xD$u$, $u$Drill bodies$u$, 3, $u$[{"name": "DFN A-1.5D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3999&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_4', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and Flat Shank. Drilling Depth: 3xD$u$, $u$Drill bodies$u$, 4, $u$[{"name": "DFN A-3D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3350&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_5', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and Flat Shank. Drilling Depth: 5xD$u$, $u$Drill bodies$u$, 5, $u$[{"name": "DFN A-5D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3351&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_6', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and Flat Shank. Drilling Depth: 8xD$u$, $u$Drill bodies$u$, 6, $u$[{"name": "DFN A-8D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3911&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_spade_cham_use_7', $u$Exchangeable Head Drills with a Reinforced Body and a Flat Shank, Diameter Ratio 5xD, for Construction Beam Industry$u$, $u$Drill bodies$u$, 7, $u$[{"name": "DFN A-5D-BD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5238&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SPADECHAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
