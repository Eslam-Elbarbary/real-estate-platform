-- CreateTable
CREATE TABLE "property_notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_search_alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_search_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_notes_userId_createdAt_idx" ON "property_notes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "property_notes_propertyId_idx" ON "property_notes"("propertyId");

-- CreateIndex
CREATE INDEX "saved_search_alerts_userId_createdAt_idx" ON "saved_search_alerts"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "property_notes" ADD CONSTRAINT "property_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_notes" ADD CONSTRAINT "property_notes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_search_alerts" ADD CONSTRAINT "saved_search_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
