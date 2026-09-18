import { env } from './env';

/**
 * Admin shell fallbacks (dashboard chrome / login).
 * Marketplace public branding is managed via Platform Settings APIs.
 */
export const siteConfig = {
  /** Full product / marketplace name shown in chrome and login */
  productName: 'عقارات مصر',
  /** Compact name for tight UI spaces */
  shortName: 'عقارات مصر',
  /** Dashboard product label (browser title default) */
  name: 'لوحة التحكم',
  nameEn: 'Admin Dashboard',
  /** Lettermark used when no image logo is configured */
  logo: {
    letter: 'ع',
    alt: 'عقارات مصر',
  },
  description:
    'لوحة تحكم إدارة منصة العقارات — مستخدمون، عقارات، خطط، ومدفوعات.',
  locale: 'ar-EG',
  language: 'ar',
  direction: 'rtl' as const,
  url: env.adminUrl,
} as const;
