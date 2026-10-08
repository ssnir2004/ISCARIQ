-- IMC group companies (IMC screen).
-- CreateTable
CREATE TABLE "ImcCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "activity" TEXT,
    "country" TEXT,
    "city" TEXT,
    "website" TEXT,

    CONSTRAINT "ImcCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImcCompany_name_key" ON "ImcCompany"("name");

