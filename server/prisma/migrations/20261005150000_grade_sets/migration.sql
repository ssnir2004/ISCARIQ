-- Grade groups (GradeSet): user-defined groups of grades within a family,
-- each with its own chart. Replaces the CBN "coated" flag.

-- CreateTable
CREATE TABLE "GradeSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" "GradeFamily" NOT NULL,

    CONSTRAINT "GradeSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeSet_family_name_key" ON "GradeSet"("family", "name");

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN "setId" TEXT;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_setId_fkey" FOREIGN KEY ("setId") REFERENCES "GradeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Data: the CBN "Coated" flag becomes a "Coated" group. Its id is "coated"
-- so the coated charts' saved layouts (board scopes ending in "~coated")
-- carry over unchanged as that group's charts.
INSERT INTO "GradeSet" ("id", "name", "family") VALUES ('coated', 'Coated', 'CBN');
UPDATE "Grade" SET "setId" = 'coated' WHERE "coated" AND "family" = 'CBN';

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "coated";
