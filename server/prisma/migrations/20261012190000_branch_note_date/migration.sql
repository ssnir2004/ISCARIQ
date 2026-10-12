-- The date a branch's general information refers to.
-- AlterTable
ALTER TABLE "BranchNote" ADD COLUMN     "date" DATE;


-- Existing information is dated when it was added.
UPDATE "BranchNote" SET "date" = "createdAt"::date WHERE "date" IS NULL;
