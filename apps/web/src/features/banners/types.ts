export type BannerPosition =
  | 'HOME_HERO'
  | 'HOME_SECTION'
  | 'PROPERTIES_PAGE';

export interface PublicBanner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  sortOrder: number;
}

export const BANNER_CACHE_TAGS = {
  all: 'banners',
  HOME_HERO: 'banner-home-hero',
  HOME_SECTION: 'banner-home-section',
  PROPERTIES_PAGE: 'banner-properties-page',
} as const;

export function bannerCacheTagsForPosition(
  position?: BannerPosition,
): string[] {
  if (!position) {
    return [
      BANNER_CACHE_TAGS.all,
      BANNER_CACHE_TAGS.HOME_HERO,
      BANNER_CACHE_TAGS.HOME_SECTION,
      BANNER_CACHE_TAGS.PROPERTIES_PAGE,
    ];
  }
  return [BANNER_CACHE_TAGS.all, BANNER_CACHE_TAGS[position]];
}
