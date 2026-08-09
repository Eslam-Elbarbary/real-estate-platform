import { SEARCH_DEFAULTS } from '@/config/search';
import type { PropertySearchFilters } from '@/types';
import {
  propertySearchFiltersSchema,
  propertySearchQuerySchema,
  type ParsedPropertySearchFilters,
  type PropertySearchPathParams,
} from './schemas';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseLocationSlugs(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const slugs = value
    .split('/')
    .map((slug) => slug.trim())
    .filter(Boolean);

  return slugs.length > 0 ? slugs : undefined;
}

export function parseSearchParams(
  searchParams: SearchParamsInput,
): ReturnType<typeof propertySearchQuerySchema.parse> & {
  locationSlugs?: string[];
} {
  const raw = {
    minPrice: firstValue(searchParams.minPrice),
    maxPrice: firstValue(searchParams.maxPrice),
    bedrooms: firstValue(searchParams.bedrooms),
    bathrooms: firstValue(searchParams.bathrooms),
    minArea: firstValue(searchParams.minArea),
    maxArea: firstValue(searchParams.maxArea),
    finishingType: firstValue(searchParams.finishingType),
    paymentType: firstValue(searchParams.paymentType),
    paymentTypes:
      firstValue(searchParams.payment) ?? firstValue(searchParams.paymentTypes),
    propertyTypes: firstValue(searchParams.propertyTypes),
    downPayment: firstValue(searchParams.downPayment),
    installmentYears: firstValue(searchParams.installmentYears),
    views: firstValue(searchParams.views),
    insideCompound: firstValue(searchParams.insideCompound),
    directOwner: firstValue(searchParams.directOwner),
    hasVideo: firstValue(searchParams.hasVideo),
    aiRecommended: firstValue(searchParams.aiRecommended),
    keyword: firstValue(searchParams.keyword),
    compoundSlug: firstValue(searchParams.compoundSlug),
    sort: firstValue(searchParams.sort),
    page: firstValue(searchParams.page),
    pageSize: firstValue(searchParams.pageSize),
  };

  const parsed = propertySearchQuerySchema.parse(raw);
  const locationSlugs = parseLocationSlugs(firstValue(searchParams.location));

  return {
    ...parsed,
    locationSlugs,
  };
}

export function parsePropertySearchFilters(
  path: PropertySearchPathParams,
  searchParams: SearchParamsInput = {},
): ParsedPropertySearchFilters {
  const query = parseSearchParams(searchParams);

  return propertySearchFiltersSchema.parse({
    ...path,
    ...query,
    locationSlugs: path.locationSlugs?.length
      ? path.locationSlugs
      : query.locationSlugs,
  });
}

export function toPropertySearchFilters(
  parsed: ParsedPropertySearchFilters,
): PropertySearchFilters {
  return {
    transactionType: parsed.transactionType,
    propertyType: parsed.propertyType,
    propertyTypes: parsed.propertyTypes,
    locationSlugs: parsed.locationSlugs,
    minPrice: parsed.minPrice,
    maxPrice: parsed.maxPrice,
    bedrooms: parsed.bedrooms,
    bathrooms: parsed.bathrooms,
    minArea: parsed.minArea,
    maxArea: parsed.maxArea,
    finishingType: parsed.finishingType,
    paymentType: parsed.paymentType,
    paymentTypes: parsed.paymentTypes,
    downPayment: parsed.downPayment,
    installmentYears: parsed.installmentYears,
    views: parsed.views,
    insideCompound: parsed.insideCompound,
    directOwner: parsed.directOwner,
    hasVideo: parsed.hasVideo,
    aiRecommended: parsed.aiRecommended,
    keyword: parsed.keyword,
    compoundSlug: parsed.compoundSlug,
    sort: parsed.sort,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

function joinList(values?: string[]): string | undefined {
  if (!values?.length) {
    return undefined;
  }

  return values.join(',');
}

function serializeBoolean(value?: boolean): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value ? 'true' : undefined;
}

export function serializeSearchParams(
  filters: Partial<PropertySearchFilters> & { location?: string },
): URLSearchParams {
  const params = new URLSearchParams();
  const payment =
    joinList(filters.paymentTypes) ??
    (filters.paymentType && filters.paymentType !== 'cash_or_installment'
      ? filters.paymentType
      : undefined);

  const entries: Array<[string, string | number | undefined]> = [
    ['minPrice', filters.minPrice],
    ['maxPrice', filters.maxPrice],
    ['bedrooms', filters.bedrooms],
    ['bathrooms', filters.bathrooms],
    ['minArea', filters.minArea],
    ['maxArea', filters.maxArea],
    ['finishingType', filters.finishingType],
    ['payment', payment],
    ['paymentType', filters.paymentType],
    ['propertyTypes', joinList(filters.propertyTypes)],
    ['downPayment', filters.downPayment],
    ['installmentYears', filters.installmentYears],
    ['views', joinList(filters.views)],
    ['insideCompound', serializeBoolean(filters.insideCompound)],
    ['directOwner', serializeBoolean(filters.directOwner)],
    ['hasVideo', serializeBoolean(filters.hasVideo)],
    ['aiRecommended', serializeBoolean(filters.aiRecommended)],
    ['keyword', filters.keyword],
    ['compoundSlug', filters.compoundSlug],
    ['location', filters.location],
    ['sort', filters.sort === SEARCH_DEFAULTS.sort ? undefined : filters.sort],
    ['page', filters.page === SEARCH_DEFAULTS.page ? undefined : filters.page],
    [
      'pageSize',
      filters.pageSize === SEARCH_DEFAULTS.pageSize ? undefined : filters.pageSize,
    ],
  ];

  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    params.set(key, String(value));
  }

  return params;
}

export function buildPropertySearchPath(
  filters: Pick<
    PropertySearchFilters,
    'transactionType' | 'propertyType' | 'locationSlugs'
  > &
    Partial<PropertySearchFilters>,
): string {
  const transaction = filters.transactionType ?? 'sale';
  const segments = ['/properties', transaction];
  let locationQuery: string | undefined;

  if (filters.propertyType) {
    segments.push(filters.propertyType);

    if (filters.locationSlugs?.length) {
      segments.push(...filters.locationSlugs);
    }
  } else if (filters.locationSlugs?.length) {
    locationQuery = filters.locationSlugs.join('/');
  }

  const query = serializeSearchParams({
    ...filters,
    location: locationQuery,
  }).toString();

  const pathname = segments.join('/');
  return query ? `${pathname}?${query}` : pathname;
}
