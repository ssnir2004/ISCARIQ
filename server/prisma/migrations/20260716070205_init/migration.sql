-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'SOLUTION_PROPOSED', 'DRAWING_SENT', 'CUSTOMER_SIGNED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'DRAWING_READY', 'SENT_TO_BRANCH', 'CUSTOMER_SIGNED', 'PRODUCTION_PACKAGE_IN_PROGRESS', 'PRODUCTION_PACKAGE_READY', 'CLOSED');

-- CreateEnum
CREATE TYPE "Iso513Group" AS ENUM ('P', 'M', 'K', 'N', 'S', 'H');

-- CreateEnum
CREATE TYPE "CoolantPreference" AS ENUM ('REQUIRED', 'OPTIONAL', 'AVOID');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('TURNING', 'MILLING', 'DRILLING', 'GROOVING', 'THREADING', 'BORING');

-- CreateEnum
CREATE TYPE "CoolantUsage" AS ENUM ('REQUIRED', 'OPTIONAL', 'AVOID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rfq" (
    "id" TEXT NOT NULL,
    "rfqNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "customer" TEXT NOT NULL DEFAULT 'Schaeffler',
    "title" TEXT NOT NULL,
    "materialDescription" TEXT,
    "problemDescription" TEXT,
    "status" "RfqStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rfq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ASSIGNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drawing" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "fileRef" TEXT,
    "sentDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "customerSignedDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "iso513Group" "Iso513Group" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insert" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "chipbreaker" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "coatingType" TEXT,
    "substrate" TEXT,
    "coolantPreference" "CoolantPreference" NOT NULL DEFAULT 'OPTIONAL',
    "notes" TEXT,

    CONSTRAINT "Insert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuttingCondition" (
    "id" TEXT NOT NULL,
    "insertId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "operationType" "OperationType" NOT NULL,
    "apMin" DOUBLE PRECISION,
    "apMax" DOUBLE PRECISION,
    "vcMin" DOUBLE PRECISION,
    "vcMax" DOUBLE PRECISION,
    "feedMin" DOUBLE PRECISION,
    "feedMax" DOUBLE PRECISION,
    "coolant" "CoolantUsage" NOT NULL DEFAULT 'OPTIONAL',
    "notes" TEXT,

    CONSTRAINT "CuttingCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProblemTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsertProblemMatch" (
    "id" TEXT NOT NULL,
    "insertId" TEXT NOT NULL,
    "problemTagId" TEXT NOT NULL,
    "materialId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "InsertProblemMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Rfq_rfqNumber_key" ON "Rfq"("rfqNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectNumber_key" ON "Project"("projectNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_projectId_key" ON "Order"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_poNumber_key" ON "ProductionOrder"("poNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_projectId_key" ON "ProductionOrder"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Insert_designation_key" ON "Insert"("designation");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemTag_name_key" ON "ProblemTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InsertProblemMatch_insertId_problemTagId_materialId_key" ON "InsertProblemMatch"("insertId", "problemTagId", "materialId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfq" ADD CONSTRAINT "Rfq_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuttingCondition" ADD CONSTRAINT "CuttingCondition_insertId_fkey" FOREIGN KEY ("insertId") REFERENCES "Insert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuttingCondition" ADD CONSTRAINT "CuttingCondition_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsertProblemMatch" ADD CONSTRAINT "InsertProblemMatch_insertId_fkey" FOREIGN KEY ("insertId") REFERENCES "Insert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsertProblemMatch" ADD CONSTRAINT "InsertProblemMatch_problemTagId_fkey" FOREIGN KEY ("problemTagId") REFERENCES "ProblemTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsertProblemMatch" ADD CONSTRAINT "InsertProblemMatch_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
