import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getLocationOptions } from '@/features/locations';
import { ValuationWizard } from '@/features/valuation/components/valuation-wizard';
import type { ValuationGoal } from '@/features/valuation/types';

export const metadata = createPageMetadata({
  title: 'إضافة تقييم جديد',
  description: 'أدخل بيانات عقارك للحصول على تقدير تجريبي للسعر.',
  path: routes.valuation.add,
  noIndex: true,
});

function parseGoal(
  value: string | string[] | undefined,
): ValuationGoal | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'owned-property' || raw === 'price-inquiry') return raw;
  return undefined;
}

export default async function ValuationAddPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.valuation.add)}`,
    );
  }

  const params = await searchParams;
  const initialGoal = parseGoal(params.goal);
  const locations = await getLocationOptions();

  return (
    <ValuationWizard locations={locations} initialGoal={initialGoal} />
  );
}
