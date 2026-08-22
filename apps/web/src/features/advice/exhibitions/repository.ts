import { exhibitionSeed } from './mock-data';
import type { RealEstateExhibition } from './types';

export interface ExhibitionRepository {
  getExhibitions(): Promise<RealEstateExhibition[]>;
  getExhibitionBySlug(slug: string): Promise<RealEstateExhibition | null>;
}

export class MockExhibitionRepository implements ExhibitionRepository {
  async getExhibitions(): Promise<RealEstateExhibition[]> {
    return [...exhibitionSeed].sort((left, right) =>
      left.startDate.localeCompare(right.startDate),
    );
  }

  async getExhibitionBySlug(slug: string): Promise<RealEstateExhibition | null> {
    return exhibitionSeed.find((item) => item.slug === slug) ?? null;
  }
}

let repository: ExhibitionRepository | undefined;

export function getExhibitionRepository(): ExhibitionRepository {
  repository ??= new MockExhibitionRepository();
  return repository;
}
