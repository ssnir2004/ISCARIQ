-- CreateTable
CREATE TABLE "ChipbreakerCase" (
    "id" TEXT NOT NULL,
    "chipbreakerId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "iso513Group" "Iso513Group",
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChipbreakerCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChipbreakerCase" ADD CONSTRAINT "ChipbreakerCase_chipbreakerId_fkey" FOREIGN KEY ("chipbreakerId") REFERENCES "Chipbreaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChipbreakerCase" ADD CONSTRAINT "ChipbreakerCase_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

