import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import {
  AdviceQuestionDetailsPage,
  getAdviceService,
  hasAdviceFlash,
  parseAdviceSearchParams,
} from '@/features/advice';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const result = await getAdviceService().getQuestionDetails(id, slug);
  if (result.status === 'missing') {
    return createPageMetadata({
      title: 'السؤال غير موجود',
      description: 'لم يتم العثور على هذا السؤال.',
      path: routes.advice.ask.question(id, slug),
      noIndex: true,
    });
  }
  const question =
    result.status === 'redirect' ? result.question : result.view.question;
  return createPageMetadata(getAdviceService().buildQuestionMetadata(question));
}

export default async function AdviceQuestionDetailsRoute({
  params,
  searchParams,
}: PageProps) {
  const { id, slug } = await params;
  const query = await searchParams;
  const filters = parseAdviceSearchParams(query);
  const [result, session] = await Promise.all([
    getAdviceService().getQuestionDetails(id, slug, filters.transaction),
    getServerSession(),
  ]);

  if (result.status === 'missing') {
    notFound();
  }

  if (result.status === 'redirect') {
    redirect(encodeURI(routes.advice.ask.question(result.question.id, result.question.slug)));
  }

  return (
    <AdviceQuestionDetailsPage
      view={result.view}
      filters={filters}
      isAuthenticated={Boolean(session)}
      created={hasAdviceFlash(query, 'created')}
      answered={hasAdviceFlash(query, 'answered')}
    />
  );
}
