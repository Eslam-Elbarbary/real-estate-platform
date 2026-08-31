export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDuration(days: number): string {
  return `${days.toLocaleString('ar-EG')} يوم`;
}

export function getListingLimit(features: { listingLimit?: number }): number | null {
  return typeof features.listingLimit === 'number' ? features.listingLimit : null;
}
