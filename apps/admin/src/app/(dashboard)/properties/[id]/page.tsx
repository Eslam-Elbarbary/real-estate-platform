import { getAdminPropertyDetails, getPropertyFormCatalogs } from '@/features/properties';
import { PropertyDetails } from '@/features/properties/components/property-details';
import { getAdminSession } from '@/features/auth/service';
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
  const { id } = await params;
  const [property, catalogs, session] = await Promise.all([
    getAdminPropertyDetails(id),
    getPropertyFormCatalogs(),
    getAdminSession(),
  ]);
  const roles = session?.user.roles ?? [];

  return (
    <PropertyDetails property={property} catalogs={catalogs} roles={roles} />
  );
}
