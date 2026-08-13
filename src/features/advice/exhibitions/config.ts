import type { ExhibitionCategory } from './types';

export const WEEKDAY_LABELS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
] as const;

export const exhibitionCategoryLabels: Record<ExhibitionCategory, string> = {
  real_estate_exhibition: 'معارض عقارية',
  conference: 'مؤتمر عقاري',
  investment_event: 'فعالية استثمارية',
  developer_event: 'ملتقى مطورين',
};

export const FEATURED_EXHIBITION_SLUG = 'mustaqbal-al-istithmar';

export const exhibitionCopy = {
  directoryTitle: 'دليل المعارض العقارية',
  directoryIntro:
    'تصفح المعارض والمؤتمرات والفعاليات العقارية حسب التاريخ، وتعرّف على المكان والتفاصيل قبل الحضور.',
  search: 'بحث',
  dateLabel: 'تاريخ البحث',
  noEventsOnDate: 'لا توجد أحداث في هذا التاريخ',
  noEventsInMonth: 'لا توجد معارض أو فعاليات خلال هذا الشهر',
  today: 'اليوم',
  previousMonth: 'الشهر السابق',
  nextMonth: 'الشهر التالي',
  details: 'التفاصيل',
  time: 'الزمان',
  place: 'المكان',
  category: 'التصنيف',
  relatedHeading: 'معارض وفعاليات قد تهمك',
  backToDirectory: 'العودة إلى دليل المعارض',
  copyLink: 'نسخ الرابط',
  copied: 'تم نسخ الرابط',
  share: 'شارك',
  facebook: 'فيسبوك',
  twitter: 'إكس',
  linkedin: 'لينكدإن',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbKnow: 'اعرف أكثر',
  breadcrumbExhibitions: 'دليل المعارض',
  seoDirectoryTitle: 'دليل المعارض العقارية',
  seoDirectoryDescription:
    'جدول شهري لمعارض ومؤتمرات العقار في مصر مع تفاصيل الزمان والمكان وملخص كل فعالية.',
} as const;
