-- CreateTable
CREATE TABLE "GradeChartBox" (
    "scope" TEXT NOT NULL,
    "iso513Group" "Iso513Group" NOT NULL,
    "gradeId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "w" DOUBLE PRECISION NOT NULL,
    "h" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GradeChartBox_pkey" PRIMARY KEY ("scope","iso513Group","gradeId")
);

-- AddForeignKey
ALTER TABLE "GradeChartBox" ADD CONSTRAINT "GradeChartBox_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

