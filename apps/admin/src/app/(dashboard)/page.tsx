import { getDashboardOverview } from '@/features/dashboard';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'نظرة عامة',
  description: 'ملخص نشاط المنصة العقارية للإدارة.',
  path: '/',
});

export default async function AdminHomePage() {
  const overview = await getDashboardOverview();

  return <DashboardOverview overview={overview} />;
}
