-- One-time: the DR-TWIST brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing DR-TWIST is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_dr_twist', 'DR-TWIST', 'Drilling', $u$Economical indexable insert drills (DR) for all materials, mainly semi-finishing; accurate even in interrupted cuts, stacks and sloped surfaces.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DRTWIST')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Economical indexable insert drills (DR) for all materials, mainly semi-finishing; accurate even in interrupted cuts, stacks and sloped surfaces.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DRTWIST' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DRTWIST'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_dr_twist_use_0', $u$Indexable Square Insert Drills with Coolant Holes, Drilling Depth 2xD$u$, $u$Drills$u$, 0, $u$[{"name": "DR-2D-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1898&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_1', $u$Indexable Square Insert Drills with Coolant Holes, Drilling Depth 3xD$u$, $u$Drills$u$, 1, $u$[{"name": "DR-3D-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2225&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_2', $u$Indexable Square Insert Drills with Coolant Holes, Drilling Depth 4xD$u$, $u$Drills$u$, 2, $u$[{"name": "DR-4D-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2227&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_3', $u$Indexable Square Insert Drills with Coolant Holes, Drilling Depth 5xD$u$, $u$Drills$u$, 3, $u$[{"name": "DR-5D-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3163&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_4', $u$Indexable Insert Drills for Non-Rotating Applications with Coolant Holes and One Flat Shank$u$, $u$Drills$u$, 4, $u$[{"name": "DR-4D-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2968&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_5', $u$DR Large Diameter Drills (57-80 mm) with Cartridges and One Flat Shank$u$, $u$Drills$u$, 5, $u$[{"name": "DR-CA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2569&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_6', $u$DR Drill Inserts for General Applications at Medium-to-High Feeds$u$, $u$Inserts$u$, 6, $u$[{"name": "SOMT-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=893&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_7', $u$DR Drill Inserts for Soft Materials at Low-to-Medium Feeds$u$, $u$Inserts$u$, 7, $u$[{"name": "SOMT-GF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=899&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_8', $u$DR Drill Inserts for Carbon Steel and Soft Materials$u$, $u$Inserts$u$, 8, $u$[{"name": "SOMT-HD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3521&mapp=DR&GFSTYP=M"}, {"name": "SOMX-HD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3520&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_9', $u$Inserts for DR Drills with a DT General Use Chipformer$u$, $u$Inserts$u$, 9, $u$[{"name": "SOMX-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2246&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_10', $u$Inserts with a GF Chipformer for Soft Materials Used on DR Drills$u$, $u$Inserts$u$, 10, $u$[{"name": "SOMX-GF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2261&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_11', $u$DR Drill Inserts for Aluminum$u$, $u$Inserts$u$, 11, $u$[{"name": "SOGX/T-AL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3215&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_12', $u$Inserts for DR Drills and Boring Bars$u$, $u$Inserts$u$, 12, $u$[{"name": "XOMT-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=506&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_13', $u$Inserts for DR Drills and A-SXFOR/L Boring Bars, for Ductile Materials$u$, $u$Inserts$u$, 13, $u$[{"name": "XOMT-GF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=761&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_dr_twist_use_14', $u$Inserts for DR Drills$u$, $u$Inserts$u$, 14, $u$[{"name": "AOMT/AOGT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2795&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DRTWIST'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
