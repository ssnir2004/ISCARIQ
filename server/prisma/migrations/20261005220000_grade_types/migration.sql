-- Grade types (GradeType): what a grade is made of within its family (e.g.
-- ceramic ALUMINA, SiAlON). The Grades map has a box per type.

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "typeId" TEXT;

-- CreateTable
CREATE TABLE "GradeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" "GradeFamily" NOT NULL,

    CONSTRAINT "GradeType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeType_family_name_key" ON "GradeType"("family", "name");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "GradeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Data (one-time): ceramic grades whose description is exactly one of the
-- ceramic types (ignoring case and surrounding spaces; "SiAION" with a
-- capital I counts as SiAlON) get that type. Descriptions are left as is.
INSERT INTO "GradeType" ("id", "name", "family")
SELECT DISTINCT 'ceramic-' || lower(k."name"), k."name", 'CERAMIC'::"GradeFamily"
FROM "Grade" g
JOIN (VALUES ('alumina', 'ALUMINA'), ('sialon', 'SiAlON'), ('siaion', 'SiAlON'), ('whiskers', 'WHISKERS'), ('bidemics', 'BIDEMICS')) AS k("match", "name")
  ON lower(trim(g."description")) = k."match"
WHERE g."family" = 'CERAMIC';

UPDATE "Grade" g
SET "typeId" = 'ceramic-' || lower(k."name")
FROM (VALUES ('alumina', 'ALUMINA'), ('sialon', 'SiAlON'), ('siaion', 'SiAlON'), ('whiskers', 'WHISKERS'), ('bidemics', 'BIDEMICS')) AS k("match", "name")
WHERE g."family" = 'CERAMIC' AND lower(trim(g."description")) = k."match";
