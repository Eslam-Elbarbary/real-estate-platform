import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getPackageService } from '@/features/packages/service';
import { PackageAudiencePage } from '@/features/packages/components/package-audience-page';
import { commercialRoleLabels } from '@/features/packages/config/catalog';

export const metadata = createPageMetadata({
  title: commercialRoleLabels.compound_developer,
  description: 'باقات مطور كمبوند — تواصل معنا لمعرفة التفاصيل.',
  path: routes.packages.compoundDeveloper,
});

export default function CompoundDeveloperPackagesPage() {
  const service = getPackageService();
  const audience = service.getAudienceBySlug('compound-developer');
  if (!audience) notFound();
  const packages = service.listPackages(audience.role);
  return <PackageAudiencePage audience={audience} packages={packages} />;
}
