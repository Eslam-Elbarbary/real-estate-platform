import type { Property } from '@/types';
import { roundCoord } from '@/features/property-search-results/lib/map-bounds';

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Spread shared area centroids into 3 nearby clusters without Math.random(). */
export function applyDeterministicCoordinates(properties: Property[]): Property[] {
  const grouped = new Map<string, Property[]>();

  for (const property of properties) {
    const key = property.location.areaSlug || property.location.citySlug;
    const list = grouped.get(key) ?? [];
    list.push(property);
    grouped.set(key, list);
  }

  const result: Property[] = [];
  for (const list of grouped.values()) {
    list.sort((left, right) => left.id.localeCompare(right.id));
    const baseLat = list[0].location.latitude;
    const baseLng = list[0].location.longitude;

    list.forEach((property, index) => {
      const cluster = index % 3;
      const inCluster = Math.floor(index / 3);
      const hash = stableHash(property.id);
      const clusterLat = (cluster - 1) * 0.0115;
      const clusterLng = (cluster - 1) * 0.0105;
      const microLat =
        ((hash % 17) - 8) * 0.00011 + (inCluster % 4) * 0.00032;
      const microLng =
        (((hash >> 8) % 17) - 8) * 0.00011 + Math.floor(inCluster / 4) * 0.00036;

      result.push({
        ...property,
        location: {
          ...property.location,
          latitude: roundCoord(baseLat + clusterLat + microLat),
          longitude: roundCoord(baseLng + clusterLng + microLng),
        },
      });
    });
  }

  return result;
}
