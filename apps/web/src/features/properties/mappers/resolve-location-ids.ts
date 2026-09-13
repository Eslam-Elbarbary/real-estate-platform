import type { LocationTreeCountry } from '@/types/api/public-property';

export interface ResolvedLocationIds {
  countryId?: string;
  cityId?: string;
  areaId?: string;
  districtId?: string;
}

/**
 * Resolve web SEO location slugs against the API tree
 * (country → city → area → district).
 *
 * Web URLs omit country slug; city/area/district slugs are matched in order.
 * The most specific match wins for the corresponding ID filter.
 */
export function resolveLocationIdsFromSlugs(
  tree: LocationTreeCountry[],
  locationSlugs: string[] | undefined,
): ResolvedLocationIds {
  if (!locationSlugs?.length) {
    return {};
  }

  const slugs = locationSlugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean);
  if (slugs.length === 0) {
    return {};
  }

  const resolved: ResolvedLocationIds = {};

  for (const country of tree) {
    for (const city of country.cities) {
      const cityIdx = slugs.indexOf(city.slug.toLowerCase());
      if (cityIdx === -1) {
        continue;
      }

      resolved.countryId = country.id;
      resolved.cityId = city.id;
      delete resolved.areaId;
      delete resolved.districtId;

      const remaining = slugs.slice(cityIdx + 1);
      if (remaining.length === 0) {
        return resolved;
      }

      for (const area of city.areas) {
        if (area.slug.toLowerCase() !== remaining[0]) {
          continue;
        }

        resolved.areaId = area.id;
        delete resolved.districtId;

        if (remaining.length === 1) {
          return resolved;
        }

        const districtSlug = remaining[1];
        const district = area.districts.find(
          (item) => item.slug.toLowerCase() === districtSlug,
        );
        if (district) {
          resolved.districtId = district.id;
        }

        return resolved;
      }

      return resolved;
    }
  }

  // Fallback: match last slug against any area/district/city in the tree
  const last = slugs[slugs.length - 1]!;
  for (const country of tree) {
    for (const city of country.cities) {
      if (city.slug.toLowerCase() === last) {
        return { countryId: country.id, cityId: city.id };
      }
      for (const area of city.areas) {
        if (area.slug.toLowerCase() === last) {
          return {
            countryId: country.id,
            cityId: city.id,
            areaId: area.id,
          };
        }
        for (const district of area.districts) {
          if (district.slug.toLowerCase() === last) {
            return {
              countryId: country.id,
              cityId: city.id,
              areaId: area.id,
              districtId: district.id,
            };
          }
        }
      }
    }
  }

  return {};
}
