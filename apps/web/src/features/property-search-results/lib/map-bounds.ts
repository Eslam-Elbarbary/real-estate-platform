import type { Property } from '@/types';
import type { GeoPoint, MapBounds } from '../types/map-search';

export const EGYPT_CENTER: GeoPoint = { lat: 30.0444, lng: 31.2357 };

export function roundCoord(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

export function getPropertyPoint(property: Property): GeoPoint {
  return {
    lat: property.location.latitude,
    lng: property.location.longitude,
  };
}

export function pointInBounds(point: GeoPoint, bounds: MapBounds): boolean {
  return (
    point.lat <= bounds.north &&
    point.lat >= bounds.south &&
    point.lng <= bounds.east &&
    point.lng >= bounds.west
  );
}

export function getPropertiesInsideBounds(
  properties: Property[],
  bounds: MapBounds,
): Property[] {
  return properties.filter((property) =>
    pointInBounds(getPropertyPoint(property), bounds),
  );
}

export function getBoundsForProperties(properties: Property[]): MapBounds | null {
  const points = properties.map(getPropertyPoint);
  if (!points.length) return null;

  let north = points[0].lat;
  let south = points[0].lat;
  let east = points[0].lng;
  let west = points[0].lng;

  for (const point of points) {
    north = Math.max(north, point.lat);
    south = Math.min(south, point.lat);
    east = Math.max(east, point.lng);
    west = Math.min(west, point.lng);
  }

  if (north === south) {
    north += 0.004;
    south -= 0.004;
  }
  if (east === west) {
    east += 0.004;
    west -= 0.004;
  }

  return { north, south, east, west };
}

export function padBounds(bounds: MapBounds, factor = 0.18): MapBounds {
  const latPad = Math.max((bounds.north - bounds.south) * factor, 0.002);
  const lngPad = Math.max((bounds.east - bounds.west) * factor, 0.002);
  return {
    north: bounds.north + latPad,
    south: bounds.south - latPad,
    east: bounds.east + lngPad,
    west: bounds.west - lngPad,
  };
}

export function boundsSpanKmApprox(bounds: MapBounds): number {
  const latKm = (bounds.north - bounds.south) * 111;
  const lngKm =
    (bounds.east - bounds.west) *
    111 *
    Math.cos((((bounds.north + bounds.south) / 2) * Math.PI) / 180);
  return Math.max(latKm, lngKm);
}
