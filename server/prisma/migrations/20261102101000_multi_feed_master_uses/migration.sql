-- One-time: the MULTI-FEED-MASTER brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing MULTI-FEED-MASTER is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_multi_feed_master', 'MULTI-FEED-MASTER', 'Milling', $u$Interchangeable solid carbide FEED-MILL heads on the MULTI-MASTER threaded connection, for milling at very fast feeds and a small depth of cut.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFEEDMASTER')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Interchangeable solid carbide FEED-MILL heads on the MULTI-MASTER threaded connection, for milling at very fast feeds and a small depth of cut.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFEEDMASTER' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFEEDMASTER'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_multi_feed_master_use_0', $u$Interchangeable 2 Flute FEEDMILL Solid Carbide Heads for Milling at Very Fast Feeds and Small D.O.C.$u$, $u$FEED-MILL heads$u$, 0, $u$[{"name": "MM FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1700&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_feed_master_use_1', $u$4, 6 Flute Solid Carbide Heads for Milling at Very Fast Feeds and Small D.O.C.$u$, $u$FEED-MILL heads$u$, 1, $u$[{"name": "MM EFF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3081&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFEEDMASTER'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
