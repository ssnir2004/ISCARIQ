-- One-time: the NEOBARREL brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing NEOBARREL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_neobarrel', 'NEOBARREL', 'Milling', $u$Barrel-shaped (lens, oval and taper) solid carbide endmills and QUICK-FEED barrel inserts for 3D profiling with a large step-over.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOBARREL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Barrel-shaped (lens, oval and taper) solid carbide endmills and QUICK-FEED barrel inserts for 3D profiling with a large step-over.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOBARREL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOBARREL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_neobarrel_use_0', $u$Solid Carbide Lens-Shaped (Barrel) Endmills for 3D Profiling$u$, $u$Barrel endmills$u$, 0, $u$[{"name": "ELB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4556&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_neobarrel_use_1', $u$Solid Carbide Oval-Shaped (Barrel) Endmills for 3D Profiling$u$, $u$Barrel endmills$u$, 1, $u$[{"name": "EOB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4557&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_neobarrel_use_2', $u$Solid Carbide Taper-Shaped (Barrel) Endmills for 3D Profiling$u$, $u$Barrel endmills$u$, 2, $u$[{"name": "ETB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4561&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_neobarrel_use_3', $u$Taper Barrel-Shaped Inserts with 2 Cutting Edges$u$, $u$Barrel inserts$u$, 3, $u$[{"name": "HCT-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4630&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_neobarrel_use_4', $u$Combined Barrel and Lens-shaped Inserts with 2 Cutting Edges$u$, $u$Barrel inserts$u$, 4, $u$[{"name": "HLB-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4631&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOBARREL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
