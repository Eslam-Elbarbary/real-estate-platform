import type { Property } from '@/types';
import { getPropertyPoint } from './map-bounds';
import type { MapCluster } from '../types/map-search';

function cellSizeForZoom(zoom: number): number {
  if (zoom >= 16) return 0;
  if (zoom >= 15) return 0.0016;
  if (zoom >= 14) return 0.0032;
  if (zoom >= 13) return 0.006;
  return 0.012;
}

export function buildPropertyMapClusters(
  properties: Property[],
  zoom: number,
): MapCluster[] {
  const size = cellSizeForZoom(zoom);
  if (size === 0 || properties.length <= 1) {
    return properties.map((property) => {
      const center = getPropertyPoint(property);
      return {
        id: `p-${property.id}`,
        center,
        propertyIds: [property.id],
        count: 1,
      };
    });
  }

  const buckets = new Map<string, Property[]>();
  for (const property of properties) {
    const point = getPropertyPoint(property);
    const row = Math.floor(point.lat / size);
    const col = Math.floor(point.lng / size);
    const key = `${row}:${col}`;
    const list = buckets.get(key) ?? [];
    list.push(property);
    buckets.set(key, list);
  }

  return [...buckets.entries()].map(([key, items]) => {
    const lat =
      items.reduce((sum, item) => sum + item.location.latitude, 0) / items.length;
    const lng =
      items.reduce((sum, item) => sum + item.location.longitude, 0) / items.length;
    return {
      id: `c-${key}`,
      center: { lat, lng },
      propertyIds: items.map((item) => item.id),
      count: items.length,
    };
  });
}
