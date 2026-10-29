-- One-time: the MODU-DRILL brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing MODU-DRILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_modu_drill', 'MODU-DRILL', 'Drilling', $u$Modular large diameter drilling: one MD-BODY carries any of three head types (MD-DFN, MD-DR-DH, MD-MNC) for 28 – 45 mm holes and different cutting conditions.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUDRILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Modular large diameter drilling: one MD-BODY carries any of three head types (MD-DFN, MD-DR-DH, MD-MNC) for 28 – 45 mm holes and different cutting conditions.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUDRILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUDRILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_modu_drill_use_0', $u$Modular Drill Bodies, Each Can Carry a Variety of Exchangeable Drilling Heads with Different Geometries$u$, $u$Bodies$u$, 0, $u$[{"name": "MD-BODY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3804&mapp=DR&GFSTYP=M"}, {"name": "MD-BODY-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5356&mapp=DR&GFSTYP=M"}, {"name": "MD-BODY-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5357&mapp=DR&GFSTYP=M"}, {"name": "MD-BODY-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5358&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_1', $u$Modular Extension Holder to Extend The Overall Length by 200 mm$u$, $u$Bodies$u$, 1, $u$[{"name": "MD-EXTENSION", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4695&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_2', $u$Exchangeable Drilling Heads Carry CHAM-IQ-DRILL Solid Carbide Inserts$u$, $u$Heads$u$, 2, $u$[{"name": "MD-DFN-HEAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3805&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_3', $u$Exchangeable Drilling Heads with Guide Pads Carry Square Inserts$u$, $u$Heads$u$, 3, $u$[{"name": "MD-DR-DH-HEAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4316&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_4', $u$Exchangeable Modular Drilling Heads with a Pilot SUMO-CHAM Head and Peripheral Triangular Inserts$u$, $u$Heads$u$, 4, $u$[{"name": "MD-MNC-HEAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4329&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_5', $u$Exchangeable IMH Drilling Heads with a Pilot SUMO-CHAM Head and Peripheral Trigon Inserts$u$, $u$Heads$u$, 5, $u$[{"name": "MD-MNC-IMH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5331&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_6', $u$Exchangeable SUMO-CHAM Drilling Heads for Modular Combi Drills$u$, $u$Pilot heads & inserts$u$, 6, $u$[{"name": "ICP-MNC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5330&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_modu_drill_use_7', $u$Precision Ground Trigon Inserts for Modular MNC Drills$u$, $u$Pilot heads & inserts$u$, 7, $u$[{"name": "WCGX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5332&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUDRILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
