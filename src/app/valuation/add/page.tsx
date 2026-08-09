import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getLocationOptions } from '@/features/locations';
import { ValuationWizard } from '@/features/valuation/components/valuation-wizard';

export const metadata = createPageMetadata({
  title: 'إضافة تقييم جديد',
  description: 'أدخل بيانات عقارك للحصول على تقدير تجريبي للسعر.',
  path: routes.valuation.add,
  noIndex: true,
});

export default async function ValuationAddPage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.valuation.add)}`,
    );
  }

  const locations = await getLocationOptions();

  return <ValuationWizard locations={locations} />;
}
