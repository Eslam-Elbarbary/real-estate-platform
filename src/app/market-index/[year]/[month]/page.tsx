import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  MarketIndexMonthPage,
  getMarketIndexService,
} from '@/features/market-index';
import { marketIndexPeriodSchema } from '@/features/market-index/schemas';

interface PageProps {
  params: Promise<{ year: string; month: string }>;
}

export async function generateStaticParams() {
  const periods = await getMarketIndexService().listPeriods();
  return periods.map((item) => ({
    year: String(item.year),
    month: String(item.month),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = await params;
  const parsed = marketIndexPeriodSchema.safeParse(raw);
  if (!parsed.success) {
    return createPageMetadata({
      title: 'التقرير غير موجود',
      description: 'تعذر العثور على تقرير المؤشر العقاري.',
      noIndex: true,
    });
  }
  const view = await getMarketIndexService().getDetails(
    parsed.data.year,
    parsed.data.month,
  );
  if (!view) {
    return createPageMetadata({
      title: 'التقرير غير موجود',
      description: 'تعذر العثور على تقرير المؤشر العقاري.',
      noIndex: true,
    });
  }
  return createPageMetadata(
    getMarketIndexService().buildMonthMetadata(view.entry),
  );
}

export default async function MarketIndexMonthRoute({ params }: PageProps) {
  const raw = await params;
  const parsed = marketIndexPeriodSchema.safeParse(raw);
  if (!parsed.success) notFound();
  const view = await getMarketIndexService().getDetails(
    parsed.data.year,
    parsed.data.month,
  );
  if (!view) notFound();
  return <MarketIndexMonthPage view={view} />;
}
