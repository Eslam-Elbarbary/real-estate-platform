import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { CatalogManager } from '@/features/catalogs/components/catalog-manager';
import { listAdminPropertyViews } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الإطلالات',
  description: 'إدارة كتالوج إطلالات العقار.',
  path: '/catalogs/views',
});

export default async function PropertyViewsCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, ['catalogs.view', 'property_views.view'])) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminPropertyViews();

  return (
    <div>
      <PageHeader
        title="الإطلالات"
        description="القيم المتاحة في خطوة تفاصيل العقار (شارع رئيسي، نيل، بحر…)."
      />
      <CatalogManager
        kind="property-views"
        permissions={permissions}
        items={items}
        title="القائمة"
        description="أضف إطلالة جديدة لتصبح متاحة فوراً في نماذج العقارات."
      />
    </div>
  );
}
