import type { AdminPaymentOwner, PaymentProvider } from './types';

export function formatDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatOwnerName(owner: AdminPaymentOwner): string {
  return owner.name ?? owner.email;
}

export function formatProvider(provider: PaymentProvider): string {
  switch (provider) {
    case 'MOCK':
      return 'تجريبي';
    case 'PAYMOB':
      return 'Paymob';
    case 'STRIPE':
      return 'Stripe';
    default:
      return provider;
  }
}
