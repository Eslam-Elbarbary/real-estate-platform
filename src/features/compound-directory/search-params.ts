import { routes } from '@/config/routes';
import type { CompoundSearchFilters } from '@/types';
import {
  compoundSearchQuerySchema,
  parseFinishingCsv,
  parsePaymentCsv,
  parsePropertyTypesCsv,
  type CompoundSearchPathParams,
} from './schemas';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parseCompoundSearchFilters(
  path: CompoundSearchPathParams,
  searchParams: SearchParamsInput = {},
): CompoundSearchFilters {
  const raw = {
    propertyType: firstValue(searchParams.propertyType),
    priceLevel: firstValue(searchParams.priceLevel),
    constructionStatus: firstValue(searchParams.constructionStatus),
    finishing: firstValue(searchParams.finishing),
    payment: firstValue(searchParams.payment),
    sort: firstValue(searchParams.sort),
    page: firstValue(searchParams.page),
    pageSize: firstValue(searchParams.pageSize),
  };

  const parsed = compoundSearchQuerySchema.parse(raw);

  return {
    locationSlugs: path.locationSlugs?.length ? path.locationSlugs : undefined,
    propertyTypes: parsePropertyTypesCsv(parsed.propertyType),
    priceLevel: parsed.priceLevel,
    constructionStatus: parsed.constructionStatus,
    finishingTypes: parseFinishingCsv(parsed.finishing),
    paymentMethods: parsePaymentCsv(parsed.payment),
    sort: parsed.sort ?? 'recommended',
    page: parsed.page ?? 1,
    pageSize: parsed.pageSize ?? 12,
  };
}

function serializeList(values?: string[]): string | undefined {
  if (!values?.length) {
    return undefined;
  }

  return values.join(',');
}

export function serializeCompoundSearchParams(
  filters: CompoundSearchFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  const entries: Array<[string, string | undefined]> = [
    ['propertyType', serializeList(filters.propertyTypes)],
    ['priceLevel', filters.priceLevel],
    ['constructionStatus', filters.constructionStatus],
    ['finishing', serializeList(filters.finishingTypes)],
    ['payment', serializeList(filters.paymentMethods)],
    ['sort', filters.sort === 'recommended' ? undefined : filters.sort],
    ['page', filters.page && filters.page > 1 ? String(filters.page) : undefined],
  ];

  for (const [key, value] of entries) {
    if (value) {
      params.set(key, value);
    }
  }

  return params;
}

export function buildCompoundSearchPath(filters: CompoundSearchFilters): string {
  const base = filters.locationSlugs?.length
    ? routes.compounds.byLocation(filters.locationSlugs)
    : routes.compounds.root;
  const query = serializeCompoundSearchParams(filters).toString();
  return query ? `${base}?${query}` : base;
}
