import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ValuationPublicLanding } from '@/features/valuation/components/valuation-public-landing';
import { ValuationDashboard } from '@/features/valuation/components/valuation-dashboard';
import { getValuationService } from '@/features/valuation/service';

export async function generateMetadata() {
  const session = await getServerSession();
  return createPageMetadata({
    title: session ? 'تقييم العقار' : 'تقييم العقارات',
    description:
      'قدّر قيمة عقارك باستخدام أداة تقييم العقارات واطلع على متوسط أسعار المتر في منطقتك.',
    path: routes.valuation.root,
    noIndex: Boolean(session),
  });
}

export default async function ValuationPage() {
  const session = await getServerSession();

  if (!session) {
    return <ValuationPublicLanding />;
  }

  const service = getValuationService();
  const [valuations, portfolio] = await Promise.all([
    service.listValuations(),
    service.listPortfolio(),
  ]);

  return <ValuationDashboard valuations={valuations} portfolio={portfolio} />;
}
