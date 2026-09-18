import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { CatalogManager } from '@/features/catalogs/components/catalog-manager';
import { listAdminPropertyLegalStatuses } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الحالات القانونية',
  description: 'إدارة كتالوج الحالات القانونية للعقار.',
  path: '/catalogs/legal-statuses',
});

export default async function PropertyLegalStatusesCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (
    !hasPagePermission(permissions, [
      'catalogs.view',
      'property_legal_statuses.view',
    ])
  ) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminPropertyLegalStatuses();

  return (
    <div>
      <PageHeader
        title="الحالات القانونية"
        description="القيم المتاحة في خطوة تفاصيل العقار (مسجل بالشهر العقاري، عقد ابتدائي، توكيل…)."
      />
      <CatalogManager
        kind="property-legal-statuses"
        permissions={permissions}
        items={items}
        title="القائمة"
        description="أضف حالة قانونية جديدة لتصبح متاحة فوراً في نماذج العقارات."
      />
    </div>
  );
}
