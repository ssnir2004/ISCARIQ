-- CreateTable
CREATE TABLE "GradeApplicationGroups" (
    "gradeId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "iso513Groups" "Iso513Group"[],

    CONSTRAINT "GradeApplicationGroups_pkey" PRIMARY KEY ("gradeId","applicationId")
);

-- AddForeignKey
ALTER TABLE "GradeApplicationGroups" ADD CONSTRAINT "GradeApplicationGroups_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeApplicationGroups" ADD CONSTRAINT "GradeApplicationGroups_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

