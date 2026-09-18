import 'server-only';

import { getPublicJson, getPublicJsonWithMeta } from '@/lib/api/client';
import type {
  CatalogFeatureDto,
  CatalogTypeDto,
  LocationTreeCountry,
  PublicCompoundDetailsDto,
} from '@/types/api/public-property';

const CATALOGS_PATH = '/api/v1/catalogs';
const LOCATIONS_TREE_PATH = '/api/v1/locations/tree';
const COMPOUNDS_PATH = '/api/v1/compounds';

export async function fetchTransactionTypes(): Promise<CatalogTypeDto[]> {
  return getPublicJson<CatalogTypeDto[]>(`${CATALOGS_PATH}/transaction-types`);
}

export async function fetchPropertyTypes(): Promise<CatalogTypeDto[]> {
  return getPublicJson<CatalogTypeDto[]>(`${CATALOGS_PATH}/property-types`);
}

export async function fetchFeatures(): Promise<CatalogFeatureDto[]> {
  return getPublicJson<CatalogFeatureDto[]>(`${CATALOGS_PATH}/features`);
}

export async function fetchPropertyViews(): Promise<CatalogTypeDto[]> {
  return getPublicJson<CatalogTypeDto[]>(`${CATALOGS_PATH}/property-views`);
}

export async function fetchLegalStatuses(): Promise<CatalogTypeDto[]> {
  return getPublicJson<CatalogTypeDto[]>(
    `${CATALOGS_PATH}/property-legal-statuses`,
  );
}

export async function fetchLocationTree(): Promise<LocationTreeCountry[]> {
  return getPublicJson<LocationTreeCountry[]>(LOCATIONS_TREE_PATH);
}

export async function fetchCompoundBySlug(
  slug: string,
): Promise<PublicCompoundDetailsDto | null> {
  try {
    return await getPublicJson<PublicCompoundDetailsDto>(
      `${COMPOUNDS_PATH}/${encodeURIComponent(slug)}`,
    );
  } catch {
    return null;
  }
}

export type PublicCompoundListItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  developer: {
    id: string;
    nameEn: string;
    nameAr: string | null;
  } | null;
  location: {
    country: { nameEn: string; nameAr: string | null } | null;
    city: { nameEn: string; nameAr: string | null } | null;
    area: { nameEn: string; nameAr: string | null };
  };
};

export async function fetchCompoundsByArea(
  areaId: string,
): Promise<PublicCompoundListItem[]> {
  const result = await getPublicJsonWithMeta<PublicCompoundListItem[]>(
    COMPOUNDS_PATH,
    { areaId, page: 1, limit: 50 },
  );
  return result.data ?? [];
}

export function resolveCatalogIdByCode(
  items: CatalogTypeDto[],
  code: string,
): string | undefined {
  const normalized = code.trim().toUpperCase();
  return items.find((item) => item.code.toUpperCase() === normalized)?.id;
}
