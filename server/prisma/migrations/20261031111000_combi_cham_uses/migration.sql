-- One-time: the COMBI-CHAM brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing COMBI-CHAM is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_combi_cham', 'COMBI-CHAM', 'Drilling', $u$Semi-finishing of deep, large diameter holes (26 – 50 mm, 5xD – 8xD) with MNC drills combining a pilot SUMO-CHAM head and peripheral indexable inserts; versions for the wind turbine industry.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'COMBICHAM')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Semi-finishing of deep, large diameter holes (26 – 50 mm, 5xD – 8xD) with MNC drills combining a pilot SUMO-CHAM head and peripheral indexable inserts; versions for the wind turbine industry.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'COMBICHAM' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'COMBICHAM'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_combi_cham_use_0', $u$Large Diameter Indexable Drills with a Pilot Drilling Head and One Flat Shank, Drilling Depth 5xD$u$, $u$Drills$u$, 0, $u$[{"name": "MNC-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3262&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_combi_cham_use_1', $u$Large Diameter Indexable Drills for the Wind Turbine Industry$u$, $u$Drills$u$, 1, $u$[{"name": "MNC-7/8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4158&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_combi_cham_use_2', $u$Large Diameter Indexable Drills with WCGX peripheral inserts for the Wind Turbine Industry$u$, $u$Drills$u$, 2, $u$[{"name": "MNC-W-7/8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5487&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_combi_cham_use_3', $u$Precision Ground Inserts with DT General Use Chipformer and a Wiper for MNC Large Diameter Drills$u$, $u$Inserts$u$, 3, $u$[{"name": "SOGX-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3263&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_combi_cham_use_4', $u$Precision Ground Inserts with DT General Use Chipformer and a Wiper for MNC Drills$u$, $u$Inserts$u$, 4, $u$[{"name": "SOGT-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3264&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'COMBICHAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
