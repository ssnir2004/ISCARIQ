-- Tool families (ToolLine) suited to some grades, and their sub-applications.
-- CreateTable
CREATE TABLE "ToolLine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subApplicationId" TEXT,
    "insert" TEXT,
    "image" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolSubApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ToolSubApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToToolLine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GradeToToolLine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolLine_name_key" ON "ToolLine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ToolSubApplication_name_key" ON "ToolSubApplication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToToolLine_AB_unique" ON "_ApplicationToToolLine"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToToolLine_B_index" ON "_ApplicationToToolLine"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GradeToToolLine_AB_unique" ON "_GradeToToolLine"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeToToolLine_B_index" ON "_GradeToToolLine"("B");

-- AddForeignKey
ALTER TABLE "ToolLine" ADD CONSTRAINT "ToolLine_subApplicationId_fkey" FOREIGN KEY ("subApplicationId") REFERENCES "ToolSubApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToToolLine" ADD CONSTRAINT "_ApplicationToToolLine_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToToolLine" ADD CONSTRAINT "_ApplicationToToolLine_B_fkey" FOREIGN KEY ("B") REFERENCES "ToolLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToToolLine" ADD CONSTRAINT "_GradeToToolLine_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToToolLine" ADD CONSTRAINT "_GradeToToolLine_B_fkey" FOREIGN KEY ("B") REFERENCES "ToolLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

