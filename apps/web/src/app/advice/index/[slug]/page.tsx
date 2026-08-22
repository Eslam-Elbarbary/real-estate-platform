import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  AdviceArticleDetailsPage,
  getAdviceArticleService,
} from '@/features/advice/articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const view = await getAdviceArticleService().getArticleDetails(slug);
  if (!view) {
    return createPageMetadata({
      title: 'المقال غير موجود',
      description: 'تعذر العثور على هذه النصيحة العقارية.',
      noIndex: true,
    });
  }
  return createPageMetadata(
    getAdviceArticleService().buildArticleMetadata(view.article),
  );
}

export default async function AdviceArticleDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  const view = await getAdviceArticleService().getArticleDetails(slug);
  if (!view) notFound();
  return <AdviceArticleDetailsPage view={view} />;
}
