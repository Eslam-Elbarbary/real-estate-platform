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
  description: 'إدارة كتالوج مميزات العقارات.',
  path: '/features',
});

export default async function FeaturesPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (
    !hasPagePermission(permissions, ['features.view', 'catalogs.view'])
  ) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminFeatures();

  return (
    <div>
      <PageHeader
        title="المميزات"
        description="أنشئ وعدّل مميزات الكتالوج (مصعد، موقف، حديقة…). تظهر فوراً في نماذج إنشاء العقارات."
      />
      <CatalogManager
        kind="features"
        permissions={permissions}
        items={items}
        title="كتالوج المميزات"
        description="الاسم العربي والإنجليزي والرمز والفئة والحالة. الأيقونات تُعرض تلقائياً حسب الرمز في خطوة المميزات."
      />
    </div>
  );
}
