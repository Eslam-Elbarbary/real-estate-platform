import { siteConfig } from '@/config/site';

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat(siteConfig.locale).format(area)} م²`;
}
