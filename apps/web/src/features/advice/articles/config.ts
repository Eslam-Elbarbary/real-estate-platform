import type { AdviceArticleCategory } from './types';

export const ADVICE_ARTICLE_PAGE_SIZE = 8;

export const adviceArticleCategories: AdviceArticleCategory[] = [
  { id: 'buying', slug: 'buying', nameAr: 'شراء العقارات' },
  { id: 'renting', slug: 'renting', nameAr: 'الإيجار' },
  { id: 'finance', slug: 'finance', nameAr: 'التمويل العقاري' },
  { id: 'investing', slug: 'investing', nameAr: 'الاستثمار العقاري' },
  { id: 'neighborhood', slug: 'neighborhood', nameAr: 'اختيار المنطقة' },
  { id: 'finishing', slug: 'finishing', nameAr: 'التشطيب' },
  { id: 'compounds', slug: 'compounds', nameAr: 'الكمبوندات' },
  { id: 'coastal', slug: 'coastal', nameAr: 'العقارات الساحلية' },
  { id: 'process', slug: 'process', nameAr: 'إجراءات الشراء' },
  { id: 'compare', slug: 'compare', nameAr: 'مقارنة العقارات' },
];

export const adviceArticleCopy = {
  listingTitle: 'نصائح عقارية',
  listingIntro: 'مقالات عملية تساعدك تقرر بثقة قبل الشراء أو الإيجار.',
  categoriesHeading: 'التصنيفات',
  topicsHeading: 'الموضوعات',
  featuredHeading: 'مختارات تحريرية',
  readMore: 'اقرأ المزيد',
  publishedLabel: 'تاريخ النشر',
  relatedHeading: 'مقالات ذات صلة',
  backToIndex: 'العودة إلى النصائح العقارية',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbKnow: 'اعرف أكثر',
  breadcrumbAdvice: 'نصائح عقارية',
  emptyTitle: 'لا توجد مقالات في هذا التصنيف',
  emptyDescription: 'جرّب تصنيفاً آخر أو عد إلى قائمة النصائح كاملة.',
  demoDisclaimer: 'المحتوى المعروض تحريري تجريبي لأغراض العرض.',
  allCategories: 'كل التصنيفات',
  seoListingTitle: 'نصائح عقارية',
  seoListingDescription:
    'نصائح عملية عن شراء العقارات والإيجار والتمويل واختيار المنطقة في مصر.',
} as const;

export function getAdviceArticleCategory(
  id: string,
): AdviceArticleCategory | undefined {
  return adviceArticleCategories.find((item) => item.id === id);
}
