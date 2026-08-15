import { arabicMonthName } from './config';

const valueFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const changeFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMarketIndexValue(value: number): string {
  return valueFormatter.format(value);
}

export function formatMarketIndexChange(value: number): string {
  const abs = changeFormatter.format(Math.abs(value));
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `-${abs}%`;
  return `${abs}%`;
}

export function marketIndexChangeDirection(
  value: number,
): 'up' | 'down' | 'flat' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}

export function formatMarketIndexPeriod(year: number, month: number): string {
  return `${arabicMonthName(month)} ${year}`;
}

export function roundIndexChange(current: number, previous: number): number {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}
