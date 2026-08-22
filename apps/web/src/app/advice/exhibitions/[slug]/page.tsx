import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  ExhibitionDetailsPage,
  getExhibitionService,
} from '@/features/advice/exhibitions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getExhibitionService().listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const view = await getExhibitionService().getExhibitionDetails(slug);
  if (!view) {
    return createPageMetadata({
      title: 'الفعالية غير موجودة',
      description: 'تعذر العثور على هذه الفعالية العقارية.',
      noIndex: true,
    });
  }
  return createPageMetadata(
    getExhibitionService().buildDetailsMetadata(view.exhibition),
  );
}

export default async function AdviceExhibitionDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const view = await getExhibitionService().getExhibitionDetails(slug);
  if (!view) notFound();
  return <ExhibitionDetailsPage view={view} />;
}
