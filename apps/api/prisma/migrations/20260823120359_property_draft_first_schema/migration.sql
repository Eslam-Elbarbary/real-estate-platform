-- CreateEnum
CREATE TYPE "RentPeriod" AS ENUM ('MONTHLY', 'YEARLY', 'DAILY');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "furnished" BOOLEAN,
ADD COLUMN     "rentPeriod" "RentPeriod",
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ALTER COLUMN "propertyTypeId" DROP NOT NULL,
ALTER COLUMN "transactionTypeId" DROP NOT NULL,
ALTER COLUMN "areaId" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "property_status_history" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "fromStatus" "PropertyStatus",
    "toStatus" "PropertyStatus" NOT NULL,
    "changedById" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_status_history_propertyId_createdAt_idx" ON "property_status_history"("propertyId", "createdAt");

-- CreateIndex
CREATE INDEX "property_status_history_changedById_idx" ON "property_status_history"("changedById");

-- CreateIndex
CREATE INDEX "property_status_history_toStatus_idx" ON "property_status_history"("toStatus");

-- CreateIndex
CREATE INDEX "properties_reviewedById_idx" ON "properties"("reviewedById");

-- CreateIndex
CREATE INDEX "properties_submittedAt_idx" ON "properties"("submittedAt");

-- CreateIndex
CREATE INDEX "properties_archivedAt_idx" ON "properties"("archivedAt");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_status_history" ADD CONSTRAINT "property_status_history_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_status_history" ADD CONSTRAINT "property_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
