import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { CatalogManager } from '@/features/catalogs/components/catalog-manager';
import { listAdminFeatures } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المميزات',
  description: 'إدارة كتالوج المميزات والمرافق.',
  path: '/catalogs/features',
});

export default async function FeaturesCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'catalogs.view')) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminFeatures();

  return (
    <div>
      <PageHeader
        title="المميزات والمرافق"
        description="تصنيفات Indoor / Outdoor / Amenities تظهر في خطوة المميزات."
      />
      <CatalogManager
        kind="features"
        permissions={permissions}
        items={items}
        title="القائمة"
        description="أضف ميزات جديدة مثل Jacuzzi لتصبح متاحة فوراً في النماذج."
      />
    </div>
  );
}
