-- One-time: the FINISHRED brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing FINISHRED is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_finishred', 'FINISHRED', 'Milling', $u$Solid carbide endmills that combine roughing and finishing in a single tool, producing a finished surface at high machining parameters.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FINISHRED')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Solid carbide endmills that combine roughing and finishing in a single tool, producing a finished surface at high machining parameters.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FINISHRED' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FINISHRED'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_finishred_use_0', $u$The FINISHRED kit contains 4 solid carbide endmills producing a finished surface quality in high machining parameters.$u$, $u$Kits$u$, 0, $u$[{"name": "KIT EFS-B44", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1516&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_finishred_use_1', $u$Combination of Roughing and Finishing Solid Carbide Endmills with a Single Tool$u$, $u$Roughing endmills$u$, 1, $u$[{"name": "EFS-B44", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2040&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_finishred_use_2', $u$Combination of Roughing and Finishing Solid Carbide Endmills with Variable Pitch for CHATTERFREE Milling$u$, $u$Roughing endmills$u$, 2, $u$[{"name": "EFS-E44", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2883&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FINISHRED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
