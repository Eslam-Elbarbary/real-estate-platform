import { routes } from '@/config/routes';
import type { AdviceQuestionFilters, AdviceQuestionView } from './types';
import { adviceQuestionFiltersSchema } from './schemas';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseAdviceSearchParams(
  searchParams: SearchParamsInput,
): AdviceQuestionFilters {
  const locationId = firstValue(searchParams.location) ?? firstValue(searchParams.locationId);
  const categoryId = firstValue(searchParams.category) ?? firstValue(searchParams.categoryId);
  const viewRaw = firstValue(searchParams.view);
  const pageRaw = firstValue(searchParams.page);
  const transactionRaw = firstValue(searchParams.transaction);

  const parsed = adviceQuestionFiltersSchema.safeParse({
    locationId: locationId || undefined,
    categoryId: categoryId || undefined,
    view: viewRaw || 'popular',
    page: pageRaw || '1',
    transaction: transactionRaw || 'sale',
  });

  if (parsed.success) {
    return {
      locationId: parsed.data.locationId,
      categoryId: parsed.data.categoryId,
      view: parsed.data.view,
      page: parsed.data.page,
      transaction: parsed.data.transaction,
    };
  }

  const view: AdviceQuestionView =
    viewRaw === 'unanswered' || viewRaw === 'all' || viewRaw === 'popular'
      ? viewRaw
      : 'popular';
  const page = Number.parseInt(pageRaw ?? '1', 10);

  return {
    locationId: locationId || undefined,
    view,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    transaction: transactionRaw === 'rent' ? 'rent' : 'sale',
  };
}

export function buildAdviceAskPath(
  filters: Partial<AdviceQuestionFilters> & { view?: AdviceQuestionView },
  pathname: string = routes.advice.ask.root,
): string {
  const params = new URLSearchParams();
  if (filters.locationId) params.set('location', filters.locationId);
  if (filters.categoryId) params.set('category', filters.categoryId);
  if (filters.view && filters.view !== 'popular') params.set('view', filters.view);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  if (filters.transaction && filters.transaction !== 'sale') {
    params.set('transaction', filters.transaction);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function hasAdviceFlash(
  searchParams: SearchParamsInput,
  key: 'created' | 'answered',
): boolean {
  return firstValue(searchParams[key]) === '1';
}
