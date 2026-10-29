-- One-time: the CHAMRING brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing CHAMRING is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_chamring', 'CHAMRING', 'Drilling', $u$Chamfering holders that turn standard drills into combined tools for drilling and chamfering (30°, 45°, 60°) in one operation, for 7.5 – 25.9 mm holes.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMRING')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Chamfering holders that turn standard drills into combined tools for drilling and chamfering (30°, 45°, 60°) in one operation, for 7.5 – 25.9 mm holes.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMRING' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMRING'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_chamring_use_0', $u$Drill Holders for Drilling and Chamfering in One Operation$u$, $u$Holders$u$, 0, $u$[{"name": "CHAMRING", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1988&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chamring_use_1', $u$Inserts used on Chamfering Drill Holders for Chamfering and Drilling in One Operation$u$, $u$Inserts$u$, 1, $u$[{"name": "XCGT-DT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1802&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMRING'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
