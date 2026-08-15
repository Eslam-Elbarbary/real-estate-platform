import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  MarketIndexPage,
  getMarketIndexService,
  parseMarketIndexSearchParams,
} from '@/features/market-index';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const filters = parseMarketIndexSearchParams(await searchParams);
  return createPageMetadata(
    getMarketIndexService().buildListingMetadata(filters),
  );
}

export default async function MarketIndexRoute({ searchParams }: PageProps) {
  const filters = parseMarketIndexSearchParams(await searchParams);
  const result = await getMarketIndexService().list(filters);
  return <MarketIndexPage result={result} />;
}
