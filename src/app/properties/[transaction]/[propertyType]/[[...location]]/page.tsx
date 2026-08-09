import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertySearchResultsPage } from '@/features/property-search-results';
import {
  loadSearchResults,
  validateRouteParams,
} from '@/features/property-search-results/lib/load-results';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{
    transaction: string;
    propertyType: string;
    location?: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { transaction, propertyType, location } = await params;
  const query = await searchParams;
  const route = validateRouteParams({ transaction, propertyType });
  if (!route) {
    return createPageMetadata({
      title: 'نتائج البحث',
      description: 'نتائج البحث العقاري',
      path: `/properties/${transaction}/${propertyType}`,
      noIndex: true,
    });
  }

  const loaded = await loadSearchResults({
    transactionType: route.transactionType,
    propertyType: route.propertyType,
    locationSlugs: location,
    searchParams: query,
  });

  return createPageMetadata({
    title: loaded.metadataTitle,
    description: loaded.metadataDescription,
    path: loaded.canonicalPath,
  });
}

export default async function PropertiesTypedLocationPage({
  params,
  searchParams,
}: PageProps) {
  const { transaction, propertyType, location } = await params;
  const query = await searchParams;
  const route = validateRouteParams({ transaction, propertyType });
  if (!route) {
    notFound();
  }

  const loaded = await loadSearchResults({
    transactionType: route.transactionType,
    propertyType: route.propertyType,
    locationSlugs: location,
    searchParams: query,
  });

  return (
    <PropertySearchResultsPage
      filters={loaded.filters}
      result={loaded.result}
      locations={loaded.locations}
      selectedLocation={loaded.selectedLocation}
      subtypeCounts={loaded.subtypeCounts}
    />
  );
}
