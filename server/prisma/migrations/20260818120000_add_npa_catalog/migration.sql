-- CreateTable
CREATE TABLE "Npa" (
    "id" TEXT NOT NULL,
    "npaNumber" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "applicationType" TEXT,
    "designation" TEXT,
    "publishDate" TIMESTAMP(3),
    "recommendedApplications" TEXT,
    "innovation" TEXT,
    "keyAdvantages" TEXT,
    "materialsText" TEXT,
    "notes" TEXT,
    "image" TEXT,
    "sourceFileName" TEXT,
    "sourceFileData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Npa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaAttribute" (
    "id" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NpaAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToNpa" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToNpa_AB_unique" ON "_MaterialToNpa"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToNpa_B_index" ON "_MaterialToNpa"("B");

-- AddForeignKey
ALTER TABLE "NpaAttribute" ADD CONSTRAINT "NpaAttribute_npaId_fkey" FOREIGN KEY ("npaId") REFERENCES "Npa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToNpa" ADD CONSTRAINT "_MaterialToNpa_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToNpa" ADD CONSTRAINT "_MaterialToNpa_B_fkey" FOREIGN KEY ("B") REFERENCES "Npa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
