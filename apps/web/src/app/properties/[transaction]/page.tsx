import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PropertySearchResultsPage,
} from '@/features/property-search-results';
import {
  loadSearchResults,
  validateRouteParams,
} from '@/features/property-search-results/lib/load-results';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ transaction: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { transaction } = await params;
  const query = await searchParams;
  const route = validateRouteParams({ transaction });
  if (!route) {
    return createPageMetadata({
      title: 'نتائج البحث',
      description: 'نتائج البحث العقاري',
      path: `/properties/${transaction}`,
      noIndex: true,
    });
  }

  const loaded = await loadSearchResults({
    transactionType: route.transactionType,
    searchParams: query,
  });

  return createPageMetadata({
    title: loaded.metadataTitle,
    description: loaded.metadataDescription,
    path: loaded.canonicalPath,
  });
}

export default async function PropertiesTransactionPage({
  params,
  searchParams,
}: PageProps) {
  const { transaction } = await params;
  const query = await searchParams;
  const route = validateRouteParams({ transaction });
  if (!route) {
    notFound();
  }

  const loaded = await loadSearchResults({
    transactionType: route.transactionType,
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
