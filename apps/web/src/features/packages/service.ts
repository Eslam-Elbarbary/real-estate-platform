import type { CommercialAccountRole, CreditPackage } from '@/features/credits/types';
import {
  getAudienceBySlug,
  getPackagesForAudience,
  packageAudiences,
  type PackageAudienceDefinition,
} from './config/catalog';

export class PackageService {
  listAudiences(): PackageAudienceDefinition[] {
    return packageAudiences;
  }

  getAudienceBySlug(slug: string): PackageAudienceDefinition | null {
    return getAudienceBySlug(slug);
  }

  listPackages(role: CommercialAccountRole): CreditPackage[] {
    return getPackagesForAudience(role);
  }

  getPackageById(id: string): CreditPackage | null {
    for (const audience of packageAudiences) {
      const found = getPackagesForAudience(audience.role).find(
        (item) => item.id === id,
      );
      if (found) return found;
    }
    return null;
  }
}

let packageService: PackageService | null = null;

export function getPackageService(): PackageService {
  if (!packageService) {
    packageService = new PackageService();
  }
  return packageService;
}
