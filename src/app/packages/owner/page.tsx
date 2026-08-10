import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getPackageService } from '@/features/packages/service';
import { PackageAudiencePage } from '@/features/packages/components/package-audience-page';
import { commercialRoleLabels } from '@/features/packages/config/catalog';

export const metadata = createPageMetadata({
  title: commercialRoleLabels.owner,
  description: 'باقات مالك عقار لشحن الرصيد والإعلان.',
  path: routes.packages.owner,
});

export default function OwnerPackagesPage() {
  const service = getPackageService();
  const audience = service.getAudienceBySlug('owner');
  if (!audience) notFound();
  const packages = service.listPackages(audience.role);
  return <PackageAudiencePage audience={audience} packages={packages} />;
}
