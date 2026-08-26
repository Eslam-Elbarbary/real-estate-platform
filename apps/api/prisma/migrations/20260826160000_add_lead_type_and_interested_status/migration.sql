-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('PHONE', 'WHATSAPP', 'CONTACT_FORM');

-- AlterEnum
ALTER TYPE "LeadStatus" ADD VALUE 'INTERESTED';

-- AlterTable
ALTER TABLE "leads" ADD COLUMN "type" "LeadType" NOT NULL DEFAULT 'CONTACT_FORM';

ALTER TABLE "leads" ALTER COLUMN "type" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "leads_type_idx" ON "leads"("type");
