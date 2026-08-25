-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "priceAtPurchase" DECIMAL(12,2);
ALTER TABLE "subscriptions" ADD COLUMN "durationDaysAtPurchase" INTEGER;

-- Backfill existing rows from linked plan (safe for empty/dev DBs)
UPDATE "subscriptions" AS s
SET
  "priceAtPurchase" = p."price",
  "durationDaysAtPurchase" = p."durationDays"
FROM "plans" AS p
WHERE s."planId" = p."id"
  AND (s."priceAtPurchase" IS NULL OR s."durationDaysAtPurchase" IS NULL);

-- Enforce NOT NULL after backfill
ALTER TABLE "subscriptions" ALTER COLUMN "priceAtPurchase" SET NOT NULL;
ALTER TABLE "subscriptions" ALTER COLUMN "durationDaysAtPurchase" SET NOT NULL;
