import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { getPropertyFormCatalogs } from '@/features/properties';
import { PropertyWizardShell } from '@/features/properties/components/wizard/property-wizard-shell';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'إضافة عقار',
  description: 'إنشاء عقار جديد عبر معالج متعدد الخطوات.',
  path: '/properties/create',
});

export default async function CreatePropertyPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'properties.create')) {
    return <PagePermissionDenied />;
  }

  const catalogs = await getPropertyFormCatalogs();

  return (
    <PropertyWizardShell
      mode="create"
      catalogs={catalogs}
      permissions={permissions}
    />
  );
}
