import { z } from 'zod';
import { SEARCH_DEFAULTS } from '@/config/search';

export const transactionTypeSchema = z.enum(['sale', 'rent']);

export const propertyTypeSchema = z.enum([
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

export const finishingTypeSchema = z.enum([
  'unfinished',
  'semi_finished',
  'finished',
  'lux',
  'super_lux',
]);

export const paymentTypeSchema = z.enum([
  'cash',
  'installment',
  'cash_or_installment',
]);

export const filterPaymentTypeSchema = z.enum([
  'cash',
  'installment',
  'remaining_installments',
]);

export const propertySortSchema = z.enum([
  'recommended',
  'newest',
  'price_asc',
  'price_desc',
  'area_desc',
  'area_asc',
]);

const optionalPositiveNumber = z.coerce.number().positive().optional();
const optionalNonNegativeInt = z.coerce.number().int().nonnegative().optional();
const optionalNonNegativeNumber = z.coerce.number().nonnegative().optional();

function toStringList(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parts = Array.isArray(value)
    ? value.map(String)
    : String(value)
        .split(',')
        .map((part) => part.trim());

  const cleaned = parts.filter(Boolean);
  return cleaned.length > 0 ? cleaned : undefined;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).toLowerCase();
  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  return undefined;
}

const stringListSchema = z.preprocess(toStringList, z.array(z.string()).optional());
const paymentTypesSchema = z.preprocess(
  toStringList,
  z.array(filterPaymentTypeSchema).optional(),
);
const optionalBooleanSchema = z.preprocess(
  toOptionalBoolean,
  z.boolean().optional(),
);

export const propertySearchQuerySchema = z.object({
  minPrice: optionalPositiveNumber,
  maxPrice: optionalPositiveNumber,
  bedrooms: optionalNonNegativeInt,
  bathrooms: optionalNonNegativeInt,
  minArea: optionalPositiveNumber,
  maxArea: optionalPositiveNumber,
  finishingType: finishingTypeSchema.optional(),
  paymentType: paymentTypeSchema.optional(),
  paymentTypes: paymentTypesSchema,
  propertyTypes: stringListSchema,
  downPayment: optionalNonNegativeNumber,
  installmentYears: optionalNonNegativeInt,
  views: stringListSchema,
  insideCompound: optionalBooleanSchema,
  directOwner: optionalBooleanSchema,
  hasVideo: optionalBooleanSchema,
  aiRecommended: optionalBooleanSchema,
  keyword: z.string().trim().min(1).optional(),
  compoundSlug: z.string().min(1).optional(),
  sort: propertySortSchema.default(SEARCH_DEFAULTS.sort),
  view: z.enum(['list', 'map']).default('list'),
  page: z.coerce.number().int().positive().default(SEARCH_DEFAULTS.page),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(48)
    .default(SEARCH_DEFAULTS.pageSize),
});

export const propertySearchPathSchema = z.object({
  transactionType: transactionTypeSchema,
  propertyType: propertyTypeSchema.optional(),
  locationSlugs: z.array(z.string().min(1)).optional(),
});

export const propertySearchFiltersSchema = propertySearchPathSchema.merge(
  propertySearchQuerySchema,
);

export type PropertySearchQueryParams = z.infer<typeof propertySearchQuerySchema>;
export type PropertySearchPathParams = z.infer<typeof propertySearchPathSchema>;
export type ParsedPropertySearchFilters = z.infer<typeof propertySearchFiltersSchema>;
export type FilterPaymentType = z.infer<typeof filterPaymentTypeSchema>;
