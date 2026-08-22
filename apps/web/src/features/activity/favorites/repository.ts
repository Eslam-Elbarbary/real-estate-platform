import { cookies } from 'next/headers';
import type { FavoriteItem } from '../types';

export const FAVORITES_COOKIE = 'demo_favorites';

function parseFavorites(raw: string | undefined): FavoriteItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as FavoriteItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface FavoritesRepository {
  list(userId: string): Promise<FavoriteItem[]>;
  add(userId: string, propertyId: string): Promise<FavoriteItem>;
  remove(userId: string, propertyId: string): Promise<void>;
  has(userId: string, propertyId: string): Promise<boolean>;
}

export class CookieFavoritesRepository implements FavoritesRepository {
  private async read(): Promise<FavoriteItem[]> {
    const jar = await cookies();
    return parseFavorites(jar.get(FAVORITES_COOKIE)?.value);
  }

  private async write(items: FavoriteItem[]): Promise<void> {
    const jar = await cookies();
    jar.set(FAVORITES_COOKIE, JSON.stringify(items), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async list(_userId: string): Promise<FavoriteItem[]> {
    void _userId;
    const items = await this.read();
    return [...items].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }

  async add(_userId: string, propertyId: string): Promise<FavoriteItem> {
    void _userId;
    const items = await this.read();
    const existing = items.find((item) => item.propertyId === propertyId);
    if (existing) return existing;
    const next: FavoriteItem = {
      id: `fav-${propertyId}`,
      propertyId,
      createdAt: new Date().toISOString(),
    };
    await this.write([next, ...items]);
    return next;
  }

  async remove(_userId: string, propertyId: string): Promise<void> {
    void _userId;
    const items = await this.read();
    await this.write(items.filter((item) => item.propertyId !== propertyId));
  }

  async has(_userId: string, propertyId: string): Promise<boolean> {
    void _userId;
    const items = await this.read();
    return items.some((item) => item.propertyId === propertyId);
  }
}

let favoritesRepository: FavoritesRepository | null = null;

export function getFavoritesRepository(): FavoritesRepository {
  if (!favoritesRepository) {
    favoritesRepository = new CookieFavoritesRepository();
  }
  return favoritesRepository;
}
