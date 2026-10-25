-- One-time: the QUICK-PENTA brand (Solutions) takes over its uses from
-- PENTA-CUT: the Safety Lock PENTA 24 inserts (…-SL) move with their uses
-- (a use with other inserts too keeps those in PENTA-CUT), and the QUICK-PENTA
-- tools and adapters (…-QC) are added, linked to the e-catalog. QUICK-PENTA is
-- added if missing (in PENTA-CUT's applications); an existing one is kept.
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_quick_penta', 'QUICK-PENTA', 'Grooving & parting', $u$Safety Lock PENTA 24 inserts (…-SL) with 5 cutting edges for quick cutting edge indexing, on QUICK-PENTA tools and adapters (…-QC).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Safety Lock PENTA 24 inserts (…-SL) with 5 cutting edges for quick cutting edge indexing, on QUICK-PENTA tools and adapters (…-QC).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT ap."A", q."id"
FROM "_ApplicationToInnovation" ap
JOIN "Innovation" p ON p."id" = ap."B" AND upper(regexp_replace(p."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
CROSS JOIN "Innovation" q
WHERE upper(regexp_replace(q."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA'
ON CONFLICT DO NOTHING;

-- PENTA-CUT's uses with the moved inserts: each insert's place, per use.
CREATE TEMP TABLE "_qp" AS
SELECT u."id", u."name", u."category", u."position", t.e, t.i, upper(trim(t.e ->> 'name')) = ANY(ARRAY['PENTA 24N-B-SL', 'PENTA 24N-C-SL', 'PENTA 24N-J-SL', 'PENTA 24N-NF-RS-SL', 'PENTA 24N-NF-RSSL', 'PENTA 24R/L-DSL']) AS "moves"
FROM "InnovationUse" u
JOIN "Innovation" p ON p."id" = u."innovationId" AND upper(regexp_replace(p."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
CROSS JOIN LATERAL jsonb_array_elements(u."inserts") WITH ORDINALITY AS t(e, i)
WHERE u."id" IN (
  SELECT x."id" FROM "InnovationUse" x CROSS JOIN LATERAL jsonb_array_elements(x."inserts") e
  WHERE upper(trim(e ->> 'name')) = ANY(ARRAY['PENTA 24N-B-SL', 'PENTA 24N-C-SL', 'PENTA 24N-J-SL', 'PENTA 24N-NF-RS-SL', 'PENTA 24N-NF-RSSL', 'PENTA 24R/L-DSL'])
);

-- The moved inserts, as QUICK-PENTA uses (same name; no PENTA size category,
-- all being PENTA 24), after its own.
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT m."id" || '-qp', q."id", m."name", NULL,
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = q."id"), 0) + row_number() OVER (ORDER BY m."position") - 1,
       m."inserts"
FROM (SELECT "id", "name", "category", "position", jsonb_agg(e ORDER BY i) AS "inserts" FROM "_qp" WHERE "moves" GROUP BY "id", "name", "category", "position") m
CROSS JOIN "Innovation" q
WHERE upper(regexp_replace(q."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA'
  AND NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = q."id" AND lower(trim(x."name")) = lower(m."name") AND x."inserts" = m."inserts");

-- PENTA-CUT keeps the other inserts of those uses; uses left empty go.
UPDATE "InnovationUse" u
SET "inserts" = k."inserts"
FROM (SELECT "id", jsonb_agg(e ORDER BY i) AS "inserts" FROM "_qp" WHERE NOT "moves" GROUP BY "id") k
WHERE u."id" = k."id";

DELETE FROM "InnovationUse"
WHERE "id" IN (SELECT "id" FROM "_qp" GROUP BY "id" HAVING bool_and("moves"));

DROP TABLE "_qp";

-- The QUICK-PENTA tools and adapters.
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", q."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = q."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_quick_penta_use_0', $u$QUICK-PENTA Adapters with High-Pressure Coolant Holes, for QUICK-PENTA Grooving and Parting Inserts$u$, 0, $u$[{"name": "PCADR/L 24-JHP-QC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5582&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_penta_use_1', $u$Grooving, Parting and Recessing Tools with Safety Lock Clamping for Five Cutting Edged Inserts$u$, 1, $u$[{"name": "PCHR/L 24-QC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5578&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_penta_use_2', $u$Grooving, Parting and Recessing Tools with Safety Lock Clamping for Five Cutting Edged Inserts, with High-Pressure Coolant$u$, 2, $u$[{"name": "PCHR/L-24-JHP-QC/MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5314&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick_penta_use_3', $u$Holders with PENTA-CUT Inserts for Grooving and Parting Next to High Shoulders, Enables Quick Cutting Edge Indexing$u$, 3, $u$[{"name": "PCHRS-24 JHP-QC/MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5542&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
CROSS JOIN "Innovation" q
WHERE upper(regexp_replace(q."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA'
  AND NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = q."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
