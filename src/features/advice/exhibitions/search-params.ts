import { routes } from '@/config/routes';
import { exhibitionSearchParamsSchema } from './schemas';
import { parseISODate, parseMonthKey, toMonthKey } from './lib/calendar';
import type { ExhibitionSearchParams } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseExhibitionSearchParams(
  searchParams: SearchParamsInput,
): ExhibitionSearchParams {
  const parsed = exhibitionSearchParamsSchema.safeParse({
    month: firstValue(searchParams.month) || undefined,
    date: firstValue(searchParams.date) || undefined,
  });

  if (parsed.success) {
    if (parsed.data.date && !parseISODate(parsed.data.date)) {
      return { month: parsed.data.month };
    }
    if (parsed.data.month && !parseMonthKey(parsed.data.month)) {
      return { date: parsed.data.date };
    }
    return parsed.data;
  }

  const date = firstValue(searchParams.date);
  const month = firstValue(searchParams.month);
  return {
    date: date && parseISODate(date) ? date : undefined,
    month: month && parseMonthKey(month) ? month : undefined,
  };
}

export function buildExhibitionsPath(params: ExhibitionSearchParams): string {
  const search = new URLSearchParams();
  if (params.date) search.set('date', params.date);
  else if (params.month) search.set('month', params.month);
  const query = search.toString();
  return query ? `${routes.advice.exhibitions.root}?${query}` : routes.advice.exhibitions.root;
}

export function currentMonthKey(now = new Date()): string {
  return toMonthKey(now.getFullYear(), now.getMonth() + 1);
}
