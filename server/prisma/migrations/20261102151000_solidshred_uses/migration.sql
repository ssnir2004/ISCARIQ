-- One-time: the SOLIDSHRED brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing SOLIDSHRED is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_solidshred', 'SOLIDSHRED', 'Milling', $u$Solid carbide roughing endmills with chip splitting and serrated cutting edges for high stock removal rates in steel, alloy steel, hard materials and aluminum.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDSHRED')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Solid carbide roughing endmills with chip splitting and serrated cutting edges for high stock removal rates in steel, alloy steel, hard materials and aluminum.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDSHRED' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDSHRED'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_solidshred_use_0', $u$3, 4, and 6 Flute, 30° and 38° Helix Solid Carbide Roughing Endmills with 3xD Relieved Neck for Alloy Steel$u$, $u$Roughing endmills$u$, 0, $u$[{"name": "ERF-A/E-3,4,6", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=951&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_1', $u$4-7 Flute, 45° Helix with Different Length Solid Carbide Roughing Endmills$u$, $u$Roughing endmills$u$, 1, $u$[{"name": "ECR-B-X/L/M/S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1600&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_2', $u$4 Flute, 20° Helix Medium Length Solid Carbide Roughing Endmills for High Stock Removal Rates$u$, $u$Roughing endmills$u$, 2, $u$[{"name": "ECR-T-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1845&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_3', $u$3 Flute, 38° Helix Solid Carbide Roughing Endmills with 3xD Relieved Necks and Chip Splitting Cutting Edges$u$, $u$Roughing endmills$u$, 3, $u$[{"name": "ECP-E3L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2208&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_4', $u$4 Flute, 38° Helix Solid Carbide Roughing Endmills with 3xD Relieved Necks and Chip Splitting Cutting Edges$u$, $u$Roughing endmills$u$, 4, $u$[{"name": "ECP-E4L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2209&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_5', $u$3 Flute, 38° Helix Medium Length Solid Carbide Roughing Endmills with 3xD Relieved Necks for Machining Aluminum$u$, $u$Aluminum endmills$u$, 5, $u$[{"name": "ERC-E-3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=952&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_6', $u$3 Flute, 45° Helix Solid Carbide Roughing Endmills with 3xD Relieved Necks for High Stock Removal Rates of Aluminum$u$, $u$Aluminum endmills$u$, 6, $u$[{"name": "ECR-B3-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1780&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_7', $u$3 Flute, 45° Helix Solid Carbide Roughing Endmills with 3xD Relieved Necks and Coolant Channels for Aluminum$u$, $u$Aluminum endmills$u$, 7, $u$[{"name": "ECR-B3-R-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3957&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_8', $u$3, 4 Flute, 20° Helix Long Solid Carbide Ball Nose Endmills for Roughing Materials up to 55 HRC$u$, $u$Ball nose endmills$u$, 8, $u$[{"name": "EBRF-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1953&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solidshred_use_9', $u$4 and 6 Flute, 45° Helix Medium Length Solid Carbide Roughing Endmills for Materials up to 65 HRC$u$, $u$Hard materials endmills$u$, 9, $u$[{"name": "ECR-B-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2211&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDSHRED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
