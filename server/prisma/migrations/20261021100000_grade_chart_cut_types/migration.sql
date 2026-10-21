-- CreateTable
CREATE TABLE "GradeChartSetting" (
    "scope" TEXT NOT NULL,
    "iso513Group" "Iso513Group" NOT NULL,
    "cutTypes" TEXT[],

    CONSTRAINT "GradeChartSetting_pkey" PRIMARY KEY ("scope","iso513Group")
);

