import type { AdviceCategory, AdviceQuestionView } from './types';

export const ADVICE_PAGE_SIZE = 10;

export const ADVICE_MAX_USER_QUESTIONS = 5;
export const ADVICE_MAX_USER_ANSWERS = 10;

export const adviceCategories: AdviceCategory[] = [
  { id: 'general', slug: 'general', nameAr: 'عام' },
  { id: 'living', slug: 'living', nameAr: 'السكن والمعيشة' },
  { id: 'buying', slug: 'buying', nameAr: 'شراء العقارات' },
  { id: 'renting', slug: 'renting', nameAr: 'الإيجار' },
  { id: 'services', slug: 'services', nameAr: 'الخدمات' },
  { id: 'transport', slug: 'transport', nameAr: 'المواصلات' },
];

export const adviceViewOptions: Array<{
  value: AdviceQuestionView;
  label: string;
}> = [
  { value: 'popular', label: 'الأكثر نقاشاً' },
  { value: 'unanswered', label: 'بدون إجابة' },
  { value: 'all', label: 'جميع الأسئلة' },
];

export const adviceCopy = {
  directoryTitle: 'اسأل أهل منطقة',
  directoryHeading: 'الأسئلة الأكثر نقاشاً',
  directoryIntro: 'اكتب سؤالك عن العقارات وأسعار المناطق',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbAsk: 'اسأل أهل منطقة',
  locationPlaceholder: 'الأماكن والمناطق',
  categoryPlaceholder: 'كل الأقسام',
  categorySelectPlaceholder: 'اختر القسم',
  questionPlaceholder: 'اكتب سؤالاً واحصل على إجابات من أهل المنطقة',
  submitQuestion: 'أضف سؤالاً',
  relatedProperties: 'عقارات قد تكون مهتماً بها',
  citiesSectionTitle: 'عقارات في مدن مصر',
  sale: 'للبيع',
  rent: 'للإيجار',
  answersHeading: 'الإجابات',
  addAnswerTitle: 'أضف إجابة',
  addAnswerPlaceholder: 'اكتب إجابتك بناءً على معرفتك بالمنطقة',
  submitAnswer: 'أضف إجابتك',
  questionCreated: 'تم إضافة سؤالك بنجاح',
  answerCreated: 'تمت إضافة إجابتك',
  emptyTitle: 'لا توجد أسئلة مطابقة',
  emptyDescription:
    'جرّب تغيير المنطقة أو القسم، أو اطرح سؤالاً جديداً لأهل المنطقة.',
  emptyUnanswered: 'لا توجد أسئلة بدون إجابة ضمن هذه التصفية.',
  demoDisclaimer: 'الأسئلة والإجابات المعروضة تجريبية لأغراض العرض.',
  answerCount: (n: number) => `${n.toLocaleString('en-US')} إجابة`,
  seoDirectoryTitle: 'اسأل أهل منطقة',
  seoDirectoryDescription:
    'اسأل سكان المناطق عن السكن والأسعار والخدمات قبل شراء أو إيجار عقار في مصر.',
} as const;

export function getAdviceCategory(id: string): AdviceCategory | undefined {
  return adviceCategories.find((item) => item.id === id);
}
