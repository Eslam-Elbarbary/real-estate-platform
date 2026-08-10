import { DEMO_NEIGHBORHOODS } from './mock-data';
import type { Neighborhood, NeighborhoodChildSummary } from './types';
import { averageSalePrice } from './lib/format';

export interface NeighborhoodRepository {
  listAll(): Promise<Neighborhood[]>;
  getById(id: string): Promise<Neighborhood | null>;
  getByPath(pathSegments: string[]): Promise<Neighborhood | null>;
  getChildren(parentId: string): Promise<Neighborhood[]>;
  getPopular(): Promise<Neighborhood[]>;
}

function toChildSummary(n: Neighborhood): NeighborhoodChildSummary {
  return {
    id: n.id,
    slug: n.slug,
    pathSegments: n.pathSegments,
    nameAr: n.nameAr,
    image: n.cardImage ?? n.coverImage ?? n.heroImage ?? '',
    averageSalePricePerSqm: averageSalePrice(n.priceStats),
    averageRentPricePerSqm: averageSalePrice(
      n.priceStats.map((s) => ({ salePricePerSqm: s.rentPricePerSqm })),
    ),
  };
}

export class MockNeighborhoodRepository implements NeighborhoodRepository {
  async listAll(): Promise<Neighborhood[]> {
    return DEMO_NEIGHBORHOODS.map((n) => ({ ...n }));
  }

  async getById(id: string): Promise<Neighborhood | null> {
    return DEMO_NEIGHBORHOODS.find((n) => n.id === id) ?? null;
  }

  async getByPath(pathSegments: string[]): Promise<Neighborhood | null> {
    if (!pathSegments.length) return null;
    const key = pathSegments.join('/');
    return (
      DEMO_NEIGHBORHOODS.find((n) => n.pathSegments.join('/') === key) ?? null
    );
  }

  async getChildren(parentId: string): Promise<Neighborhood[]> {
    return DEMO_NEIGHBORHOODS.filter((n) => n.parentId === parentId);
  }

  async getPopular(): Promise<Neighborhood[]> {
    return DEMO_NEIGHBORHOODS.filter((n) => n.featuredOnDirectory)
      .slice()
      .sort((a, b) => (a.directoryOrder ?? 99) - (b.directoryOrder ?? 99));
  }
}

let repository: NeighborhoodRepository | null = null;

export function getNeighborhoodRepository(): NeighborhoodRepository {
  if (!repository) repository = new MockNeighborhoodRepository();
  return repository;
}

export { toChildSummary };
