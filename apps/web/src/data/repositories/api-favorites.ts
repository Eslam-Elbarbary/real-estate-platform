import 'server-only';

import {
  deleteAuthedJson,
  getJson,
  postAuthedJson,
} from '@/lib/api/client';
import type {
  FavoriteCheckDto,
  FavoriteRemoveDto,
  FavoriteResponseDto,
} from '@/types/api/favorites';

const FAVORITES_PATH = '/api/v1/favorites';

export async function listFavoritesFromApi(
  accessToken: string,
): Promise<FavoriteResponseDto[]> {
  const data = await getJson<FavoriteResponseDto[]>(FAVORITES_PATH, accessToken);
  return Array.isArray(data) ? data : [];
}

export async function checkFavoriteFromApi(
  propertyId: string,
  accessToken: string,
): Promise<FavoriteCheckDto> {
  return getJson<FavoriteCheckDto>(
    `${FAVORITES_PATH}/${encodeURIComponent(propertyId)}/check`,
    accessToken,
  );
}

export async function addFavoriteFromApi(
  propertyId: string,
  accessToken: string,
): Promise<FavoriteResponseDto> {
  return postAuthedJson<FavoriteResponseDto, Record<string, never>>(
    `${FAVORITES_PATH}/${encodeURIComponent(propertyId)}`,
    {},
    accessToken,
  );
}

export async function removeFavoriteFromApi(
  propertyId: string,
  accessToken: string,
): Promise<FavoriteRemoveDto> {
  return deleteAuthedJson<FavoriteRemoveDto>(
    `${FAVORITES_PATH}/${encodeURIComponent(propertyId)}`,
    accessToken,
  );
}
