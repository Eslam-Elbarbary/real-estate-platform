import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import {
  getAdminPropertyDetails,
  getPropertyFormCatalogs,
} from '@/features/properties';
import { PropertyWizardShell } from '@/features/properties/components/wizard/property-wizard-shell';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تعديل العقار',
  description: 'تعديل بيانات العقار عبر معالج متعدد الخطوات.',
  path: '/properties',
});

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'properties.update')) {
    return <PagePermissionDenied />;
  }

  const { id } = await params;
  const [property, catalogs] = await Promise.all([
    getAdminPropertyDetails(id),
    getPropertyFormCatalogs(),
  ]);

  return (
    <PropertyWizardShell
      mode="edit"
      initialData={property}
      catalogs={catalogs}
      permissions={permissions}
    />
  );
}
