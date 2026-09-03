import { getDashboardOverview } from '@/features/dashboard';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'لوحة التحكم العقارية',
  description: 'مركز قيادة لإدارة المحفظة العقارية والمطورين والعملاء.',
  path: '/',
});

export default async function AdminHomePage() {
  const [overview, session] = await Promise.all([
    getDashboardOverview(),
    getAdminSession(),
  ]);

  return (
    <DashboardOverview
      overview={overview}
      roles={session?.user.roles ?? []}
      permissions={session?.user.permissions ?? []}
    />
  );
}
