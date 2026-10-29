-- One-time: the SUMO-GUN brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing SUMO-GUN is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_sumo_gun', 'SUMO-GUN', 'Drilling', $u$Deep hole drills for 10 – 25.9 mm holes deeper than 12xD (up to 1000 mm long) carrying any SUMO-CHAM head, replaceable inside the machine without removing the drill.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGUN')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Deep hole drills for 10 – 25.9 mm holes deeper than 12xD (up to 1000 mm long) carrying any SUMO-CHAM head, replaceable inside the machine without removing the drill.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGUN' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGUN'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_sumo_gun_use_0', $u$Indexable SUMOCHAM Inserts and Modular Shank Gundrills$u$, $u$Gundrills$u$, 0, $u$[{"name": "MNSNT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4448&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGUN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
