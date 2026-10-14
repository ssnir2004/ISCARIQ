-- CreateTable
CREATE TABLE "InnovationUse" (
    "id" TEXT NOT NULL,
    "innovationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "inserts" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "InnovationUse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InnovationUse" ADD CONSTRAINT "InnovationUse_innovationId_fkey" FOREIGN KEY ("innovationId") REFERENCES "Innovation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

