export const siteConfig = {
  name: 'عقارات مصر',
  nameEn: 'Egypt Homes',
  shortName: 'عقارات',
  description:
    'منصة عقارية عربية للبحث عن شقق وفيلات ومشاريع للبيع والإيجار في مصر.',
  locale: 'ar-EG',
  language: 'ar',
  direction: 'rtl' as const,
  currency: 'EGP' as const,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  defaultOgImage: '/og-default.png',
  contactEmail: 'hello@egypt-homes.example',
  assets: {
    hero: '/assets/home/hero/hero.webp',
    aiPhone: '/assets/home/know/ai-phone.webp',
  },
} as const;
