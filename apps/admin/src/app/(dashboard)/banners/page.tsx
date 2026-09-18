import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { BannersManager, listAdminBanners } from '@/features/banners';
import { getUserFacingErrorMessage } from '@/lib/errors';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'البنرات',
  description: 'إدارة بنرات الموقع العامة.',
  path: '/banners',
});

export default async function BannersPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'banners.view')) {
    return <PagePermissionDenied />;
  }

  let items;
  try {
    items = await listAdminBanners();
  } catch (error) {
    return (
      <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
        {getUserFacingErrorMessage(error)}
      </div>
    );
  }

  return <BannersManager items={items} permissions={permissions} />;
}
