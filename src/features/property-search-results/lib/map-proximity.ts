import type { Property } from '@/types';

const CELL = 0.008;

export function groupPropertiesByMapProximity(properties: Property[]): Property[] {
  const groups = new Map<string, Property[]>();
  const order: string[] = [];

  for (const property of properties) {
    const row = Math.floor(property.location.latitude / CELL);
    const col = Math.floor(property.location.longitude / CELL);
    const key = `${row}:${col}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(property);
  }

  return order.flatMap((key) => groups.get(key) ?? []);
}
