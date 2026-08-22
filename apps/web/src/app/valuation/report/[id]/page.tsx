import { notFound, redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ValuationReport } from '@/features/valuation/components/valuation-report';
import { getValuationService } from '@/features/valuation/service';

interface ValuationReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ValuationReportPageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: 'تقرير التقييم',
    description: 'عرض نتيجة تقييم العقار التقديرية.',
    path: routes.valuation.report(id),
    noIndex: true,
  });
}

export default async function ValuationReportPage({
  params,
}: ValuationReportPageProps) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.valuation.report(id))}`,
    );
  }

  const service = getValuationService();
  const result = await service.getById(id);
  if (!result) {
    notFound();
  }

  const related = await service.getRelatedListings(result, 6);

  return <ValuationReport result={result} related={related} />;
}
