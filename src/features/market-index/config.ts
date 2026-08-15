export const MARKET_INDEX_PAGE_SIZE = 8;

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
] as const;

export const marketIndexCopy = {
  pageTitle: 'المؤشر العقاري في مصر',
  heading: 'المؤشر العقاري',
  intro:
    'تابع حركة السوق العقاري وتغيرات النشاط والأسعار من خلال مؤشر دوري يساعدك على فهم اتجاه السوق بصورة أوضح.',
  badge: 'تحديث شهري',
  readFull: 'عرض التقرير الكامل',
  publishedLabel: 'تاريخ النشر',
  archiveHeading: 'الأرشيف',
  aboutHeading: 'ما هو المؤشر العقاري؟',
  aboutBody: [
    'المؤشر العقاري مقياس دوري مبني على بيانات المنصة المتاحة، ويهدف إلى تلخيص اتجاه النشاط السكني عبر الزمن دون أن يحل محل أسعار المتر حسب المنطقة.',
    'القيم المعروضة هنا توضيحية لأغراض العرض، وليست بديلاً عن دليل أسعار الأحياء أو تقييم عقار محدد.',
  ],
  howToHeading: 'كيف نقرأ المؤشر؟',
  howToItems: [
    { title: 'ارتفاع القيمة', text: 'يشير إلى زيادة النشاط أو الضغط السعري خلال الفترة مقارنة بالشهر السابق.' },
    { title: 'انخفاض القيمة', text: 'يشير إلى تراجع نسبي في الزخم مقارنة بالشهر السابق دون أن يعني انهياراً في الأسعار.' },
    { title: 'التغير الشهري', text: 'نسبة الفرق بين قيمة المؤشر الحالية وقيمته في الشهر السابق.' },
  ],
  relatedHeading: 'روابط ذات صلة',
  disclaimer:
    'بيانات المؤشر المعروضة حالياً بيانات تجريبية لأغراض العرض وسيتم ربطها بمصدر البيانات الفعلي لاحقاً.',
  emptyTitle: 'لا توجد تقارير في هذه الفترة',
  emptyDescription: 'جرّب سنة أخرى أو عد إلى صفحة المؤشر كاملة.',
  backToIndex: 'العودة إلى المؤشر العقاري',
  previousMonth: 'الشهر السابق',
  nextMonth: 'الشهر التالي',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbKnow: 'اعرف أكثر',
  breadcrumbIndex: 'المؤشر العقاري',
  seoTitle: 'المؤشر العقاري في مصر',
  seoDescription:
    'تابع تطور المؤشر العقاري وحركة السوق عبر تقارير شهرية مبسطة.',
  paginationLabel: 'ترقيم صفحات المؤشر العقاري',
} as const;

export function arabicMonthName(month: number): string {
  return ARABIC_MONTHS[month - 1] ?? String(month);
}

export function marketIndexTitle(year: number, month: number): string {
  return `مؤشر عقارات مصر — ${arabicMonthName(month)} ${year}`;
}
