import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  ResearchRequestPage,
  getResearchService,
  parseResearchRequestType,
} from '@/features/advice/research';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const type = parseResearchRequestType(await searchParams);
  if (!type) {
    return createPageMetadata({
      title: 'طلب غير موجود',
      description: 'تعذر العثور على نوع طلب الأبحاث.',
      noIndex: true,
    });
  }
  const definition = await getResearchService().getRequestDefinition(type);
  if (!definition) {
    return createPageMetadata({
      title: 'طلب غير موجود',
      description: 'تعذر العثور على نوع طلب الأبحاث.',
      noIndex: true,
    });
  }
  return createPageMetadata(getResearchService().buildRequestMetadata(definition));
}

export default async function AdviceResearchRequestRoute({
  searchParams,
}: PageProps) {
  const type = parseResearchRequestType(await searchParams);
  if (!type) notFound();
  const definition = await getResearchService().getRequestDefinition(type);
  if (!definition) notFound();
  return <ResearchRequestPage definition={definition} />;
}
