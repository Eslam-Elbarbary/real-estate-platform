import { getCompoundRepository } from '@/data/repositories';
import type { Compound, CompoundSearchFilters, CompoundSearchResult } from '@/types';

export async function listCompounds(): Promise<Compound[]> {
  return getCompoundRepository().findAll();
}

export async function getCompoundBySlug(slug: string): Promise<Compound | null> {
  return getCompoundRepository().findBySlug(slug);
}

export async function searchCompounds(
  filters: CompoundSearchFilters,
): Promise<CompoundSearchResult> {
  return getCompoundRepository().search(filters);
}
