import 'server-only';

import {
  getPublicJsonWithMeta,
  type ApiPaginationMeta,
} from '@/lib/api/client';
import type { PropertySearchFilters, PropertySearchResult } from '@/types';
import type { PublicPropertyCardDto } from '@/types/api/public-property';
import { mapPublicCardToProperty } from '@/features/properties/mappers/to-property-card';
import { toApiSearchQuery } from '@/features/properties/mappers/to-search-query';

const PROPERTIES_PATH = '/api/v1/properties';

export async function searchPropertiesFromApi(
  filters: PropertySearchFilters,
): Promise<PropertySearchResult> {
  const query = await toApiSearchQuery(filters);
  const { data, meta } = await getPublicJsonWithMeta<
    PublicPropertyCardDto[],
    ApiPaginationMeta
  >(PROPERTIES_PATH, query);

  if (!Array.isArray(data)) {
    throw new Error('Invalid properties search response');
  }

  const page = meta?.page ?? filters.page ?? 1;
  const pageSize = meta?.limit ?? filters.pageSize ?? 12;
  const total = meta?.total ?? data.length;
  const totalPages =
    meta?.totalPages ?? (total === 0 ? 0 : Math.ceil(total / pageSize));

  return {
    items: data.map(mapPublicCardToProperty),
    total,
    page,
    pageSize,
    totalPages,
  };
}
