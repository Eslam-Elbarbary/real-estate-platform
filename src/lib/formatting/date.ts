import { siteConfig } from '@/config/site';

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;

  return new Intl.DateTimeFormat(siteConfig.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
