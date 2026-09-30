-- CreateTable
CREATE TABLE "GradeColumnOrder" (
    "iso513Group" "Iso513Group" NOT NULL,
    "gradeIds" TEXT[],

    CONSTRAINT "GradeColumnOrder_pkey" PRIMARY KEY ("iso513Group")
);
