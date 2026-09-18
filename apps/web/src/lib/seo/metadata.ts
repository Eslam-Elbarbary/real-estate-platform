import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { PublicPlatformSettings } from '@/features/settings';
import {
  resolveMetaDescription,
  resolveMetaTitle,
  resolveOgImage,
  resolveSiteName,
} from '@/features/settings';

export interface PageSeoInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  /** When true, bypasses the root title template. */
  absoluteTitle?: boolean;
  settings?: PublicPlatformSettings;
}

function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path = '/',
  image,
  noIndex = false,
  type = 'website',
  absoluteTitle = false,
  settings,
}: PageSeoInput): Metadata {
  const siteName = settings ? resolveSiteName(settings) : siteConfig.name;
  const defaultImage = settings ? resolveOgImage(settings) : siteConfig.defaultOgImage;
  const resolvedImage = image ?? defaultImage;
  const url = absoluteUrl(path);
  const imageUrl = resolvedImage.startsWith('http')
    ? resolvedImage
    : absoluteUrl(resolvedImage);
  const displayTitle =
    absoluteTitle || title === siteName ? title : `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url,
      siteName,
      title: displayTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function createRootMetadata(
  settings?: PublicPlatformSettings,
): Metadata {
  const siteName = settings ? resolveSiteName(settings) : siteConfig.name;
  const title = settings ? resolveMetaTitle(settings) : siteConfig.name;
  const description = settings
    ? resolveMetaDescription(settings)
    : siteConfig.description;
  const ogImage = settings ? resolveOgImage(settings) : siteConfig.defaultOgImage;
  const imageUrl = ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    icons: settings?.faviconUrl
      ? {
          icon: settings.faviconUrl,
        }
      : undefined,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
