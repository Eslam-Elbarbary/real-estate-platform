import { mockCompounds } from '@/data/mock/compounds';
import type {
  Compound,
  CompoundSearchAggregations,
  CompoundSearchFilters,
  CompoundSearchResult,
  CompoundSortOption,
} from '@/types';

const DEFAULT_PAGE_SIZE = 12;

export interface CompoundRepository {
  findAll(): Promise<Compound[]>;
  findBySlug(slug: string): Promise<Compound | null>;
  findByLocation(locationSlugs: string[]): Promise<Compound[]>;
  search(filters: CompoundSearchFilters): Promise<CompoundSearchResult>;
}

function matchesLocation(compound: Compound, locationSlugs?: string[]): boolean {
  if (!locationSlugs?.length) {
    return true;
  }

  const compoundSlugs = [
    compound.governorateSlug,
    compound.citySlug,
    compound.areaSlug,
  ];

  return locationSlugs.every((slug) => compoundSlugs.includes(slug));
}

function filterCompounds(
  compounds: Compound[],
  filters: CompoundSearchFilters,
): Compound[] {
  return compounds.filter((compound) => {
    if (!matchesLocation(compound, filters.locationSlugs)) {
      return false;
    }

    if (filters.propertyTypes?.length) {
      const hasType = filters.propertyTypes.some((type) =>
        compound.availablePropertyTypes.includes(type),
      );
      if (!hasType) {
        return false;
      }
    }

    if (filters.priceLevel && compound.priceLevel !== filters.priceLevel) {
      return false;
    }

    if (
      filters.constructionStatus &&
      compound.constructionStatus !== filters.constructionStatus
    ) {
      return false;
    }

    if (filters.finishingTypes?.length) {
      const finishing = compound.finishingTypes ?? [];
      if (!filters.finishingTypes.some((value) => finishing.includes(value))) {
        return false;
      }
    }

    if (filters.paymentMethods?.length) {
      const payments = compound.paymentMethods ?? [];
      if (!filters.paymentMethods.some((value) => payments.includes(value))) {
        return false;
      }
    }

    return true;
  });
}

function sortCompounds(
  compounds: Compound[],
  sort: CompoundSortOption = 'recommended',
): Compound[] {
  const sorted = [...compounds];

  switch (sort) {
    case 'price_low':
      return sorted.sort(
        (a, b) => (a.startingPrice ?? a.minPrice ?? 0) - (b.startingPrice ?? b.minPrice ?? 0),
      );
    case 'price_high':
      return sorted.sort(
        (a, b) => (b.startingPrice ?? b.minPrice ?? 0) - (a.startingPrice ?? a.minPrice ?? 0),
      );
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        const score =
          (b.verified ? 10 : 0) +
          b.propertyCount -
          ((a.verified ? 10 : 0) + a.propertyCount);
        if (score !== 0) {
          return score;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }
}

function buildAggregations(compounds: Compound[]): CompoundSearchAggregations {
  const aggregations: CompoundSearchAggregations = {
    locations: {},
    propertyTypes: {},
    priceLevels: {},
    constructionStatuses: {},
    finishingTypes: {},
    paymentMethods: {},
  };

  for (const compound of compounds) {
    for (const slug of [
      compound.governorateSlug,
      compound.citySlug,
      compound.areaSlug,
    ]) {
      aggregations.locations[slug] = (aggregations.locations[slug] ?? 0) + 1;
    }

    for (const type of compound.availablePropertyTypes) {
      aggregations.propertyTypes[type] =
        (aggregations.propertyTypes[type] ?? 0) + 1;
    }

    if (compound.priceLevel) {
      aggregations.priceLevels[compound.priceLevel] =
        (aggregations.priceLevels[compound.priceLevel] ?? 0) + 1;
    }

    if (compound.constructionStatus) {
      aggregations.constructionStatuses[compound.constructionStatus] =
        (aggregations.constructionStatuses[compound.constructionStatus] ?? 0) + 1;
    }

    for (const finishing of compound.finishingTypes ?? []) {
      aggregations.finishingTypes[finishing] =
        (aggregations.finishingTypes[finishing] ?? 0) + 1;
    }

    for (const payment of compound.paymentMethods ?? []) {
      aggregations.paymentMethods[payment] =
        (aggregations.paymentMethods[payment] ?? 0) + 1;
    }
  }

  return aggregations;
}

export class MockCompoundRepository implements CompoundRepository {
  async findAll(): Promise<Compound[]> {
    return [...mockCompounds];
  }

  async findBySlug(slug: string): Promise<Compound | null> {
    return mockCompounds.find((item) => item.slug === slug) ?? null;
  }

  async findByLocation(locationSlugs: string[]): Promise<Compound[]> {
    if (!locationSlugs.length) {
      return this.findAll();
    }

    return mockCompounds.filter((compound) =>
      matchesLocation(compound, locationSlugs),
    );
  }

  async search(filters: CompoundSearchFilters): Promise<CompoundSearchResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
    const sort = filters.sort ?? 'recommended';

    const baseFilters = { ...filters };
    delete baseFilters.page;
    delete baseFilters.pageSize;
    delete baseFilters.sort;

    // Aggregations ignore the filter facet being counted's own constraint
    // by using the fully filtered set for display consistency.
    const filtered = filterCompounds(mockCompounds, filters);
    const sorted = sortCompounds(filtered, sort);
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
      marketEstimate: Math.max(total, 320 + total * 18),
      aggregations: buildAggregations(
        filterCompounds(mockCompounds, {
          ...filters,
          propertyTypes: undefined,
          priceLevel: undefined,
          constructionStatus: undefined,
          finishingTypes: undefined,
          paymentMethods: undefined,
        }),
      ),
    };
  }
}

let compoundRepository: CompoundRepository | null = null;

export function getCompoundRepository(): CompoundRepository {
  if (!compoundRepository) {
    compoundRepository = new MockCompoundRepository();
  }

  return compoundRepository;
}
