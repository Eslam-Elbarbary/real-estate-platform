import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { CatalogManager } from '@/features/catalogs/components/catalog-manager';
import { listAdminTransactionTypes } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'أنواع المعاملات',
  description: 'إدارة كتالوج أنواع المعاملات.',
  path: '/catalogs/transaction-types',
});

export default async function TransactionTypesCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'catalogs.view')) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminTransactionTypes();

  return (
    <div>
      <PageHeader
        title="أنواع المعاملات"
        description="بيع، إيجار، وأي معاملات أخرى نشطة في المنصة."
      />
      <CatalogManager
        kind="transaction-types"
        permissions={permissions}
        items={items}
        title="القائمة"
        description="إدارة أنواع المعاملات الديناميكية."
      />
    </div>
  );
}
