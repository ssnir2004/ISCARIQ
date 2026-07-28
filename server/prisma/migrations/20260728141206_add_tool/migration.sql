-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "item" TEXT,
    "tailConnection" TEXT NOT NULL,
    "tailSize" TEXT NOT NULL,
    "noseConnection" TEXT NOT NULL,
    "noseSize" TEXT NOT NULL,
    "notes" TEXT,
    "image" TEXT,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tool_designation_key" ON "Tool"("designation");
