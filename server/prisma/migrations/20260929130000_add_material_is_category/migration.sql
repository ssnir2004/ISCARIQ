-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "isCategory" BOOLEAN NOT NULL DEFAULT false;

-- Mark the seeded ISO 513 group rows as the fixed categories.
UPDATE "Material" SET "isCategory" = true
WHERE "id" IN ('iso513-P', 'iso513-M', 'iso513-K', 'iso513-N', 'iso513-S', 'iso513-H');

-- Fallback for groups whose category row was created by hand instead of by
-- the seed: promote the row carrying the seeded category name (one per group).
UPDATE "Material" m SET "isCategory" = true
FROM (
    SELECT DISTINCT ON (mat."iso513Group") mat."id"
    FROM "Material" mat
    JOIN (VALUES
        ('P', 'Steel'),
        ('M', 'Stainless Steel'),
        ('K', 'Cast Iron'),
        ('N', 'Non-Ferrous'),
        ('S', 'Superalloys / Titanium'),
        ('H', 'Hardened Materials')
    ) AS c("grp", "name")
      ON mat."iso513Group"::text = c."grp" AND mat."name" = c."name"
    WHERE NOT EXISTS (
        SELECT 1 FROM "Material" x
        WHERE x."iso513Group" = mat."iso513Group" AND x."isCategory"
    )
    ORDER BY mat."iso513Group", mat."id"
) pick
WHERE m."id" = pick."id";

-- Create any category that still doesn't exist.
INSERT INTO "Material" ("id", "iso513Group", "name", "description", "isCategory")
SELECT 'iso513-' || c."grp", c."grp"::"Iso513Group", c."name", c."description", true
FROM (VALUES
    ('P', 'Steel', 'Unalloyed and low/high-alloy steel, steel castings'),
    ('M', 'Stainless Steel', 'Ferritic, austenitic, duplex stainless steels'),
    ('K', 'Cast Iron', 'Grey, nodular, malleable cast iron'),
    ('N', 'Non-Ferrous', 'Aluminum, copper, brass, other non-ferrous metals'),
    ('S', 'Superalloys / Titanium', 'Heat-resistant superalloys and titanium alloys'),
    ('H', 'Hardened Materials', 'Hardened steel and chilled cast iron (>45 HRC)')
) AS c("grp", "name", "description")
WHERE NOT EXISTS (
    SELECT 1 FROM "Material" x
    WHERE x."iso513Group"::text = c."grp" AND x."isCategory"
)
ON CONFLICT ("id") DO NOTHING;
