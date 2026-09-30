-- CreateTable
CREATE TABLE "GradeCase" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "applicationId" TEXT,
    "iso513Group" "Iso513Group",
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GradeCase" ADD CONSTRAINT "GradeCase_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeCase" ADD CONSTRAINT "GradeCase_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

