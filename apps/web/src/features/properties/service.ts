import { cache } from 'react';
import {
  getPropertyRepository,
} from '@/data/repositories';
import { fetchPropertyDetailsBySlug } from '@/data/repositories/api-property-details';
import { searchPropertiesFromApi } from '@/data/repositories/api-property-search';
import { mapPublicDetailsToProperty } from '@/features/properties/mappers/to-property-details';
import { ApiRequestError } from '@/lib/api/errors';
import type { Property, PropertySearchFilters, PropertySearchResult } from '@/types';

export type PropertyDetailsResult = {
  property: Property;
  similar: Property[];
};

export async function listProperties(): Promise<Property[]> {
  return getPropertyRepository().findAll();
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return getPropertyRepository().findById(id);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return getPropertyRepository().findBySlug(slug);
}

/**
 * Public listing details — API-backed via GET /api/v1/properties/:slug.
 * Returns null for 404 or id/slug mismatch. Re-throws network/server errors.
 * Cached per-request so generateMetadata + page share one fetch.
 */
export const getPropertyDetailsByIdAndSlug = cache(
  async (
    id: string,
    slug: string,
  ): Promise<PropertyDetailsResult | null> => {
    try {
      const dto = await fetchPropertyDetailsBySlug(slug);
      if (dto.id !== id) {
        return null;
      }
      return mapPublicDetailsToProperty(dto);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
);

/** @deprecated Prefer getPropertyDetailsByIdAndSlug (returns similar embedded). */
export async function getPropertyByIdAndSlug(
  id: string,
  slug: string,
): Promise<Property | null> {
  const result = await getPropertyDetailsByIdAndSlug(id, slug);
  return result?.property ?? null;
}

export async function getSimilarProperties(
  propertyId: string,
  limit = 5,
): Promise<Property[]> {
  return getPropertyRepository().getSimilarProperties(propertyId, limit);
}

/** Public marketplace search — always API-backed (no mock fallback). */
export async function searchProperties(
  filters: PropertySearchFilters,
): Promise<PropertySearchResult> {
  return searchPropertiesFromApi(filters);
}

/**
 * Subtype facet counts require a dedicated API — not available yet.
 * Return empty so chips degrade gracefully without inventing counts.
 */
export async function getSearchSubtypeCounts(
  _filters: PropertySearchFilters,
): Promise<Record<string, number>> {
  return {};
}

export async function getHomepageStats() {
  const [sale, rent] = await Promise.all([
    searchPropertiesFromApi({ transactionType: 'sale', pageSize: 1, page: 1 }),
    searchPropertiesFromApi({ transactionType: 'rent', pageSize: 1, page: 1 }),
  ]);

  return {
    totalProperties: sale.total + rent.total,
    saleCount: sale.total,
    rentCount: rent.total,
  };
}
