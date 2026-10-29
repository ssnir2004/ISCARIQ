-- One-time: the SUMO-CHAM IQ brand (Solutions, Drilling) with its use: the
-- SUMO-CHAM IQ family on the ISCAR intranet e-catalog (HCP-IQ heads), linked to
-- its page. An existing SUMO-CHAM IQ is kept: it gets the application, a
-- description if it has none, and the use if it doesn't have it (by name). The
-- HCP-IQ use added to SUMO-CHAM moves here (only if it is unchanged).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_sumo_cham_iq', 'SUMO-CHAM IQ', 'Drilling', $u$Self-centering exchangeable drilling heads (HCP-IQ) for ISO P and ISO K materials, mounted on SUMO-CHAM DCN drill bodies.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAMIQ')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Self-centering exchangeable drilling heads (HCP-IQ) for ISO P and ISO K materials, mounted on SUMO-CHAM DCN drill bodies.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAMIQ' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAMIQ'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_sumo_cham_iq_use_0', $u$Exchangeable Self-Centering SUMO-CHAM Drilling Heads, for Machining ISO P and ISO K Materials$u$, $u$Heads$u$, 0, $u$[{"name": "HCP-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3593&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAMIQ'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

DELETE FROM "InnovationUse"
WHERE "id" = 'innovation_sumo_cham_use_9'
  AND "name" = $u$Exchangeable Self-Centering SUMO-CHAM Drilling Heads, for Machining ISO P and ISO K Materials$u$
  AND "inserts" = $u$[{"name": "HCP-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3593&mapp=DR&GFSTYP=M"}]$u$::jsonb;
