import { notFound } from 'next/navigation';
import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { getAdminPropertyDetails } from '@/features/properties';
import { getPropertyContact } from '@/features/properties/api-property-contact';
import { PropertyDetails } from '@/features/properties/components/property-details';
import { AdminError } from '@/lib/errors';
import { handleAdminPageError } from '@/lib/server/handle-admin-page-error';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تفاصيل العقار',
  description: 'مراجعة تفاصيل العقار قبل الاعتماد أو الرفض.',
  path: '/properties',
});

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'properties.view')) {
    return <PagePermissionDenied />;
  }

  const { id } = await params;

  try {
    const [property, contact] = await Promise.all([
      getAdminPropertyDetails(id),
      getPropertyContact(id).catch(() => null),
    ]);
    return (
      <PropertyDetails
        property={property}
        permissions={permissions}
        contact={contact}
      />
    );
  } catch (error) {
    if (error instanceof AdminError && error.code === 'NOT_FOUND') {
      notFound();
    }
    handleAdminPageError(error);
  }
}
