import { mockLocations } from '@/data/mock/locations';
import type { Location } from '@/types';

export interface LocationRepository {
  findAll(): Promise<Location[]>;
  findBySlug(slug: string): Promise<Location | null>;
  findChildren(parentSlug: string): Promise<Location[]>;
}

export class MockLocationRepository implements LocationRepository {
  async findAll(): Promise<Location[]> {
    return [...mockLocations];
  }

  async findBySlug(slug: string): Promise<Location | null> {
    return mockLocations.find((location) => location.slug === slug) ?? null;
  }

  async findChildren(parentSlug: string): Promise<Location[]> {
    return mockLocations.filter((location) => location.parentSlug === parentSlug);
  }
}

let locationRepository: LocationRepository | null = null;

export function getLocationRepository(): LocationRepository {
  if (!locationRepository) {
    locationRepository = new MockLocationRepository();
  }

  return locationRepository;
}
