-- One-time: the FINE-BEAM brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing FINE-BEAM is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_fine_beam', 'FINE-BEAM', 'Drilling', $u$Indexable deep drilling for single and double tube systems (25 – 89 mm, high feed), based on NPHT peripheral and NPMT internal and central inserts with 2 cutting edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FINEBEAM')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Indexable deep drilling for single and double tube systems (25 – 89 mm, high feed), based on NPHT peripheral and NPMT internal and central inserts with 2 cutting edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FINEBEAM' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FINEBEAM'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_fine_beam_use_0', $u$Deep Single Tube Drills with External 4-Start Thread Connection for High Feed (25-89 dia.)$u$, $u$Tube drills$u$, 0, $u$[{"name": "DSD-EF-FB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3661&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_fine_beam_use_1', $u$Deep Single Tube Drills with Internal Single-Start Thread Connection (25-89 dia.)$u$, $u$Tube drills$u$, 1, $u$[{"name": "DSD-IF-FB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3660&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_fine_beam_use_2', $u$Deep Double Tube Drills with External 4-Start Thread Connection for High Feed (25-65 dia.)$u$, $u$Tube drills$u$, 2, $u$[{"name": "DDD-EF-FB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3662&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_fine_beam_use_3', $u$Peripheral Precision Inserts for Drilling Heads DSD-EF-FB / DDD-EF-FB / DSD-IF-FB$u$, $u$Inserts$u$, 3, $u$[{"name": "NPHT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3663&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_fine_beam_use_4', $u$Internal and Central Inserts for Drilling Heads DSD-EF-FB / DDD-EF-FB$u$, $u$Inserts$u$, 4, $u$[{"name": "NPMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2567&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FINEBEAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
