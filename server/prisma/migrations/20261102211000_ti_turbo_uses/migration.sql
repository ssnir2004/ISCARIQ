-- One-time: the Ti-TURBO brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing Ti-TURBO is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_ti_turbo', 'Ti-TURBO', 'Milling', $u$Solid carbide endmills with different helix, chamfered edges and variable pitch for chatter damping, for high productivity milling of titanium.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TITURBO')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Solid carbide endmills with different helix, chamfered edges and variable pitch for chatter damping, for high productivity milling of titanium.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TITURBO' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TITURBO'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_ti_turbo_use_0', $u$Endmills with Different Helix, Chamfered Edges and Variable Pitch for Chatter Damping on Titanium$u$, $u$Endmills$u$, 0, $u$[{"name": "ECK-H4M-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3655&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_ti_turbo_use_1', $u$7 and 9 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping on Titanium$u$, $u$Endmills$u$, 1, $u$[{"name": "ECK-H7/9-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3892&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TITURBO'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
