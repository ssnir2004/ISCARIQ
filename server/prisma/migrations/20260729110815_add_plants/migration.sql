-- CreateEnum
CREATE TYPE "PlantMapView" AS ENUM ('WORLD', 'GERMANY');

-- AlterTable
ALTER TABLE "TestReport" RENAME CONSTRAINT "CaseStudy_pkey" TO "TestReport_pkey";

-- AlterTable
ALTER TABLE "TestReportFile" RENAME CONSTRAINT "CaseStudyFile_pkey" TO "TestReportFile_pkey";

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionCode" TEXT,
    "specialties" TEXT,
    "mapView" "PlantMapView" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_name_key" ON "Plant"("name");

-- RenameForeignKey
ALTER TABLE "TestReport" RENAME CONSTRAINT "CaseStudy_insertId_fkey" TO "TestReport_insertId_fkey";

-- RenameForeignKey
ALTER TABLE "TestReportFile" RENAME CONSTRAINT "CaseStudyFile_caseStudyId_fkey" TO "TestReportFile_testReportId_fkey";
