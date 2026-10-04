-- CreateEnum
CREATE TYPE "GradeFamily" AS ENUM ('CARBIDE', 'CBN', 'CERAMIC', 'PCB');

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "family" "GradeFamily" NOT NULL DEFAULT 'CARBIDE';

