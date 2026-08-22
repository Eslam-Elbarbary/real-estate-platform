import { routes } from '@/config/routes';
import { marketIndexFiltersSchema } from './schemas';
import type { MarketIndexFilters } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseMarketIndexSearchParams(
  searchParams: SearchParamsInput,
): MarketIndexFilters {
  const parsed = marketIndexFiltersSchema.safeParse({
    year: firstValue(searchParams.year) || undefined,
    page: firstValue(searchParams.page) || '1',
  });

  if (parsed.success) {
    return {
      year: parsed.data.year,
      page: parsed.data.page,
    };
  }

  const page = Number.parseInt(firstValue(searchParams.page) ?? '1', 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function buildMarketIndexPath(
  filters: Partial<MarketIndexFilters>,
  pathname: string = routes.marketIndex.root,
): string {
  const params = new URLSearchParams();
  if (filters.year) params.set('year', String(filters.year));
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
