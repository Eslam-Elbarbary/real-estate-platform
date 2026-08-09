import {
  getPropertyRepository,
  getPropertySubtypeCounts,
} from '@/data/repositories';
import type { Property, PropertySearchFilters, PropertySearchResult } from '@/types';

export async function listProperties(): Promise<Property[]> {
  return getPropertyRepository().findAll();
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return getPropertyRepository().findById(id);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return getPropertyRepository().findBySlug(slug);
}

export async function getPropertyByIdAndSlug(
  id: string,
  slug: string,
): Promise<Property | null> {
  return getPropertyRepository().findByIdAndSlug(id, slug);
}

export async function getSimilarProperties(
  propertyId: string,
  limit = 5,
): Promise<Property[]> {
  return getPropertyRepository().getSimilarProperties(propertyId, limit);
}

export async function searchProperties(
  filters: PropertySearchFilters,
): Promise<PropertySearchResult> {
  return getPropertyRepository().search(filters);
}

export async function getSearchSubtypeCounts(
  filters: PropertySearchFilters,
): Promise<Record<string, number>> {
  return getPropertySubtypeCounts(filters);
}

export async function getHomepageStats() {
  const [all, sale, rent] = await Promise.all([
    getPropertyRepository().findAll(),
    getPropertyRepository().search({ transactionType: 'sale', pageSize: 1 }),
    getPropertyRepository().search({ transactionType: 'rent', pageSize: 1 }),
  ]);

  return {
    totalProperties: all.length,
    saleCount: sale.total,
    rentCount: rent.total,
  };
}
