-- Competitor grades an ISCAR grade replaces.
-- CreateTable
CREATE TABLE "GradeCompetitor" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GradeCompetitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradeCompetitor_gradeId_idx" ON "GradeCompetitor"("gradeId");

-- AddForeignKey
ALTER TABLE "GradeCompetitor" ADD CONSTRAINT "GradeCompetitor_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

