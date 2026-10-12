-- One-time data cleanup of the ISCAR branches:
-- 1. Remove the extra Israel branches (their contacts and notes go with
--    them); a branch that has RFQs is kept.
DELETE FROM "Branch" b
WHERE b."name" IN ('Israel (Tel Aviv)', 'Israel (Zurim Tools)')
  AND NOT EXISTS (SELECT 1 FROM "Rfq" r WHERE r."branchId" = b."id");

-- 2. Every branch name starts with ISCAR and is in capitals
--    ("Belarus" -> "ISCAR BELARUS", "ISCAR Austria" -> "ISCAR AUSTRIA").
--    A name that would clash with another branch's is left as it is.
UPDATE "Branch" b
SET "name" = t."newName"
FROM (
  SELECT "id", upper(CASE WHEN "name" ILIKE '%iscar%' THEN "name" ELSE 'ISCAR ' || "name" END) AS "newName"
  FROM "Branch"
) t
WHERE b."id" = t."id"
  AND b."name" <> t."newName"
  AND NOT EXISTS (SELECT 1 FROM "Branch" o WHERE o."id" <> b."id" AND o."name" = t."newName");
