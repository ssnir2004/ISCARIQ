-- CreateEnum
CREATE TYPE "FeedUnit" AS ENUM ('PER_REV', 'PER_TOOTH');

-- CreateEnum
CREATE TYPE "CoolantType" AS ENUM ('NONE', 'AIR', 'OIL');

-- AlterTable
ALTER TABLE "GradeRecommendation" ADD COLUMN     "recAe" DOUBLE PRECISION,
ADD COLUMN     "recAp" DOUBLE PRECISION,
ADD COLUMN     "recCoolant" "CoolantType",
ADD COLUMN     "recFeed" DOUBLE PRECISION,
ADD COLUMN     "recFeedUnit" "FeedUnit" NOT NULL DEFAULT 'PER_REV',
ADD COLUMN     "recNotes" TEXT,
ADD COLUMN     "recVc" DOUBLE PRECISION;

