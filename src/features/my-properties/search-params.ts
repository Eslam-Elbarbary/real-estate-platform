import { routes } from '@/config/routes';
import {
  myPropertiesQuerySchema,
  type MyPropertiesQuery,
} from './schemas';
import type { ManagedListingStatus, ManagedListingSort } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseMyPropertiesSearchParams(
  searchParams: SearchParamsInput = {},
): MyPropertiesQuery {
  const raw = {
    status: firstValue(searchParams.status),
    q: firstValue(searchParams.q),
    sort: firstValue(searchParams.sort),
    page: firstValue(searchParams.page),
    pageSize: firstValue(searchParams.pageSize),
  };

  const parsed = myPropertiesQuerySchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  return myPropertiesQuerySchema.parse({});
}

export function buildMyPropertiesHref(filters: {
  status?: ManagedListingStatus;
  q?: string;
  sort?: ManagedListingSort;
  page?: number;
}): string {
  const params = new URLSearchParams();
  const status = filters.status ?? 'published';
  if (status !== 'published') params.set('status', status);
  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));

  const query = params.toString();
  return query ? `${routes.myProperties}?${query}` : routes.myProperties;
}
