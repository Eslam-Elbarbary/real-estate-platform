import 'server-only';

import { env } from '@/config/env';
import { siteConfig } from '@/config/site';
import type { PublicPlatformSettings } from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const SETTINGS_PATH = '/api/v1/settings';
const REVALIDATE_SECONDS = 60;

export const PLATFORM_SETTINGS_FALLBACK: PublicPlatformSettings = {
  siteName: siteConfig.name,
  shortName: siteConfig.shortName,
  description: siteConfig.description,
  logoUrl: null,
  faviconUrl: null,
  email: siteConfig.contactEmail,
  phone: null,
  whatsapp: siteConfig.support.whatsappPhone,
  address: null,
  facebookUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  metaTitle: siteConfig.name,
  metaDescription: siteConfig.description,
  ogImageUrl: null,
};

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = env.apiBaseUrl.endsWith('/') ? env.apiBaseUrl : `${env.apiBaseUrl}/`;
  return new URL(normalizedPath, base).toString();
}

/**
 * Public platform settings with Next.js ISR-style caching.
 * Falls back to siteConfig defaults when the API is unavailable.
 */
export async function getPlatformSettings(): Promise<PublicPlatformSettings> {
  try {
    const response = await fetch(buildUrl(SETTINGS_PATH), {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['platform-settings'] },
    });

    if (!response.ok) {
      return PLATFORM_SETTINGS_FALLBACK;
    }

    const payload = (await response.json()) as ApiEnvelope<PublicPlatformSettings>;
    if (!payload.success || !payload.data) {
      return PLATFORM_SETTINGS_FALLBACK;
    }

    return {
      ...PLATFORM_SETTINGS_FALLBACK,
      ...payload.data,
      siteName: payload.data.siteName || PLATFORM_SETTINGS_FALLBACK.siteName,
      shortName: payload.data.shortName || PLATFORM_SETTINGS_FALLBACK.shortName,
    };
  } catch {
    return PLATFORM_SETTINGS_FALLBACK;
  }
}

export function resolveSiteName(settings: PublicPlatformSettings): string {
  return settings.siteName.trim() || siteConfig.name;
}

export function resolveMetaTitle(settings: PublicPlatformSettings): string {
  return settings.metaTitle?.trim() || resolveSiteName(settings);
}

export function resolveMetaDescription(settings: PublicPlatformSettings): string {
  return (
    settings.metaDescription?.trim() ||
    settings.description?.trim() ||
    siteConfig.description
  );
}

export function resolveOgImage(settings: PublicPlatformSettings): string {
  return settings.ogImageUrl?.trim() || siteConfig.defaultOgImage;
}
