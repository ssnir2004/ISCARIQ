-- Per-material exceptions to a grade's groups (GradeSet ids).
-- CreateTable
CREATE TABLE "GradeMaterialSets" (
    "gradeId" TEXT NOT NULL,
    "iso513Group" "Iso513Group" NOT NULL,
    "setIds" TEXT[],

    CONSTRAINT "GradeMaterialSets_pkey" PRIMARY KEY ("gradeId","iso513Group")
);

-- AddForeignKey
ALTER TABLE "GradeMaterialSets" ADD CONSTRAINT "GradeMaterialSets_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

