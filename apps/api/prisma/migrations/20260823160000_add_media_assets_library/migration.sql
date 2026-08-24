-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "folder" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_publicId_key" ON "media_assets"("publicId");

-- CreateIndex
CREATE INDEX "media_assets_uploadedById_idx" ON "media_assets"("uploadedById");

-- CreateIndex
CREATE INDEX "media_assets_folder_idx" ON "media_assets"("folder");

-- CreateIndex
CREATE INDEX "media_assets_createdAt_idx" ON "media_assets"("createdAt");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- PropertyImage has no production API yet; clear any seed/test rows before reshaping.
DELETE FROM "property_images";

-- DropIndex
DROP INDEX IF EXISTS "property_images_publicId_key";

-- AlterTable: replace duplicated Cloudinary fields with MediaAsset relation
ALTER TABLE "property_images" DROP COLUMN IF EXISTS "url",
DROP COLUMN IF EXISTS "publicId",
DROP COLUMN IF EXISTS "size",
DROP COLUMN IF EXISTS "width",
DROP COLUMN IF EXISTS "height",
ADD COLUMN "mediaAssetId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "property_images_mediaAssetId_idx" ON "property_images"("mediaAssetId");

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
