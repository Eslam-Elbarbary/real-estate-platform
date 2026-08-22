import { routes } from '@/config/routes';
import { adviceArticleFiltersSchema } from './schemas';
import type { AdviceArticleFilters } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseAdviceArticleSearchParams(
  searchParams: SearchParamsInput,
): AdviceArticleFilters {
  const categoryId =
    firstValue(searchParams.category) ?? firstValue(searchParams.categoryId);
  const pageRaw = firstValue(searchParams.page);

  const parsed = adviceArticleFiltersSchema.safeParse({
    categoryId: categoryId || undefined,
    page: pageRaw || '1',
  });

  if (parsed.success) {
    return {
      categoryId: parsed.data.categoryId,
      page: parsed.data.page,
    };
  }

  const page = Number.parseInt(pageRaw ?? '1', 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function buildAdviceIndexPath(
  filters: Partial<AdviceArticleFilters>,
  pathname: string = routes.advice.index.root,
): string {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set('category', filters.categoryId);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
