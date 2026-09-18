-- Property views become many-to-many, and PropertyRegistrationStatus becomes PropertyLegalStatus.
-- Existing rows are preserved: view ids move into assignments, legal status rows keep their ids
-- so the property FK can be copied across without a code lookup.

-- CreateTable
CREATE TABLE "property_view_assignments" (
    "propertyId" TEXT NOT NULL,
    "viewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_view_assignments_pkey" PRIMARY KEY ("propertyId","viewId")
);

-- CreateIndex
CREATE INDEX "property_view_assignments_viewId_idx" ON "property_view_assignments"("viewId");

-- AddForeignKey
ALTER TABLE "property_view_assignments" ADD CONSTRAINT "property_view_assignments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_view_assignments" ADD CONSTRAINT "property_view_assignments_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "property_views"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate the single view selection into assignments
INSERT INTO "property_view_assignments" ("propertyId", "viewId")
SELECT "id", "propertyViewId"
FROM "properties"
WHERE "propertyViewId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_propertyViewId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "properties_propertyViewId_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyViewId";

-- CreateTable
CREATE TABLE "property_legal_statuses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_legal_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_legal_statuses_code_key" ON "property_legal_statuses"("code");

-- Copy registration statuses across, remapping seed codes to the legal-status vocabulary.
INSERT INTO "property_legal_statuses" ("id", "code", "nameEn", "nameAr", "isActive", "createdAt", "updatedAt")
SELECT
    "id",
    CASE "code"
        WHEN 'REGISTERED' THEN 'REGISTERED_MONTHLY'
        WHEN 'ELIGIBLE' THEN 'REGISTRABLE'
        WHEN 'COMMUNITY' THEN 'NEW_COMMUNITIES_AUTHORITY'
        ELSE "code"
    END,
    "nameEn",
    "nameAr",
    "isActive",
    "createdAt",
    "updatedAt"
FROM "property_registration_statuses";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "legalStatusId" TEXT;

-- Ids were preserved above, so the old FK value carries over directly.
UPDATE "properties" SET "legalStatusId" = "registrationStatusId" WHERE "registrationStatusId" IS NOT NULL;

-- CreateIndex
CREATE INDEX "properties_legalStatusId_idx" ON "properties"("legalStatusId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_legalStatusId_fkey" FOREIGN KEY ("legalStatusId") REFERENCES "property_legal_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_registrationStatusId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "properties_registrationStatusId_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "registrationStatusId";

-- DropTable
DROP TABLE "property_registration_statuses";
