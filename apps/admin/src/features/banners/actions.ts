'use server';

import { revalidatePath } from 'next/cache';
import { getUserFacingErrorMessage } from '@/lib/errors';
import {
  createAdminBanner,
  deleteAdminBanner,
  listAdminBanners,
  reorderAdminBanners,
  updateAdminBanner,
} from './repository';
import type { BannerFormInput, BannerPosition } from './types';

export type BannerActionResult =
  | { ok: true; cacheInvalidated: boolean }
  | { ok: false; error: string };

const ALL_BANNER_TAGS = [
  'banners',
  'banner-home-hero',
  'banner-home-section',
  'banner-properties-page',
] as const;

const POSITION_TAG: Record<BannerPosition, string> = {
  HOME_HERO: 'banner-home-hero',
  HOME_SECTION: 'banner-home-section',
  PROPERTIES_PAGE: 'banner-properties-page',
};

function resolveWebOrigin(): string {
  return (
    process.env.WEB_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

async function invalidatePublicBannerCache(
  position?: BannerPosition,
): Promise<boolean> {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret) {
    console.warn(
      '[banners] REVALIDATE_SECRET is not set on admin — public banner cache was not invalidated.',
    );
    return false;
  }

  const tags = position
    ? ['banners', POSITION_TAG[position]]
    : [...ALL_BANNER_TAGS];

  try {
    const response = await fetch(`${resolveWebOrigin()}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({
        tags,
        paths: ['/', '/properties'],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(
        `[banners] Web revalidate failed (${response.status}) at ${resolveWebOrigin()}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[banners] Web revalidate request failed:', error);
    return false;
  }
}

async function afterBannerMutation(position?: BannerPosition) {
  revalidatePath('/banners');
  const cacheInvalidated = await invalidatePublicBannerCache(position);
  return cacheInvalidated;
}

export async function listBannersAction(position?: BannerPosition) {
  try {
    const items = await listAdminBanners(position);
    return { ok: true as const, items };
  } catch (error) {
    return {
      ok: false as const,
      error: getUserFacingErrorMessage(error),
      items: [],
    };
  }
}

export async function createBannerAction(
  input: BannerFormInput,
): Promise<BannerActionResult> {
  try {
    await createAdminBanner(input);
    const cacheInvalidated = await afterBannerMutation(input.position);
    return { ok: true, cacheInvalidated };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function updateBannerAction(
  id: string,
  input: Partial<BannerFormInput>,
): Promise<BannerActionResult> {
  try {
    await updateAdminBanner(id, input);
    const cacheInvalidated = await afterBannerMutation(input.position);
    return { ok: true, cacheInvalidated };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function deleteBannerAction(
  id: string,
  position?: BannerPosition,
): Promise<BannerActionResult> {
  try {
    await deleteAdminBanner(id);
    const cacheInvalidated = await afterBannerMutation(position);
    return { ok: true, cacheInvalidated };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}

export async function reorderBannersAction(
  items: Array<{ id: string; sortOrder: number }>,
  position?: BannerPosition,
): Promise<BannerActionResult> {
  try {
    await reorderAdminBanners(items);
    const cacheInvalidated = await afterBannerMutation(position);
    return { ok: true, cacheInvalidated };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
