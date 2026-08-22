import { routes } from '@/config/routes';
import { agentDirectoryFiltersSchema } from './schemas';
import {
  DEFAULT_AGENT_LOCATION_ID,
  DEFAULT_AGENT_TYPE,
} from './config';
import type { AgentDirectoryFilters, RealEstateAgentType } from './types';

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseAgentSearchParams(
  searchParams: SearchParamsInput,
): AgentDirectoryFilters {
  const typeRaw = firstValue(searchParams.type);
  const locationRaw =
    firstValue(searchParams.location) ?? firstValue(searchParams.locationId);
  const locationId =
    locationRaw === 'all' ? undefined : locationRaw || DEFAULT_AGENT_LOCATION_ID;
  const q = firstValue(searchParams.q);
  const pageRaw = firstValue(searchParams.page);

  const parsed = agentDirectoryFiltersSchema.safeParse({
    type: typeRaw || DEFAULT_AGENT_TYPE,
    locationId: locationRaw === 'all' ? undefined : locationId,
    q: q || undefined,
    page: pageRaw || '1',
  });

  if (parsed.success) {
    return {
      type: parsed.data.type,
      locationId: parsed.data.locationId,
      q: parsed.data.q,
      page: parsed.data.page,
    };
  }

  const page = Number.parseInt(pageRaw ?? '1', 10);
  const type: RealEstateAgentType =
    typeRaw === 'broker' || typeRaw === 'company' ? typeRaw : DEFAULT_AGENT_TYPE;

  return {
    type,
    locationId: locationRaw === 'all' ? undefined : locationId,
    q: q || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function buildAgentsPath(
  filters: Partial<AgentDirectoryFilters>,
  pathname: string = routes.advice.agents.root,
): string {
  const params = new URLSearchParams();
  const type = filters.type ?? DEFAULT_AGENT_TYPE;
  if (type !== DEFAULT_AGENT_TYPE) params.set('type', type);
  if (filters.locationId) {
    if (filters.locationId !== DEFAULT_AGENT_LOCATION_ID) {
      params.set('location', filters.locationId);
    }
  } else if (Object.prototype.hasOwnProperty.call(filters, 'locationId')) {
    params.set('location', 'all');
  }
  if (filters.q) params.set('q', filters.q);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function buildAgentProfilePath(slug: string, page = 1): string {
  const path = routes.advice.agents.profile(slug);
  return page > 1 ? `${path}?page=${page}` : path;
}
