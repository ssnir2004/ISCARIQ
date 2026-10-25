-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "conditionParams" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "GradeRecommendation" ADD COLUMN     "recCW" DOUBLE PRECISION,
ADD COLUMN     "recD" DOUBLE PRECISION,
ADD COLUMN     "recDC" DOUBLE PRECISION,
ADD COLUMN     "recHoleD" DOUBLE PRECISION;

-- Data: the parameters of Parting, Drilling, Turning and Milling (editable on
-- the Applications screen; other applications keep ap and ae).
UPDATE "Application" SET "conditionParams" = ARRAY['D', 'CW', 'ap'] WHERE lower(trim("name")) = 'parting';
UPDATE "Application" SET "conditionParams" = ARRAY['DC', 'd'] WHERE lower(trim("name")) = 'drilling';
UPDATE "Application" SET "conditionParams" = ARRAY['D', 'ap'] WHERE lower(trim("name")) = 'turning';
UPDATE "Application" SET "conditionParams" = ARRAY['DC', 'ae', 'ap'] WHERE lower(trim("name")) = 'milling';
