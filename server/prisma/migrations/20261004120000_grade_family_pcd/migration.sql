-- The PCB family was meant to be PCD (polycrystalline diamond). Rename the
-- enum value in place (keeps existing PCB grades) and the "PCB:" board
-- scopes of saved rankings and chart layouts.
ALTER TYPE "GradeFamily" RENAME VALUE 'PCB' TO 'PCD';

UPDATE "GradeColumnOrder" SET "scope" = 'PCD:' || substr("scope", 5) WHERE "scope" LIKE 'PCB:%';
UPDATE "GradeChartBox" SET "scope" = 'PCD:' || substr("scope", 5) WHERE "scope" LIKE 'PCB:%';
