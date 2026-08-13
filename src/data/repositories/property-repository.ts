import { SEARCH_DEFAULTS } from '@/config/search';
import { mockProperties } from '@/data/mock/properties';
import type {
  ListingSource,
  Property,
  PropertySearchFilters,
  PropertySearchResult,
  PropertySortOption,
  PropertyType,
  TransactionType,
} from '@/types';

export interface CompoundPropertyQuery {
  compoundId: string;
  transactionType?: TransactionType;
  listingSources?: ListingSource[];
}

export interface PropertyRepository {
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  findByIdAndSlug(id: string, slug: string): Promise<Property | null>;
  findByCompound(query: CompoundPropertyQuery): Promise<Property[]>;
  findBySeller(sellerId: string): Promise<Property[]>;
  search(filters: PropertySearchFilters): Promise<PropertySearchResult>;
  getSimilarProperties(propertyId: string, limit?: number): Promise<Property[]>;
}

const DOMAIN_TYPES = new Set<string>([
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

function matchesLocation(property: Property, locationSlugs?: string[]): boolean {
  if (!locationSlugs?.length) {
    return true;
  }

  const propertySlugs = [
    property.location.governorateSlug,
    property.location.citySlug,
    property.location.areaSlug,
    property.location.neighborhoodSlug,
  ].filter(Boolean);

  return locationSlugs.every((slug) => propertySlugs.includes(slug));
}

function matchesPropertyTypes(
  property: Property,
  propertyType?: PropertyType,
  propertyTypes?: string[],
): boolean {
  if (propertyType && property.propertyType !== propertyType) {
    return false;
  }

  if (!propertyTypes?.length) {
    return true;
  }

  const normalized = propertyTypes.filter((value) => value !== 'all');
  if (!normalized.length) {
    return true;
  }

  return normalized.some((value) => {
    if (DOMAIN_TYPES.has(value)) {
      return property.propertyType === value;
    }

    if (value === 'commercial') {
      return property.propertyType === 'shop';
    }

    if (value === 'furnished_apartment') {
      return (
        property.propertyType === 'apartment' &&
        property.features.some((feature) => feature.includes('مفروش'))
      );
    }

    if (value === 'building') {
      return property.propertyType === 'apartment' || property.propertyType === 'office';
    }

    if (value === 'medical') {
      return property.propertyType === 'office' || property.propertyType === 'shop';
    }

    if (value === 'other') {
      return property.propertyType === 'land' || property.propertyType === 'chalet';
    }

    return property.features.includes(value) || property.amenities.includes(value);
  });
}

function matchesPaymentTypes(
  property: Property,
  paymentTypes?: PropertySearchFilters['paymentTypes'],
): boolean {
  if (!paymentTypes?.length) {
    return true;
  }

  return paymentTypes.some((type) => {
    if (type === 'cash') {
      return (
        property.paymentType === 'cash' ||
        property.paymentType === 'cash_or_installment'
      );
    }

    if (type === 'installment') {
      return (
        property.paymentType === 'installment' ||
        property.paymentType === 'cash_or_installment'
      );
    }

    if (type === 'remaining_installments') {
      return property.paymentType === 'installment';
    }

    return false;
  });
}

function sortProperties(items: Property[], sort: PropertySortOption): Property[] {
  const sorted = [...items];

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area_asc':
      return sorted.sort((a, b) => a.area - b.area);
    case 'area_desc':
      return sorted.sort((a, b) => b.area - a.area);
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        const score =
          b.favoritesCount + b.views * 0.01 - (a.favoritesCount + a.views * 0.01);
        if (score !== 0) {
          return score;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}

function filterProperties(
  properties: Property[],
  filters: PropertySearchFilters,
): Property[] {
  return properties.filter((property) => {
    if (
      filters.transactionType &&
      property.transactionType !== filters.transactionType
    ) {
      return false;
    }

    if (!matchesPropertyTypes(property, filters.propertyType, filters.propertyTypes)) {
      return false;
    }

    if (!matchesLocation(property, filters.locationSlugs)) {
      return false;
    }

    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false;
    }

    if (filters.bedrooms !== undefined && property.bedrooms < filters.bedrooms) {
      return false;
    }

    if (filters.bathrooms !== undefined && property.bathrooms < filters.bathrooms) {
      return false;
    }

    if (filters.minArea !== undefined && property.area < filters.minArea) {
      return false;
    }

    if (filters.maxArea !== undefined && property.area > filters.maxArea) {
      return false;
    }

    if (
      filters.finishingType &&
      property.finishingType !== filters.finishingType
    ) {
      return false;
    }

    if (filters.paymentType && property.paymentType !== filters.paymentType) {
      return false;
    }

    if (!matchesPaymentTypes(property, filters.paymentTypes)) {
      return false;
    }

    if (
      filters.downPayment !== undefined &&
      (property.downPayment === undefined ||
        property.downPayment > filters.downPayment)
    ) {
      return false;
    }

    if (
      filters.installmentYears !== undefined &&
      (property.installmentYears === undefined ||
        property.installmentYears < filters.installmentYears)
    ) {
      return false;
    }

    if (filters.insideCompound && !property.compoundSlug) {
      return false;
    }

    if (filters.directOwner && property.seller.type !== 'owner') {
      return false;
    }

    if (filters.compoundSlug && property.compoundSlug !== filters.compoundSlug) {
      return false;
    }

    if (filters.sellerId && property.seller.id !== filters.sellerId) {
      return false;
    }

    if (filters.keyword) {
      const haystack = [
        property.title,
        property.description,
        ...property.amenities,
        ...property.features,
        property.location.areaName,
        property.location.cityName,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(filters.keyword.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

export class MockPropertyRepository implements PropertyRepository {
  async findAll(): Promise<Property[]> {
    return [...mockProperties];
  }

  async findById(id: string): Promise<Property | null> {
    return mockProperties.find((property) => property.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    return mockProperties.find((property) => property.slug === slug) ?? null;
  }

  async findByIdAndSlug(id: string, slug: string): Promise<Property | null> {
    const property = await this.findById(id);
    if (!property || property.slug !== slug) {
      return null;
    }

    return property;
  }

  async findByCompound(query: CompoundPropertyQuery): Promise<Property[]> {
    return mockProperties.filter((property) => {
      if (property.compoundId !== query.compoundId) {
        return false;
      }
      if (
        query.transactionType &&
        property.transactionType !== query.transactionType
      ) {
        return false;
      }
      if (
        query.listingSources?.length &&
        !query.listingSources.includes(
          property.listingSource ??
            (property.seller.type === 'developer'
              ? 'developer'
              : property.seller.type === 'owner'
                ? 'owner'
                : 'broker'),
        )
      ) {
        return false;
      }
      return true;
    });
  }

  async findBySeller(sellerId: string): Promise<Property[]> {
    return mockProperties.filter((property) => property.seller.id === sellerId);
  }

  async getSimilarProperties(
    propertyId: string,
    limit = 5,
  ): Promise<Property[]> {
    const current = await this.findById(propertyId);
    if (!current) {
      return [];
    }

    const exclude = new Set<string>([current.id]);
    const picked: Property[] = [];

    const pushMatches = (predicate: (property: Property) => boolean) => {
      for (const property of mockProperties) {
        if (picked.length >= limit) {
          break;
        }
        if (exclude.has(property.id) || !predicate(property)) {
          continue;
        }
        exclude.add(property.id);
        picked.push(property);
      }
    };

    pushMatches(
      (property) =>
        property.transactionType === current.transactionType &&
        property.propertyType === current.propertyType &&
        property.location.areaSlug === current.location.areaSlug,
    );

    pushMatches(
      (property) =>
        property.transactionType === current.transactionType &&
        property.propertyType === current.propertyType &&
        property.location.citySlug === current.location.citySlug,
    );

    pushMatches(
      (property) =>
        property.transactionType === current.transactionType &&
        property.propertyType === current.propertyType,
    );

    pushMatches(
      (property) => property.transactionType === current.transactionType,
    );

    return picked.slice(0, limit);
  }

  async search(filters: PropertySearchFilters): Promise<PropertySearchResult> {
    const page = filters.page ?? SEARCH_DEFAULTS.page;
    const pageSize = filters.pageSize ?? SEARCH_DEFAULTS.pageSize;
    const sort = filters.sort ?? SEARCH_DEFAULTS.sort;

    const filtered = filterProperties(mockProperties, filters);
    const sorted = sortProperties(filtered, sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      // Display-only market scale; pagination always uses `total`.
      marketEstimate: estimateMarketTotal(filters, total),
    };
  }
}

function estimateMarketTotal(
  filters: PropertySearchFilters,
  availableTotal: number,
): number {
  if (availableTotal === 0) {
    return 0;
  }

  let estimate = 48_000;
  if (filters.propertyType === 'apartment') {
    estimate = filters.transactionType === 'rent' ? 62_000 : 84_500;
  } else if (filters.propertyType === 'villa') {
    estimate = 12_400;
  } else if (filters.propertyType) {
    estimate = 18_200;
  }

  if (filters.locationSlugs?.length) {
    estimate = Math.round(estimate / (2 + filters.locationSlugs.length));
  }

  if (filters.minPrice || filters.maxPrice || filters.minArea || filters.maxArea) {
    estimate = Math.round(estimate * 0.55);
  }

  return Math.max(availableTotal, estimate);
}

let propertyRepository: PropertyRepository | null = null;

export function getPropertyRepository(): PropertyRepository {
  if (!propertyRepository) {
    propertyRepository = new MockPropertyRepository();
  }

  return propertyRepository;
}

/** Facet counts for subtype chips — computed on the filtered (pre-page) set. */
export async function getPropertySubtypeCounts(
  filters: PropertySearchFilters,
): Promise<Record<string, number>> {
  const base = { ...filters };
  delete base.propertyType;
  delete base.propertyTypes;
  delete base.page;
  delete base.pageSize;

  const filtered = filterProperties(mockProperties, base);
  const counts: Record<string, number> = {};

  for (const property of filtered) {
    counts[property.propertyType] = (counts[property.propertyType] ?? 0) + 1;

    for (const feature of property.features) {
      counts[feature] = (counts[feature] ?? 0) + 1;
    }
  }

  return counts;
}
