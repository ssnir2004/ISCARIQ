-- CreateTable
CREATE TABLE "ChipbreakerRange" (
    "id" TEXT NOT NULL,
    "chipbreakerId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "feedMin" DOUBLE PRECISION NOT NULL,
    "feedMax" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "notes" TEXT,

    CONSTRAINT "ChipbreakerRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChipbreakerRange_chipbreakerId_applicationId_key" ON "ChipbreakerRange"("chipbreakerId", "applicationId");

-- AddForeignKey
ALTER TABLE "ChipbreakerRange" ADD CONSTRAINT "ChipbreakerRange_chipbreakerId_fkey" FOREIGN KEY ("chipbreakerId") REFERENCES "Chipbreaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChipbreakerRange" ADD CONSTRAINT "ChipbreakerRange_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

