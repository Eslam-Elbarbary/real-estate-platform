import 'server-only';

import { env } from '@/config/env';
import {
  bannerCacheTagsForPosition,
  type BannerPosition,
  type PublicBanner,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const BANNERS_PATH = '/api/v1/banners';
/** Soft fallback if on-demand revalidation fails. Prefer tag invalidation. */
const REVALIDATE_SECONDS = 30;

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = env.apiBaseUrl.endsWith('/') ? env.apiBaseUrl : `${env.apiBaseUrl}/`;
  return new URL(normalizedPath, base).toString();
}

export async function getPublicBanners(
  position?: BannerPosition,
): Promise<PublicBanner[]> {
  try {
    const url = new URL(buildUrl(BANNERS_PATH));
    if (position) {
      url.searchParams.set('position', position);
    }

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: bannerCacheTagsForPosition(position),
      },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiEnvelope<PublicBanner[]>;
    if (!payload.success || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data.filter(
      (banner) =>
        typeof banner?.id === 'string' &&
        typeof banner?.imageUrl === 'string' &&
        banner.imageUrl.length > 0,
    );
  } catch {
    return [];
  }
}
