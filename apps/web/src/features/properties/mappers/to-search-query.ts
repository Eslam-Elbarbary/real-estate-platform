import 'server-only';

import type { PropertySearchFilters } from '@/types';
import type { ApiQueryValue } from '@/lib/api/client';
import {
  fetchCompoundBySlug,
  fetchLocationTree,
  fetchPropertyTypes,
  fetchTransactionTypes,
  resolveCatalogIdByCode,
} from '../api/catalogs';
import { resolveLocationIdsFromSlugs } from './resolve-location-ids';
import {
  toApiFinishingType,
  toApiPaymentType,
  toApiSort,
} from './to-property-card';

export type ApiSearchQuery = Record<string, ApiQueryValue>;

/**
 * Map web SEO filters → public Properties API query (IDs + API field names).
 */
export async function toApiSearchQuery(
  filters: PropertySearchFilters,
): Promise<ApiSearchQuery> {
  const [transactionTypes, propertyTypes, locationTree] = await Promise.all([
    fetchTransactionTypes(),
    fetchPropertyTypes(),
    fetchLocationTree(),
  ]);

  const query: ApiSearchQuery = {
    page: filters.page ?? 1,
    limit: filters.pageSize ?? 12,
    sort: toApiSort(filters.sort),
  };

  if (filters.transactionType) {
    const code = filters.transactionType === 'rent' ? 'RENT' : 'SALE';
    query.transactionTypeId = resolveCatalogIdByCode(transactionTypes, code);
  }

  if (filters.propertyType) {
    query.propertyTypeId = resolveCatalogIdByCode(
      propertyTypes,
      filters.propertyType,
    );
  } else if (filters.propertyTypes?.length) {
    const first = filters.propertyTypes.find((value) => value !== 'all');
    if (first) {
      query.propertyTypeId = resolveCatalogIdByCode(propertyTypes, first);
    }
  }

  const locationIds = resolveLocationIdsFromSlugs(
    locationTree,
    filters.locationSlugs,
  );
  if (locationIds.countryId) {
    query.countryId = locationIds.countryId;
  }
  if (locationIds.cityId) {
    query.cityId = locationIds.cityId;
  }
  if (locationIds.areaId) {
    query.areaId = locationIds.areaId;
  }
  if (locationIds.districtId) {
    query.districtId = locationIds.districtId;
  }

  if (filters.minPrice != null) {
    query.priceMin = filters.minPrice;
  }
  if (filters.maxPrice != null) {
    query.priceMax = filters.maxPrice;
  }
  if (filters.minArea != null) {
    query.areaMin = filters.minArea;
  }
  if (filters.maxArea != null) {
    query.areaMax = filters.maxArea;
  }
  if (filters.bedrooms != null) {
    query.bedrooms = filters.bedrooms;
  }
  if (filters.bathrooms != null) {
    query.bathrooms = filters.bathrooms;
  }

  const paymentType = toApiPaymentType(filters.paymentType);
  if (paymentType) {
    query.paymentType = paymentType;
  } else if (filters.paymentTypes?.length === 1) {
    const only = filters.paymentTypes[0];
    if (only === 'cash') {
      query.paymentType = 'CASH';
    } else if (only === 'installment') {
      query.paymentType = 'INSTALLMENT';
    }
  }

  const finishingType = toApiFinishingType(filters.finishingType);
  if (finishingType) {
    query.finishingType = finishingType;
  }

  if (filters.hasVideo === true) {
    query.hasVideo = true;
  }

  if (filters.keyword?.trim()) {
    query.keyword = filters.keyword.trim();
  }

  if (filters.compoundSlug?.trim()) {
    const compound = await fetchCompoundBySlug(filters.compoundSlug.trim());
    if (compound) {
      query.compoundId = compound.id;
    }
  }

  return query;
}
