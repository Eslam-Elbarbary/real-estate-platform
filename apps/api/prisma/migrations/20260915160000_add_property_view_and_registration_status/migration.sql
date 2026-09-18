-- CreateTable
CREATE TABLE "property_views" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_registration_statuses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_registration_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_views_code_key" ON "property_views"("code");

-- CreateIndex
CREATE UNIQUE INDEX "property_registration_statuses_code_key" ON "property_registration_statuses"("code");

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "propertyViewId" TEXT,
ADD COLUMN     "registrationStatusId" TEXT;

-- CreateIndex
CREATE INDEX "properties_propertyViewId_idx" ON "properties"("propertyViewId");

-- CreateIndex
CREATE INDEX "properties_registrationStatusId_idx" ON "properties"("registrationStatusId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_propertyViewId_fkey" FOREIGN KEY ("propertyViewId") REFERENCES "property_views"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_registrationStatusId_fkey" FOREIGN KEY ("registrationStatusId") REFERENCES "property_registration_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
