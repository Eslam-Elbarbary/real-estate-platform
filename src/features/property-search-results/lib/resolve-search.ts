import { SEARCH_DEFAULTS } from '@/config/search';
import {
  propertyTypeSchema,
  transactionTypeSchema,
  type ParsedPropertySearchFilters,
  type PropertySearchPathParams,
} from '@/features/property-search/schemas';
import {
  parsePropertySearchFilters,
  toPropertySearchFilters,
} from '@/features/property-search/search-params';
import type { PropertySearchFilters, PropertyType, TransactionType } from '@/types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

export function parseTransactionParam(
  value: string,
): TransactionType | null {
  const parsed = transactionTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parsePropertyTypeParam(
  value: string | undefined,
): PropertyType | undefined | null {
  if (!value) {
    return undefined;
  }

  const parsed = propertyTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function resolveSearchFilters(
  path: PropertySearchPathParams,
  searchParams: SearchParamsInput = {},
): { parsed: ParsedPropertySearchFilters; filters: PropertySearchFilters } {
  try {
    const parsed = parsePropertySearchFilters(path, searchParams);
    return {
      parsed,
      filters: toPropertySearchFilters(parsed),
    };
  } catch {
    const fallback = parsePropertySearchFilters(
      {
        transactionType: path.transactionType,
        propertyType: path.propertyType,
        locationSlugs: path.locationSlugs,
      },
      {},
    );

    return {
      parsed: {
        ...fallback,
        sort: SEARCH_DEFAULTS.sort,
        page: SEARCH_DEFAULTS.page,
        pageSize: SEARCH_DEFAULTS.pageSize,
      },
      filters: toPropertySearchFilters(fallback),
    };
  }
}
