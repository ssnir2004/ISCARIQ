-- Rules of thumb per grade family, shown on each Grades tab.
-- CreateTable
CREATE TABLE "GradeRule" (
    "id" TEXT NOT NULL,
    "family" "GradeFamily" NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradeRule_family_position_idx" ON "GradeRule"("family", "position");

