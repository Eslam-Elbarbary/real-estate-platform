import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { LocationsManager } from '@/features/locations/components/locations-manager';
import { listAdminCountries } from '@/features/locations/admin-repository';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المواقع',
  description: 'إدارة الدول والمدن والمناطق والأحياء.',
  path: '/catalogs/locations',
});

export default async function LocationsCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, ['catalogs.view', 'locations.view'])) {
    return <PagePermissionDenied />;
  }

  const countries = await listAdminCountries();

  return (
    <div>
      <PageHeader
        title="الدول والمدن والمناطق والأحياء"
        description="اختر دولة لعرض مدنها، ثم مدينة لعرض مناطقها، ثم منطقة لعرض أحيائها."
      />
      <LocationsManager permissions={permissions} initialCountries={countries} />
    </div>
  );
}
