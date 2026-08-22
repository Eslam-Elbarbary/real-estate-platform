import { featuredAreaSlugs } from '@/config/featured-areas';
import { getLocationRepository } from '@/data/repositories';
import type { Location, LocationLevel } from '@/types';

export interface LocationOption {
  id: string;
  slug: string;
  name: string;
  level: LocationLevel;
  parentSlug?: string;
  /** Hierarchical slug path used in search URLs, e.g. ['cairo', 'new-cairo']. */
  pathSlugs: string[];
  /** Arabic breadcrumb label for the selector UI. */
  breadcrumb: string;
  propertyCount: number;
}

const levelOrder: Record<LocationLevel, number> = {
  governorate: 0,
  city: 1,
  area: 2,
  neighborhood: 3,
};

function buildPathSlugs(
  location: Location,
  bySlug: Map<string, Location>,
): string[] {
  const slugs: string[] = [location.slug];
  let current = location;

  while (current.parentSlug) {
    const parent = bySlug.get(current.parentSlug);
    if (!parent) {
      break;
    }
    slugs.unshift(parent.slug);
    current = parent;
  }

  return slugs;
}

function buildBreadcrumb(
  location: Location,
  bySlug: Map<string, Location>,
): string {
  const names: string[] = [location.name];
  let current = location;

  while (current.parentSlug) {
    const parent = bySlug.get(current.parentSlug);
    if (!parent) {
      break;
    }
    names.unshift(parent.name);
    current = parent;
  }

  return names.join(' · ');
}

export async function listLocations(): Promise<Location[]> {
  return getLocationRepository().findAll();
}

export async function getFeaturedAreas(): Promise<Location[]> {
  const locations = await listLocations();
  const bySlug = new Map(locations.map((location) => [location.slug, location]));

  return featuredAreaSlugs
    .map((slug) => bySlug.get(slug))
    .filter((location): location is Location => Boolean(location?.coverImageUrl));
}

export async function getLocationOptions(): Promise<LocationOption[]> {
  const locations = await listLocations();
  const bySlug = new Map(locations.map((location) => [location.slug, location]));

  return locations
    .map((location) => ({
      id: location.id,
      slug: location.slug,
      name: location.name,
      level: location.level,
      parentSlug: location.parentSlug,
      pathSlugs: buildPathSlugs(location, bySlug),
      breadcrumb: buildBreadcrumb(location, bySlug),
      propertyCount: location.propertyCount,
    }))
    .sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) {
        return levelDiff;
      }
      return a.name.localeCompare(b.name, 'ar');
    });
}
