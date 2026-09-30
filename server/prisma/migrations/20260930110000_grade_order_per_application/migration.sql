-- Orders become per board: "all" (the existing overall board) or an
-- Application id. Existing rows keep their order as the "all" board.
-- AlterTable
ALTER TABLE "GradeColumnOrder" DROP CONSTRAINT "GradeColumnOrder_pkey",
ADD COLUMN     "scope" TEXT NOT NULL DEFAULT 'all',
ADD CONSTRAINT "GradeColumnOrder_pkey" PRIMARY KEY ("scope", "iso513Group");
