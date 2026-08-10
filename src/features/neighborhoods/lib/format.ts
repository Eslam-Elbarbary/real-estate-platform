import type { PropertyType } from '@/types';
import type {
  NeighborhoodAnnualChange,
  NeighborhoodRatings,
} from '../types';
import { neighborhoodCopy } from '../config';

export function formatPricePerSqm(value: number): string {
  return `${value.toLocaleString('en-US')} ${neighborhoodCopy.currency}`;
}

export function formatRatingScore(value: number): string {
  const clamped = Math.max(0, Math.min(10, value));
  return Number.isInteger(clamped) ? String(clamped) : clamped.toFixed(1);
}

export function formatAnnualChangePercent(value: number): string {
  const abs = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `-${abs}%`;
  return `${abs}%`;
}

export function annualChangeDirection(
  value: number,
): 'up' | 'down' | 'flat' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}

export function annualChangeLabel(change: NeighborhoodAnnualChange): string {
  const direction = annualChangeDirection(change.valuePercent);
  if (direction === 'up') return neighborhoodCopy.annualIncrease;
  if (direction === 'down') return neighborhoodCopy.annualDecrease;
  return neighborhoodCopy.annualStable;
}

export function averageSalePrice(
  stats: { salePricePerSqm?: number }[],
): number | undefined {
  const values = stats
    .map((s) => s.salePricePerSqm)
    .filter((v): v is number => typeof v === 'number');
  if (!values.length) return undefined;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getPrimaryPriceType(
  stats: { propertyType: PropertyType; salePricePerSqm?: number }[],
): PropertyType | undefined {
  return (
    stats.find((s) => s.propertyType === 'apartment' && s.salePricePerSqm)
      ?.propertyType ?? stats.find((s) => s.salePricePerSqm)?.propertyType
  );
}

export function ratingEntries(
  ratings: NeighborhoodRatings,
): { key: keyof NeighborhoodRatings; value: number }[] {
  const keys: (keyof NeighborhoodRatings)[] = [
    'safety',
    'services',
    'quietness',
    'transportation',
    'shopping',
    'lifestyle',
  ];
  return keys
    .filter((key) => typeof ratings[key] === 'number')
    .map((key) => ({ key, value: ratings[key]! }));
}
