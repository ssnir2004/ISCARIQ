-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "insertId" TEXT NOT NULL,
    "testNo" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "country" TEXT,
    "customer" TEXT,
    "performer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyFile" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileData" TEXT NOT NULL,
    "description" TEXT,
    "fileDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseStudyFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_insertId_fkey" FOREIGN KEY ("insertId") REFERENCES "Insert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyFile" ADD CONSTRAINT "CaseStudyFile_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
