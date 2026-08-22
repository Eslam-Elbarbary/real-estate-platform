export {
  commercialRoleLabels,
  packageAudiences,
  packagePageCopy,
  packageRolePickerCopy,
  getAudienceBySlug,
  getPackagesForAudience,
  type PackageAudienceDefinition,
} from './config/catalog';

export type { PackageFaqItem, PackageTermsContent } from './config/faq-terms';
export {
  defaultPackageFaqs,
  defaultPackageTerms,
  resolvePackageFaqs,
  resolvePackageTerms,
} from './config/faq-terms';

export { getPackageService, PackageService } from './service';
