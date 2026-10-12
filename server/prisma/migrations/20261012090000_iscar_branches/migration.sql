-- ISCAR branches: country, address, manager and contact details; contacts by
-- role; general information notes.

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "address" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "BranchContact" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BranchContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchNote" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BranchContact_branchId_idx" ON "BranchContact"("branchId");

-- CreateIndex
CREATE INDEX "BranchNote_branchId_idx" ON "BranchNote"("branchId");

-- AddForeignKey
ALTER TABLE "BranchContact" ADD CONSTRAINT "BranchContact_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchNote" ADD CONSTRAINT "BranchNote_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Data: the existing branches are named after their country; fill it in.
UPDATE "Branch" b SET "country" = k."code"
FROM (VALUES ('brasil', 'BR'), ('brazil', 'BR'), ('china', 'CN'), ('france', 'FR'), ('germany', 'DE'), ('hungary', 'HU'), ('india', 'IN'),
             ('korea', 'KR'), ('mexico', 'MX'), ('poland', 'PL'), ('romania', 'RO'), ('slovak republic', 'SK'), ('slovakia', 'SK'),
             ('slovenia', 'SI'), ('sweden', 'SE'), ('thailand', 'TH'), ('turkey', 'TR'), ('usa', 'US'), ('israel', 'IL')) AS k("name", "code")
WHERE lower(trim(b."name")) = k."name" AND b."country" IS NULL;
