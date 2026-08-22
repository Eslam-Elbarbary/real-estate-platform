export const SEARCH_DEFAULTS = {
  page: 1,
  pageSize: 12,
  sort: 'recommended',
} as const;

export const SEARCH_QUERY_KEYS = [
  'minPrice',
  'maxPrice',
  'bedrooms',
  'bathrooms',
  'minArea',
  'maxArea',
  'finishingType',
  'paymentType',
  'payment',
  'paymentTypes',
  'propertyTypes',
  'downPayment',
  'installmentYears',
  'views',
  'insideCompound',
  'directOwner',
  'hasVideo',
  'aiRecommended',
  'keyword',
  'compoundSlug',
  'location',
  'sort',
  'view',
  'page',
  'pageSize',
] as const;

/** Suggested price anchors for the search UI (EGP). */
export const SALE_PRICE_SUGGESTIONS = [
  1_000_000,
  2_000_000,
  3_000_000,
  5_000_000,
  8_000_000,
  10_000_000,
  15_000_000,
  20_000_000,
] as const;

export const RENT_PRICE_SUGGESTIONS = [
  5_000,
  8_000,
  10_000,
  15_000,
  20_000,
  30_000,
  50_000,
  80_000,
] as const;
