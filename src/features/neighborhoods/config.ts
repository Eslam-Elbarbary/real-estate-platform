export const neighborhoodCopy = {
  directoryTitle: 'أسعار العقارات في مصر',
  directoryIntro:
    'استكشف متوسط سعر المتر في أهم المناطق والمدن، وقارن الاتجاهات قبل اتخاذ قرار الشراء أو الإيجار.',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbPrices: 'أسعار العقارات',
  ratingScaleHint: 'تقييم الحي من 10',
  citiesSectionTitle: 'عقارات في مدن مصر',
  sale: 'للبيع',
  rent: 'للإيجار',
  showMore: 'أظهر المزيد',
  pricePerSqm: 'متوسط سعر المتر',
  currency: 'جنيه',
  detailsCta: 'التفاصيل',
  heroGuidePrefix: 'دليل أسعار عقارات',
  priceOverviewPrefix: 'أسعار العقارات في',
  statsPrefix: 'إحصائيات',
  annualIncrease: 'زيادة الأسعار في 12 شهر',
  annualDecrease: 'انخفاض الأسعار في 12 شهر',
  annualStable: 'استقرار الأسعار في 12 شهر',
  ratingPrefix: 'تقييم',
  aboutPrefix: 'عن',
  readMore: 'اقرأ المزيد',
  sharePrefix: 'شارك حب',
  copyLink: 'نسخ الرابط',
  copied: 'تم النسخ',
  brokersPrefix: 'أكبر المكاتب العقارية في',
  brokersShowAll: 'كل المكاتب',
  faqTitle: 'الأسئلة الأكثر شيوعاً',
  propertiesInPrefix: 'عقارات في',
  searchCta: 'أبحث عن عقار',
  valuationCta: 'أعرف سعر عقارك',
  listCta: 'أعلن عن عقارك',
  demoDisclaimer: 'الأسعار والبيانات المعروضة تجريبية لأغراض العرض.',
  listingCount: (n: number) => `${n.toLocaleString('en-US')} إعلان`,
} as const;

export const neighborhoodRatingCategories = [
  { key: 'safety', label: 'الأمان' },
  { key: 'services', label: 'الخدمات' },
  { key: 'quietness', label: 'الهدوء' },
  { key: 'transportation', label: 'المواصلات' },
  { key: 'shopping', label: 'التسوق' },
  { key: 'lifestyle', label: 'أسلوب الحياة' },
] as const;

export type NeighborhoodRatingCategoryKey =
  (typeof neighborhoodRatingCategories)[number]['key'];
