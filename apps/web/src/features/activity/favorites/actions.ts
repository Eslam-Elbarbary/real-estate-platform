'use server';

import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { ApiRequestError } from '@/lib/api/errors';
import { getFavoritesService } from './service';
import type { FavoriteItem } from '../types';

export type FavoriteActionResult =
  | { ok: true; data: { isFavorite: boolean; favorite?: FavoriteItem } }
  | { ok: false; error: string; code?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'ERROR' };

function mapFavoriteError(
  error: unknown,
  action: 'add' | 'remove',
): FavoriteActionResult {
  if (error instanceof ApiRequestError) {
    if (error.code === 'UNAUTHORIZED' || error.status === 401) {
      return {
        ok: false,
        error: 'يجب تسجيل الدخول لإدارة المفضلة.',
        code: 'UNAUTHORIZED',
      };
    }
    if (error.status === 404) {
      return {
        ok: false,
        error:
          action === 'add'
            ? 'العقار غير موجود.'
            : 'تعذر إزالة العقار من المفضلة',
        code: 'NOT_FOUND',
      };
    }
    if (error.code === 'NETWORK') {
      return {
        ok: false,
        error: error.userMessage,
        code: 'ERROR',
      };
    }
  }

  return {
    ok: false,
    error:
      action === 'add'
        ? 'تعذر إضافة العقار إلى المفضلة'
        : 'تعذر إزالة العقار من المفضلة',
    code: 'ERROR',
  };
}

function revalidateFavoriteViews(propertyId: string): void {
  revalidatePath(routes.favorites);
  revalidatePath('/properties', 'layout');
  revalidatePath(`/listing/${propertyId}`, 'layout');
}

export async function addFavoriteAction(
  propertyId: string,
): Promise<FavoriteActionResult> {
  const id = propertyId?.trim();
  if (!id) {
    return { ok: false, error: 'معرّف العقار غير صالح', code: 'ERROR' };
  }

  try {
    const favorite = await getFavoritesService().add(id);
    revalidateFavoriteViews(id);
    return { ok: true, data: { isFavorite: true, favorite } };
  } catch (error) {
    return mapFavoriteError(error, 'add');
  }
}

export async function removeFavoriteAction(
  propertyId: string,
): Promise<FavoriteActionResult> {
  const id = propertyId?.trim();
  if (!id) {
    return { ok: false, error: 'معرّف العقار غير صالح', code: 'ERROR' };
  }

  try {
    await getFavoritesService().remove(id);
    revalidateFavoriteViews(id);
    return { ok: true, data: { isFavorite: false } };
  } catch (error) {
    return mapFavoriteError(error, 'remove');
  }
}
