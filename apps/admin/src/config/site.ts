import { env } from './env';

export const siteConfig = {
  name: 'لوحة التحكم',
  nameEn: 'Admin Dashboard',
  productName: 'عقارات مصر',
  description: 'لوحة تحكم إدارة منصة العقارات — مستخدمون، عقارات، خطط، ومدفوعات.',
  locale: 'ar-EG',
  language: 'ar',
  direction: 'rtl' as const,
  url: env.adminUrl,
} as const;
