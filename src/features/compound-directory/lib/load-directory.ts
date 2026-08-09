import { searchCompounds } from '@/features/compounds';
import type { CompoundSearchFilters, CompoundSearchResult } from '@/types';
import { parseCompoundSearchFilters } from '../search-params';

type SearchParamsInput = Record<string, string | string[] | undefined>;

export async function loadCompoundDirectory(
  locationSlugs: string[] | undefined,
  searchParams: SearchParamsInput,
): Promise<{
  filters: CompoundSearchFilters;
  result: CompoundSearchResult;
}> {
  const filters = parseCompoundSearchFilters(
    { locationSlugs },
    searchParams,
  );
  const result = await searchCompounds(filters);
  return { filters, result };
}
