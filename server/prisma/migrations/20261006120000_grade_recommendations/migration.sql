-- Recommended cutting conditions for grades (Grades "Conditions" view).
-- CreateTable
CREATE TABLE "GradeRecommendation" (
    "id" TEXT NOT NULL,
    "family" "GradeFamily" NOT NULL,
    "materialId" TEXT NOT NULL,
    "rough" BOOLEAN NOT NULL DEFAULT false,
    "finish" BOOLEAN NOT NULL DEFAULT false,
    "vcMin" DOUBLE PRECISION,
    "vcRec" DOUBLE PRECISION,
    "vcMax" DOUBLE PRECISION,
    "dry" BOOLEAN NOT NULL DEFAULT false,
    "wet" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToGradeRecommendation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GradeToGradeRecommendation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "GradeRecommendation_family_idx" ON "GradeRecommendation"("family");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToGradeRecommendation_AB_unique" ON "_ApplicationToGradeRecommendation"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToGradeRecommendation_B_index" ON "_ApplicationToGradeRecommendation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GradeToGradeRecommendation_AB_unique" ON "_GradeToGradeRecommendation"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeToGradeRecommendation_B_index" ON "_GradeToGradeRecommendation"("B");

-- AddForeignKey
ALTER TABLE "GradeRecommendation" ADD CONSTRAINT "GradeRecommendation_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToGradeRecommendation" ADD CONSTRAINT "_ApplicationToGradeRecommendation_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToGradeRecommendation" ADD CONSTRAINT "_ApplicationToGradeRecommendation_B_fkey" FOREIGN KEY ("B") REFERENCES "GradeRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToGradeRecommendation" ADD CONSTRAINT "_GradeToGradeRecommendation_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToGradeRecommendation" ADD CONSTRAINT "_GradeToGradeRecommendation_B_fkey" FOREIGN KEY ("B") REFERENCES "GradeRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

