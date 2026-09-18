import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { CatalogManager } from '@/features/catalogs/components/catalog-manager';
import { listAdminPropertyTypes } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'أنواع العقارات',
  description: 'إدارة كتالوج أنواع العقارات.',
  path: '/catalogs/property-types',
});

export default async function PropertyTypesCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'catalogs.view')) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminPropertyTypes();

  return (
    <div>
      <PageHeader
        title="أنواع العقارات"
        description="تظهر الأنواع النشطة تلقائياً في معالج إنشاء العقارات."
      />
      <CatalogManager
        kind="property-types"
        permissions={permissions}
        items={items}
        title="القائمة"
        description="أنشئ أو عطّل أنواع العقارات دون تعديل الكود."
      />
    </div>
  );
}
