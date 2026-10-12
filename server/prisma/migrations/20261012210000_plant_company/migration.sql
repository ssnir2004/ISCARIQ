-- Plants belong to a company (Schaeffler or Dauch); existing ones are Schaeffler.
-- Names are unique per company.
-- CreateEnum
CREATE TYPE "PlantCompany" AS ENUM ('SCHAEFFLER', 'DAUCH');

-- DropIndex
DROP INDEX "Plant_name_key";

-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "company" "PlantCompany" NOT NULL DEFAULT 'SCHAEFFLER';

-- CreateIndex
CREATE UNIQUE INDEX "Plant_company_name_key" ON "Plant"("company", "name");

