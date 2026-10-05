-- A grade can belong to several groups (GradeSet): Grade.setId becomes a
-- many-to-many relation; each grade's current group carries over.

-- CreateTable
CREATE TABLE "_GradeToGradeSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GradeToGradeSet_AB_unique" ON "_GradeToGradeSet"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeToGradeSet_B_index" ON "_GradeToGradeSet"("B");

-- AddForeignKey
ALTER TABLE "_GradeToGradeSet" ADD CONSTRAINT "_GradeToGradeSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToGradeSet" ADD CONSTRAINT "_GradeToGradeSet_B_fkey" FOREIGN KEY ("B") REFERENCES "GradeSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data: keep each grade's current group.
INSERT INTO "_GradeToGradeSet" ("A", "B") SELECT "id", "setId" FROM "Grade" WHERE "setId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_setId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "setId";
