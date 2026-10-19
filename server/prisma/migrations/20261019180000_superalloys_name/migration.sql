-- One-time: the S category is "Superalloys" (no "/ Titanium").
UPDATE "Material" SET "name" = 'Superalloys' WHERE "isCategory" = true AND "iso513Group" = 'S' AND "name" = 'Superalloys / Titanium';
