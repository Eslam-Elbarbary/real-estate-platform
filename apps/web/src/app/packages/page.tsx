import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getPackageService } from '@/features/packages/service';
import { PackageRolePicker } from '@/features/packages/components/package-role-picker';
import { packageRolePickerCopy } from '@/features/packages/config/catalog';

export const metadata = createPageMetadata({
  title: packageRolePickerCopy.pageTitle,
  description: packageRolePickerCopy.pageSubtitle,
  path: routes.packages.root,
});

export default function PackagesIndexPage() {
  const audiences = getPackageService().listAudiences();
  return <PackageRolePicker audiences={audiences} />;
}
