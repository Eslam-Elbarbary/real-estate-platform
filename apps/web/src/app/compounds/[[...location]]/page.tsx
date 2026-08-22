import type { Metadata } from 'next';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import {
  CompoundDirectoryPage,
  loadCompoundDirectory,
} from '@/features/compound-directory';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ location?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { location } = await params;
  const query = await searchParams;
  const { filters, result } = await loadCompoundDirectory(location, query);
  const path = filters.locationSlugs?.length
    ? routes.compounds.byLocation(filters.locationSlugs)
    : routes.compounds.root;

  const count = result.marketEstimate ?? result.total;

  return createPageMetadata({
    title: `${uiLabels.compoundsDirectoryTitlePrefix} - ${count} ${uiLabels.compoundsDirectoryTitleSuffix}`,
    description:
      'تصفّح دليل الكمبوندات والمشاريع السكنية مع فلترة حسب الموقع ونوع العقار والسعر.',
    path,
  });
}

export default async function CompoundsDirectoryRoute({
  params,
  searchParams,
}: PageProps) {
  const { location } = await params;
  const query = await searchParams;
  const { filters, result } = await loadCompoundDirectory(location, query);

  return <CompoundDirectoryPage filters={filters} result={result} />;
}
