import { buildPropertySearchPath } from '@/features/property-search/search-params';
import { getLocationOptions, type LocationOption } from '@/features/locations';
import {
  getSearchSubtypeCounts,
  searchProperties,
} from '@/features/properties';
import type { PropertySearchFilters, PropertySearchResult } from '@/types';
import {
  getResultsMetadataDescription,
  getResultsMetadataTitle,
} from './search-title';
import {
  parsePropertyTypeParam,
  parseTransactionParam,
  resolveSearchFilters,
} from './resolve-search';

type SearchParamsInput = Record<string, string | string[] | undefined>;

export interface LoadedSearchResults {
  filters: PropertySearchFilters;
  result: PropertySearchResult;
  locations: LocationOption[];
  selectedLocation: LocationOption | null;
  subtypeCounts: Record<string, number>;
  canonicalPath: string;
  metadataTitle: string;
  metadataDescription: string;
}

export function validateRouteParams(input: {
  transaction: string;
  propertyType?: string;
}): {
  transactionType: NonNullable<ReturnType<typeof parseTransactionParam>>;
  propertyType?: NonNullable<ReturnType<typeof parsePropertyTypeParam>>;
} | null {
  const transactionType = parseTransactionParam(input.transaction);
  if (!transactionType) {
    return null;
  }

  if (input.propertyType) {
    const propertyType = parsePropertyTypeParam(input.propertyType);
    if (propertyType === null) {
      return null;
    }

    return { transactionType, propertyType };
  }

  return { transactionType };
}

export async function loadSearchResults(input: {
  transactionType: NonNullable<ReturnType<typeof parseTransactionParam>>;
  propertyType?: NonNullable<ReturnType<typeof parsePropertyTypeParam>>;
  locationSlugs?: string[];
  searchParams: SearchParamsInput;
}): Promise<LoadedSearchResults> {
  const resolved = resolveSearchFilters(
    {
      transactionType: input.transactionType,
      propertyType: input.propertyType,
      locationSlugs: input.locationSlugs,
    },
    input.searchParams,
  );
  const filters =
    resolved.filters.view === 'map'
      ? { ...resolved.filters, page: 1, pageSize: 48 }
      : resolved.filters;

  const [result, locations, subtypeCounts] = await Promise.all([
    searchProperties(filters),
    getLocationOptions(),
    getSearchSubtypeCounts(filters),
  ]);

  const selectedLocation =
    filters.locationSlugs?.length
      ? (locations.find(
          (location) =>
            location.pathSlugs.join('/') === filters.locationSlugs?.join('/'),
        ) ??
        locations.find(
          (location) =>
            location.slug ===
            filters.locationSlugs?.[filters.locationSlugs.length - 1],
        ) ??
        null)
      : null;

  const canonicalPath = buildPropertySearchPath(filters);

  return {
    filters,
    result,
    locations,
    selectedLocation,
    subtypeCounts,
    canonicalPath,
    metadataTitle: getResultsMetadataTitle(filters),
    metadataDescription: getResultsMetadataDescription(filters, result.total),
  };
}
