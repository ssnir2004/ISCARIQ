-- One-time: the TRI-DEEP brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing TRI-DEEP is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tri_deep', 'TRI-DEEP', 'Drilling', $u$Indexable insert solutions for all deep drilling methods (gundrilling, single and double tube): TOGT inserts with 3 and LOGT with 2 chip splitting edges and a wiper, on GD-DH gundrills and DSD / DDD tube drills.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TRIDEEP')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Indexable insert solutions for all deep drilling methods (gundrilling, single and double tube): TOGT inserts with 3 and LOGT with 2 chip splitting edges and a wiper, on GD-DH gundrills and DSD / DDD tube drills.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TRIDEEP' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TRIDEEP'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_tri_deep_use_0', $u$Gundrills Carrying Indexable Inserts with Single Chip Splitting Cutting Edge and a Wiper for High Hole Surface Quality$u$, $u$Gundrills$u$, 0, $u$[{"name": "GD-DH (7.94-9.53)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5550&mapp=DR&GFSTYP=M"}, {"name": "GD-DHL (7.94-9.53)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5545&mapp=DR&GFSTYP=M"}, {"name": "GD-DH (10.00-11.50)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4831&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_1', $u$Gundrills Carrying Indexable Inserts with 2 Chip Splitting Cutting Edges and a Wiper for High Hole Surface Quality$u$, $u$Gundrills$u$, 1, $u$[{"name": "GD-DH (12-13.5)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4414&mapp=DR&GFSTYP=M"}, {"name": "GD-DHL (12-13)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4417&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_2', $u$Gundrills Carrying Triangular Inserts with 3 Chip Splitting Cutting Edges and a Wiper for High Hole Surface Quality$u$, $u$Gundrills$u$, 2, $u$[{"name": "GD-DH (14-32)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3788&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_3', $u$Gundrills Carrying Indexable Inserts with 3 Chip Splitting Cutting Edges and a Wiper for High Hole Surface Quality$u$, $u$Gundrills$u$, 3, $u$[{"name": "GD-DHL (14.00-28.58)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5100&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_4', $u$Gundrill Heads Carrying Triangular Inserts with 3 Chip Splitting Cutting Edges and a Wiper for High Hole Surface Quality$u$, $u$Gundrills$u$, 4, $u$[{"name": "GDH-MKT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4592&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_5', $u$Deep Single Tube Drills with External Thread Connection with Triangular Inserts (16-40 dia.)$u$, $u$Tube drills$u$, 5, $u$[{"name": "DSD-EF-FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3790&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_6', $u$Deep Single Tube Drills with Internal Single-Start Thread Connection with Triangular Inserts (14.5-40 dia.)$u$, $u$Tube drills$u$, 6, $u$[{"name": "DSD-IF-FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3792&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_7', $u$Deep Double Tube Drills with External 4-Start Thread Connection Carrying Triangular Inserts (18.4-40 dia.)$u$, $u$Tube drills$u$, 7, $u$[{"name": "DDD-EF-FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3791&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_8', $u$Deep Drilling Inserts with 3 Chip Splitting Cutting Edges, a Positive Rake Chipbreaker and a Wiper$u$, $u$Inserts$u$, 8, $u$[{"name": "TOGT-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3789&mapp=DR&GFSTYP=M"}, {"name": "TOGT-GF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4463&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_9', $u$Deep Drilling Inserts with 2 Chip Splitting Cutting Edges, Positive Rake Chipbreaker and a Wiper$u$, $u$Inserts$u$, 9, $u$[{"name": "LOGT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4416&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tri_deep_use_10', $u$Deep Drilling Inserts with Single Chip Splitting Cutting Edge and a Wiper$u$, $u$Inserts$u$, 10, $u$[{"name": "ZSGT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4832&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TRIDEEP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
