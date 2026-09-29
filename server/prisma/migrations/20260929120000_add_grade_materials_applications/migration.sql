-- CreateEnum
CREATE TYPE "GradeApplication" AS ENUM ('MILLING', 'TURNING', 'DRILLING', 'GROOVING');

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "applications" "GradeApplication"[],
ADD COLUMN     "iso513Groups" "Iso513Group"[];
