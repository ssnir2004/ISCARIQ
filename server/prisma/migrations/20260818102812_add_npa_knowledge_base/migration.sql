-- CreateEnum
CREATE TYPE "NpaApplicationCategory" AS ENUM ('MILLING', 'TURNING', 'GROOVING', 'PARTING', 'DRILLING', 'THREADING', 'REAMING', 'BORING', 'OTHER');

-- CreateEnum
CREATE TYPE "NpaAvailability" AS ENUM ('IN_STOCK', 'COMING_SOON', 'ASK_PRICING', 'NOT_SPECIFIED');

-- CreateTable
CREATE TABLE "NpaKnowledgeItem" (
    "id" TEXT NOT NULL,
    "npaNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3),
    "productFamily" TEXT NOT NULL,
    "subFamily" TEXT,
    "insertDesignation" TEXT,
    "applicationCategory" "NpaApplicationCategory" NOT NULL,
    "subApplications" TEXT[],
    "iso513Groups" "Iso513Group"[],
    "workpieceMaterials" TEXT[],
    "innovation" TEXT,
    "advantages" TEXT[],
    "recommendedUse" TEXT NOT NULL,
    "bestForConditions" TEXT[],
    "avoidWhen" TEXT,
    "keySellingMessage" TEXT,
    "technicalNotes" TEXT,
    "pricingNotes" TEXT,
    "availability" "NpaAvailability" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "npaFileName" TEXT,
    "npaFileData" TEXT,
    "imageData" TEXT,
    "sourceLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NpaKnowledgeItem_pkey" PRIMARY KEY ("id")
);
