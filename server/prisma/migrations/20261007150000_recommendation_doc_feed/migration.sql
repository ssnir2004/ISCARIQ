-- Recommended conditions: semi-finish, depth of cut (mm) and feed (mm/rev) ranges.
-- AlterTable
ALTER TABLE "GradeRecommendation" ADD COLUMN     "apMax" DOUBLE PRECISION,
ADD COLUMN     "apMin" DOUBLE PRECISION,
ADD COLUMN     "feedMax" DOUBLE PRECISION,
ADD COLUMN     "feedMin" DOUBLE PRECISION,
ADD COLUMN     "semiFinish" BOOLEAN NOT NULL DEFAULT false;

