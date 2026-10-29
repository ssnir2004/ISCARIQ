-- One-time: the SUMO-L-DRILL brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing SUMO-L-DRILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_sumo_l_drill', 'SUMO-L-DRILL', 'Drilling', $u$Exchangeable head drills with a side screw locking mechanism for unstable machining: interrupted cuts, asymmetrical and cross holes, inclined penetrations; diameters from 12 mm.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOLDRILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Exchangeable head drills with a side screw locking mechanism for unstable machining: interrupted cuts, asymmetrical and cross holes, inclined penetrations; diameters from 12 mm.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOLDRILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOLDRILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_sumo_l_drill_use_0', $u$Exchangeable Drilling Heads for DLN Drills, for Machining ISO P and ISO K Materials$u$, $u$Heads$u$, 0, $u$[{"name": "ILP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5286&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_l_drill_use_1', $u$Exchangeable Head Drills with Screw Lock System for Interrupted Drilling Applications$u$, $u$Drill bodies$u$, 1, $u$[{"name": "DLN A-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5282&mapp=DR&GFSTYP=M"}, {"name": "DLN A-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5283&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOLDRILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
