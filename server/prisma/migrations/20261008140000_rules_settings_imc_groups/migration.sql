-- Rules of thumb become one table for every list ("grades:<family>" for a
-- Grades tab, "imc" for the IMC screen); app-wide settings (IMC logo); IMC
-- company groups.

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rule_scope_position_idx" ON "Rule"("scope", "position");

-- Data: keep the Grades rules of thumb (same ids, order and dates).
INSERT INTO "Rule" ("id", "scope", "text", "position", "createdAt")
SELECT "id", 'grades:' || "family"::text, "text", "position", "createdAt" FROM "GradeRule";

-- DropTable
DROP TABLE "GradeRule";

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- AlterTable
ALTER TABLE "ImcCompany" ADD COLUMN "groupName" TEXT;
