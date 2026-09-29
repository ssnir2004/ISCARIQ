-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToGrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToGrade_AB_unique" ON "_ApplicationToGrade"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToGrade_B_index" ON "_ApplicationToGrade"("B");

-- AddForeignKey
ALTER TABLE "_ApplicationToGrade" ADD CONSTRAINT "_ApplicationToGrade_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToGrade" ADD CONSTRAINT "_ApplicationToGrade_B_fkey" FOREIGN KEY ("B") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the four applications that used to be a fixed enum.
INSERT INTO "Application" ("id", "name") VALUES
    ('app-milling', 'Milling'),
    ('app-turning', 'Turning'),
    ('app-drilling', 'Drilling'),
    ('app-grooving', 'Grooving');

-- Carry each grade's existing enum selections over to the new relation.
INSERT INTO "_ApplicationToGrade" ("A", "B")
SELECT DISTINCT 'app-' || lower(a::text), g."id"
FROM "Grade" g, unnest(g."applications") AS a;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "applications";

-- DropEnum
DROP TYPE "GradeApplication";
