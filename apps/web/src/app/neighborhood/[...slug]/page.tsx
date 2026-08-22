import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/config/site';
import {
  getNeighborhoodService,
  NeighborhoodDetailsPage,
} from '@/features/neighborhoods';
import type { TransactionType } from '@/types';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseTransaction(
  value: string | string[] | undefined,
): TransactionType {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'rent' ? 'rent' : 'sale';
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const view = await getNeighborhoodService().getByPath(slug);
  if (!view) {
    return createPageMetadata({
      title: 'المنطقة غير موجودة',
      description: 'تعذر العثور على دليل الأسعار المطلوب.',
      path: `/neighborhood/${slug.join('/')}`,
      noIndex: true,
    });
  }
  const meta = getNeighborhoodService().buildMetadata(view.neighborhood);
  return createPageMetadata({
    title: `${meta.title} | ${siteConfig.name}`,
    description: meta.description,
    path: meta.path,
    image: meta.image,
  });
}

export default async function NeighborhoodDetailsRoute({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const transaction = parseTransaction(query.transaction);
  const view = await getNeighborhoodService().getByPath(slug);
  if (!view) notFound();

  const shareUrl = `${siteConfig.url}${view.neighborhood.breadcrumb.at(-1)?.href ?? ''}`;

  return (
    <NeighborhoodDetailsPage
      view={view}
      transaction={transaction}
      shareUrl={shareUrl}
    />
  );
}
