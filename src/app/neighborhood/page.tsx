import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  getNeighborhoodService,
  NeighborhoodDirectoryPage,
} from '@/features/neighborhoods';
import { neighborhoodDirectoryMetadata } from '@/features/neighborhoods/components/neighborhood-directory-page';
import type { TransactionType } from '@/types';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseTransaction(
  value: string | string[] | undefined,
): TransactionType {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'rent' ? 'rent' : 'sale';
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = neighborhoodDirectoryMetadata();
  return createPageMetadata(meta);
}

export default async function NeighborhoodDirectoryRoute({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const transaction = parseTransaction(params.transaction);
  const view = await getNeighborhoodService().getDirectory(transaction);

  return (
    <NeighborhoodDirectoryPage view={view} transaction={transaction} />
  );
}
