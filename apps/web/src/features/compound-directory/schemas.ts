import { z } from 'zod';

export const compoundSortSchema = z.enum([
  'recommended',
  'newest',
  'price_low',
  'price_high',
]);

export const compoundPriceLevelSchema = z.enum([
  'economy',
  'mid',
  'premium',
  'luxury',
]);

export const compoundConstructionStatusSchema = z.enum([
  'planning',
  'under_construction',
  'delivered',
  'ready',
]);

export const compoundPaymentMethodSchema = z.enum([
  'cash',
  'installment',
  'cash_or_installment',
]);

export const compoundFinishingSchema = z.enum([
  'unfinished',
  'semi_finished',
  'finished',
  'lux',
  'super_lux',
]);

export const compoundPropertyTypeSchema = z.enum([
  'apartment',
  'villa',
  'townhouse',
  'duplex',
  'penthouse',
  'studio',
  'chalet',
  'office',
  'shop',
  'land',
]);

function parseCsv<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T[] | undefined {
  if (!value) {
    return undefined;
  }

  const allowedSet = new Set<string>(allowed);
  const items = value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is T => allowedSet.has(part));

  return items.length ? items : undefined;
}

export const compoundSearchQuerySchema = z.object({
  propertyType: z.string().optional(),
  priceLevel: compoundPriceLevelSchema.optional(),
  constructionStatus: compoundConstructionStatusSchema.optional(),
  finishing: z.string().optional(),
  payment: z.string().optional(),
  sort: compoundSortSchema.optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(48).optional(),
});

export function parsePropertyTypesCsv(value?: string) {
  return parseCsv(value, compoundPropertyTypeSchema.options);
}

export function parseFinishingCsv(value?: string) {
  return parseCsv(value, compoundFinishingSchema.options);
}

export function parsePaymentCsv(value?: string) {
  return parseCsv(value, compoundPaymentMethodSchema.options);
}

export type CompoundSearchPathParams = {
  locationSlugs?: string[];
};
