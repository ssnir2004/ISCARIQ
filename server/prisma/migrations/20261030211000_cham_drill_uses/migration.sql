-- One-time: the CHAM-DRILL brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing CHAM-DRILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_cham_drill', 'CHAM-DRILL', 'Drilling', $u$The first drilling line with replaceable heads: IDI heads on DCM drill bodies for 7.5 – 25.9 mm holes and 3xD – 8xD depths, with RING DCM chamfering rings and DCT pre-thread drills.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMDRILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$The first drilling line with replaceable heads: IDI heads on DCM drill bodies for 7.5 – 25.9 mm holes and 3xD – 8xD depths, with RING DCM chamfering rings and DCT pre-thread drills.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMDRILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMDRILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_cham_drill_use_0', $u$General Use DCM Drill Heads$u$, $u$Heads$u$, 0, $u$[{"name": "IDI-SG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=772&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_1', $u$DCM Drill Heads for Cast Iron$u$, $u$Heads$u$, 1, $u$[{"name": "IDI-SK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1160&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_2', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank. Drilling Depth: 3xD$u$, $u$Drill bodies$u$, 2, $u$[{"name": "DCM-3D (7.5-25.9 mm)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=776&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_3', $u$Drill Body with Exchangeable Heads, Internal Coolant, Flat Shank, No Flange, Drilling Depth 3.5xD, for Chamfering Holder$u$, $u$Drill bodies$u$, 3, $u$[{"name": "DCM-3.5D (7.5-20.9 mm)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1551&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_4', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank Drilling Depth: 5xD$u$, $u$Drill bodies$u$, 4, $u$[{"name": "DCM-5D (7.5-25.9 mm)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=777&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_5', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank Drilling Depth: 8xD$u$, $u$Drill bodies$u$, 5, $u$[{"name": "DCM-8D (10-25.9 mm)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1684&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_6', $u$Drill Body with Exchangeable Heads, Chamfering Inserts, Internal Coolant and One Flat Shank. Used for Pre-Tread Holes$u$, $u$Drill bodies$u$, 6, $u$[{"name": "DCT (M8-M24)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1645&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_7', $u$Chamfering Ring Mounted on CHAM-DRILL Drills for Drilling and Chamfering in One Operation$u$, $u$Chamfering rings$u$, 7, $u$[{"name": "RING DCM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1412&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_cham_drill_use_8', $u$Inserts Used on Chamfering Rings$u$, $u$Chamfering rings$u$, 8, $u$[{"name": "XOGX-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1411&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMDRILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
