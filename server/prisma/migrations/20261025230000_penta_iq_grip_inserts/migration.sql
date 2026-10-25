-- One-time: the PENTA D inserts belong to PENTA IQ GRIP, not PENTA-CUT. They
-- move with their uses: PENTA IQ GRIP gets the ones it doesn't have yet (by
-- insert name), and PENTA-CUT drops them (uses left empty go).
CREATE TEMP TABLE "_iq" AS
SELECT u."id", u."name", u."position", t.e, t.i, upper(trim(t.e ->> 'name')) = ANY(ARRAY['PENTA D-N-C', 'PENTA D-N-J', 'PENTA D-N-PB', 'PENTA D-R/L-C', 'PENTA D-R/L-J', 'PENTA D-R/L-PB']) AS "moves"
FROM "InnovationUse" u
JOIN "Innovation" p ON p."id" = u."innovationId" AND upper(regexp_replace(p."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
CROSS JOIN LATERAL jsonb_array_elements(u."inserts") WITH ORDINALITY AS t(e, i)
WHERE u."id" IN (
  SELECT x."id" FROM "InnovationUse" x CROSS JOIN LATERAL jsonb_array_elements(x."inserts") e
  WHERE upper(trim(e ->> 'name')) = ANY(ARRAY['PENTA D-N-C', 'PENTA D-N-J', 'PENTA D-N-PB', 'PENTA D-R/L-C', 'PENTA D-R/L-J', 'PENTA D-R/L-PB'])
);

-- To PENTA IQ GRIP: the moved inserts it doesn't list yet, as uses after its own.
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT m."id" || '-iq', q."id", m."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = q."id"), 0) + row_number() OVER (ORDER BY m."position") - 1,
       m."inserts"
FROM (
  SELECT "id", "name", "position", jsonb_agg(e ORDER BY i) AS "inserts"
  FROM "_iq" c
  WHERE "moves" AND NOT EXISTS (
    SELECT 1 FROM "InnovationUse" x
    JOIN "Innovation" q2 ON q2."id" = x."innovationId" AND upper(regexp_replace(q2."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
    CROSS JOIN LATERAL jsonb_array_elements(x."inserts") xe
    WHERE upper(trim(xe ->> 'name')) = upper(trim(c.e ->> 'name')))
  GROUP BY "id", "name", "position"
) m
CROSS JOIN "Innovation" q
WHERE upper(regexp_replace(q."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
ON CONFLICT DO NOTHING;

-- PENTA-CUT keeps the other inserts of those uses; uses left empty go.
UPDATE "InnovationUse" u
SET "inserts" = k."inserts"
FROM (SELECT "id", jsonb_agg(e ORDER BY i) AS "inserts" FROM "_iq" WHERE NOT "moves" GROUP BY "id") k
WHERE u."id" = k."id";

DELETE FROM "InnovationUse"
WHERE "id" IN (SELECT "id" FROM "_iq" GROUP BY "id" HAVING bool_and("moves"))
  -- only if PENTA IQ GRIP exists to hold them
  AND EXISTS (SELECT 1 FROM "Innovation" q WHERE upper(regexp_replace(q."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP');

DROP TABLE "_iq";
