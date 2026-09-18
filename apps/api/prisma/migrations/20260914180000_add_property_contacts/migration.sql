-- CreateEnum
CREATE TYPE "PropertyContactSource" AS ENUM ('OWNER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PropertyContactType" AS ENUM ('OWNER', 'AGENT', 'COMPANY');

-- CreateTable
CREATE TABLE "property_contacts" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "source" "PropertyContactSource" NOT NULL DEFAULT 'OWNER',
    "contactType" "PropertyContactType" NOT NULL DEFAULT 'OWNER',
    "name" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_contacts_propertyId_key" ON "property_contacts"("propertyId");

-- CreateIndex
CREATE INDEX "property_contacts_source_idx" ON "property_contacts"("source");

-- CreateIndex
CREATE INDEX "property_contacts_contactType_idx" ON "property_contacts"("contactType");

-- AddForeignKey
ALTER TABLE "property_contacts" ADD CONSTRAINT "property_contacts_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
