-- CreateTable
CREATE TABLE "Substrate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "hardness" DOUBLE PRECISION,
    "toughness" DOUBLE PRECISION,

    CONSTRAINT "Substrate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Substrate_name_key" ON "Substrate"("name");

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "substrateId" TEXT;

-- Turn each distinct free-text substrate already entered on grades into a
-- Substrate record, and link the grades to it.
INSERT INTO "Substrate" ("id", "name")
SELECT 'sub-' || md5(v.name), v.name
FROM (SELECT DISTINCT btrim("substrate") AS name FROM "Grade" WHERE btrim(coalesce("substrate", '')) <> '') v;

UPDATE "Grade" g SET "substrateId" = s."id"
FROM "Substrate" s
WHERE s."name" = btrim(g."substrate");

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "substrate";

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_substrateId_fkey" FOREIGN KEY ("substrateId") REFERENCES "Substrate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
