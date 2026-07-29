-- Rename "Case Study" to "Test Report" and add a short description field.
ALTER TABLE "CaseStudy" RENAME TO "TestReport";
ALTER TABLE "CaseStudyFile" RENAME TO "TestReportFile";
ALTER TABLE "TestReportFile" RENAME COLUMN "caseStudyId" TO "testReportId";

ALTER TABLE "TestReport" ADD COLUMN "description" TEXT;
