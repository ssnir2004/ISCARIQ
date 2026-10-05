-- Fixed Materials category for the new Sintered Materials group.
INSERT INTO "Material" ("id", "iso513Group", "name", "description", "isCategory")
SELECT 'iso513-SM', 'SM', 'Sintered Materials', 'Powder-metallurgy (sintered) steels and irons', true
WHERE NOT EXISTS (SELECT 1 FROM "Material" WHERE "iso513Group" = 'SM' AND "isCategory")
ON CONFLICT ("id") DO NOTHING;
