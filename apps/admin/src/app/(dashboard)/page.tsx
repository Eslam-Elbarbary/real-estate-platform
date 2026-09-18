import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
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
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'dashboard.view')) {
    return <PagePermissionDenied />;
  }

  const overview = await getDashboardOverview();

  return (
    <DashboardOverview
      overview={overview}
      roles={session?.user.roles ?? []}
      permissions={permissions}
    />
  );
}
