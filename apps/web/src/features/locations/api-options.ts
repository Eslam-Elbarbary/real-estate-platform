import 'server-only';

import { fetchLocationTree } from '@/features/properties/api/catalogs';
import type { LocationOption } from '@/features/locations/service';
import type { LocationLevel } from '@/types';
import type { LocationTreeCountry } from '@/types/api/public-property';

function displayName(nameAr: string | null, nameEn: string): string {
  return nameAr?.trim() || nameEn;
}

/**
 * Build search location options from the live locations tree
 * so URL slugs resolve to the same IDs used by property search.
 */
export function mapLocationTreeToOptions(
  tree: LocationTreeCountry[],
): LocationOption[] {
  const options: LocationOption[] = [];

  for (const country of tree) {
    for (const city of country.cities) {
      const cityName = displayName(city.nameAr, city.nameEn);
      options.push({
        id: city.id,
        slug: city.slug,
        name: cityName,
        level: 'city' satisfies LocationLevel,
        pathSlugs: [city.slug],
        breadcrumb: cityName,
        propertyCount: 0,
      });

      for (const area of city.areas) {
        const areaName = displayName(area.nameAr, area.nameEn);
        options.push({
          id: area.id,
          slug: area.slug,
          name: areaName,
          level: 'area',
          parentSlug: city.slug,
          pathSlugs: [city.slug, area.slug],
          breadcrumb: `${cityName} · ${areaName}`,
          propertyCount: 0,
          areaId: area.id,
        });

        for (const district of area.districts) {
          const districtName = displayName(district.nameAr, district.nameEn);
          options.push({
            id: district.id,
            slug: district.slug,
            name: districtName,
            level: 'neighborhood',
            parentSlug: area.slug,
            pathSlugs: [city.slug, area.slug, district.slug],
            breadcrumb: `${cityName} · ${areaName} · ${districtName}`,
            propertyCount: 0,
            areaId: area.id,
            districtId: district.id,
          });
        }
      }
    }
  }

  return options.sort((a, b) => {
    const levelOrder: Record<LocationLevel, number> = {
      governorate: 0,
      city: 1,
      area: 2,
      neighborhood: 3,
    };
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    if (levelDiff !== 0) {
      return levelDiff;
    }
    return a.name.localeCompare(b.name, 'ar');
  });
}

export async function getSearchLocationOptions(): Promise<LocationOption[]> {
  const tree = await fetchLocationTree();
  return mapLocationTreeToOptions(tree);
}
