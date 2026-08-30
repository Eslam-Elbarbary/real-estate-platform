import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface PageSeoInput {
  title: string;
  description: string;
  path?: string;
}

export function createRootMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function createPageMetadata({
  title,
  description,
  path = '/',
}: PageSeoInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}
