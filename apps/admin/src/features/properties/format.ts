import type { PublicNamedRef, PublicTypeRef } from './types';

export function formatTypeLabel(ref: PublicTypeRef | PublicNamedRef | null): string {
  if (!ref) {
    return '—';
  }
  return ref.nameAr ?? ref.nameEn;
}

export function formatPrice(price: number | null, currency: string): string {
  if (price == null) {
    return '—';
  }

  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatNumber(value: number | null | undefined, suffix = ''): string {
  if (value == null) {
    return '—';
  }
  return `${value.toLocaleString('ar-EG')}${suffix}`;
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value == null) {
    return '—';
  }
  return value ? 'نعم' : 'لا';
}
