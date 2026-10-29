-- One-time: the SOLID-FEED-MILL brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing SOLID-FEED-MILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_solid_feed_mill', 'SOLID-FEED-MILL', 'Milling', $u$Solid carbide fast feed endmills with relieved necks, and fast feed roughing endmills with chip splitting edges and a large radius front edge.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDFEEDMILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Solid carbide fast feed endmills with relieved necks, and fast feed roughing endmills with chip splitting edges and a large radius front edge.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDFEEDMILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDFEEDMILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_solid_feed_mill_use_0', $u$Solid Carbide Endmills with Relieved Necks for Fast Feed High Productivity$u$, $u$Endmills$u$, 0, $u$[{"name": "EFF-S2/S4/S6", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2847&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_feed_mill_use_1', $u$Solid Carbide Roughing Endmills with Chip Splitting Cutting Edges, Variable Pitch and Large Radius Front Edge$u$, $u$Roughing endmills$u$, 1, $u$[{"name": "EFP-E4,5CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3184&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDFEEDMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
