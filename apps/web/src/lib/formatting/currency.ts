import { siteConfig } from '@/config/site';
import type { PricingPeriod } from '@/types';

const formatter = new Intl.NumberFormat(siteConfig.locale, {
  style: 'decimal',
  maximumFractionDigits: 0,
});

function currencySuffix(currency: string) {
  return currency === 'EGP' ? 'ج.م' : currency;
}

function periodSuffix(period?: PricingPeriod): string {
  switch (period) {
    case 'monthly':
      return '/شهر';
    case 'daily':
      return '/يوم';
    case 'yearly':
      return '/سنة';
    default:
      return '';
  }
}

export function formatCurrency(
  amount: number,
  currency: string = siteConfig.currency,
  period?: PricingPeriod,
): string {
  return `${formatter.format(amount)} ${currencySuffix(currency)}${periodSuffix(period)}`;
}

export function formatCompactCurrency(
  amount: number,
  currency: string = siteConfig.currency,
  period?: PricingPeriod,
): string {
  const compact = new Intl.NumberFormat(siteConfig.locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);

  return `${compact} ${currencySuffix(currency)}${periodSuffix(period)}`;
}
