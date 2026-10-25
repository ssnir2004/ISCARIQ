-- AlterTable
ALTER TABLE "InnovationUse" ADD COLUMN     "category" TEXT;

-- One-time: PENTA-CUT's uses get their PENTA size as category (PENTA 17 /
-- 24 / 34 / 40, from their inserts' names), only if none of them has a
-- category yet. A use whose inserts are of different sizes is split into a
-- use per size (same name and place); inserts without a size (e.g. PENTA D,
-- PENTAS 27) stay without a category.
CREATE TEMP TABLE "_penta_ins" AS
SELECT u."id", u."innovationId", u."name", u."position", t.e, t.i,
       substring(t.e ->> 'name' from '^PENTA\s*(17|24|34|40)') AS "size"
FROM "InnovationUse" u
JOIN "Innovation" b ON b."id" = u."innovationId"
CROSS JOIN LATERAL jsonb_array_elements(u."inserts") WITH ORDINALITY AS t(e, i)
WHERE upper(regexp_replace(b."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
  AND NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = u."innovationId" AND x."category" IS NOT NULL);

-- Uses of one size: just the category.
UPDATE "InnovationUse" u SET "category" = 'PENTA ' || p."size"
FROM (SELECT "id", min("size") AS "size" FROM "_penta_ins" GROUP BY "id" HAVING count(DISTINCT coalesce("size", '')) = 1) p
WHERE u."id" = p."id" AND p."size" IS NOT NULL;

-- Uses of several sizes: a use per size instead.
CREATE TEMP TABLE "_penta_split" AS
SELECT "id" FROM "_penta_ins" GROUP BY "id" HAVING count(DISTINCT coalesce("size", '')) > 1;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT p."id" || '-' || coalesce(p."size", 'x'), p."innovationId", p."name",
       CASE WHEN p."size" IS NULL THEN NULL ELSE 'PENTA ' || p."size" END,
       p."position", jsonb_agg(p.e ORDER BY p.i)
FROM "_penta_ins" p
WHERE p."id" IN (SELECT "id" FROM "_penta_split")
GROUP BY p."id", p."innovationId", p."name", p."position", p."size";

DELETE FROM "InnovationUse" WHERE "id" IN (SELECT "id" FROM "_penta_split");

DROP TABLE "_penta_split", "_penta_ins";
