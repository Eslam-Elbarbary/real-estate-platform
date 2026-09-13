import 'server-only';

import {
  addFavoriteFromApi,
  checkFavoriteFromApi,
  listFavoritesFromApi,
  removeFavoriteFromApi,
} from '@/data/repositories/api-favorites';
import { withRefreshedAccessToken } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';
import type { Property } from '@/types';
import type { FavoriteItem } from '../types';
import {
  mapFavoritePropertyToProperty,
  mapFavoriteResponseToItem,
} from './mapper';

export type ResolvedFavorite = {
  favorite: FavoriteItem;
  property: Property;
};

export class FavoritesService {
  async list(): Promise<FavoriteItem[]> {
    const rows = await withRefreshedAccessToken((token) =>
      listFavoritesFromApi(token),
    );
    return rows.map(mapFavoriteResponseToItem);
  }

  async listResolved(): Promise<ResolvedFavorite[]> {
    const rows = await withRefreshedAccessToken((token) =>
      listFavoritesFromApi(token),
    );
    return rows.map((row) => ({
      favorite: mapFavoriteResponseToItem(row),
      property: mapFavoritePropertyToProperty(row.property),
    }));
  }

  async listPropertyIds(): Promise<string[]> {
    const rows = await withRefreshedAccessToken((token) =>
      listFavoritesFromApi(token),
    );
    return rows.map((row) => row.property.id);
  }

  /**
   * Returns favorite property ids when authenticated; empty array for guests
   * or auth failures (never throws for anonymous browsing).
   */
  async listPropertyIdsIfAuthenticated(): Promise<string[]> {
    try {
      return await this.listPropertyIds();
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        (error.code === 'UNAUTHORIZED' || error.status === 401)
      ) {
        return [];
      }
      return [];
    }
  }

  async isFavorite(propertyId: string): Promise<boolean> {
    const result = await withRefreshedAccessToken((token) =>
      checkFavoriteFromApi(propertyId, token),
    );
    return Boolean(result.isFavorite);
  }

  /**
   * Check favorite for authenticated users only; guests → false.
   */
  async isFavoriteIfAuthenticated(propertyId: string): Promise<boolean> {
    try {
      return await this.isFavorite(propertyId);
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        (error.code === 'UNAUTHORIZED' || error.status === 401)
      ) {
        return false;
      }
      return false;
    }
  }

  async add(propertyId: string): Promise<FavoriteItem> {
    try {
      const row = await withRefreshedAccessToken((token) =>
        addFavoriteFromApi(propertyId, token),
      );
      return mapFavoriteResponseToItem(row);
    } catch (error) {
      // Idempotent: already favorited
      if (error instanceof ApiRequestError && error.status === 409) {
        return {
          id: propertyId,
          propertyId,
          createdAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async remove(propertyId: string): Promise<void> {
    try {
      await withRefreshedAccessToken((token) =>
        removeFavoriteFromApi(propertyId, token),
      );
    } catch (error) {
      // Idempotent: already removed
      if (error instanceof ApiRequestError && error.status === 404) {
        return;
      }
      throw error;
    }
  }
}

let favoritesService: FavoritesService | null = null;

export function getFavoritesService(): FavoritesService {
  if (!favoritesService) {
    favoritesService = new FavoritesService();
  }
  return favoritesService;
}
