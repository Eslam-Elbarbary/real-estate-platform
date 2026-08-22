import { getPropertyRepository } from '@/data/repositories';
import type { Property } from '@/types';
import { getFavoritesRepository } from './repository';
import type { FavoriteItem } from '../types';

export class FavoritesService {
  constructor(
    private readonly repository = getFavoritesRepository(),
    private readonly properties = getPropertyRepository(),
  ) {}

  list(userId: string): Promise<FavoriteItem[]> {
    return this.repository.list(userId);
  }

  async listResolved(userId: string): Promise<
    Array<{ favorite: FavoriteItem; property: Property }>
  > {
    const favorites = await this.repository.list(userId);
    const resolved: Array<{ favorite: FavoriteItem; property: Property }> = [];
    for (const favorite of favorites) {
      const property = await this.properties.findById(favorite.propertyId);
      if (property) resolved.push({ favorite, property });
    }
    return resolved;
  }

  add(userId: string, propertyId: string): Promise<FavoriteItem> {
    return this.repository.add(userId, propertyId);
  }

  remove(userId: string, propertyId: string): Promise<void> {
    return this.repository.remove(userId, propertyId);
  }
}

let favoritesService: FavoritesService | null = null;

export function getFavoritesService(): FavoritesService {
  if (!favoritesService) favoritesService = new FavoritesService();
  return favoritesService;
}
