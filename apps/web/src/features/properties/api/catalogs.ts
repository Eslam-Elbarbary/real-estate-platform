import 'server-only';

import { getPublicJson } from '@/lib/api/client';
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

export function resolveCatalogIdByCode(
  items: CatalogTypeDto[],
  code: string,
): string | undefined {
  const normalized = code.trim().toUpperCase();
  return items.find((item) => item.code.toUpperCase() === normalized)?.id;
}
