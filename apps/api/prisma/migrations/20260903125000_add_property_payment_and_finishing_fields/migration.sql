-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'INSTALLMENT', 'CASH_OR_INSTALLMENT');

-- CreateEnum
CREATE TYPE "FinishingType" AS ENUM ('UNFINISHED', 'SEMI_FINISHED', 'FINISHED', 'LUX', 'SUPER_LUX');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "referenceNumber" TEXT,
ADD COLUMN     "paymentType" "PaymentType",
ADD COLUMN     "downPayment" DECIMAL(14,2),
ADD COLUMN     "installmentYears" INTEGER,
ADD COLUMN     "monthlyInstallment" DECIMAL(14,2),
ADD COLUMN     "finishingType" "FinishingType",
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "properties_referenceNumber_key" ON "properties"("referenceNumber");

-- CreateIndex
CREATE INDEX "properties_paymentType_idx" ON "properties"("paymentType");

-- CreateIndex
CREATE INDEX "properties_finishingType_idx" ON "properties"("finishingType");
