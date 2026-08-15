import { arabicMonthName, marketIndexTitle } from './config';
import { roundIndexChange } from './format';
import type { MarketIndexEntry, MarketIndexPoint } from './types';

const MONTHLY_VALUES: { year: number; month: number; value: number }[] = [
  { year: 2024, month: 10, value: 4720 },
  { year: 2024, month: 11, value: 4785 },
  { year: 2024, month: 12, value: 4810 },
  { year: 2025, month: 1, value: 4850 },
  { year: 2025, month: 2, value: 4920 },
  { year: 2025, month: 3, value: 4905 },
  { year: 2025, month: 4, value: 4980 },
  { year: 2025, month: 5, value: 5040 },
  { year: 2025, month: 6, value: 5110 },
  { year: 2025, month: 7, value: 5088 },
  { year: 2025, month: 8, value: 5165 },
  { year: 2025, month: 9, value: 5210 },
  { year: 2025, month: 10, value: 5188 },
  { year: 2025, month: 11, value: 5240 },
  { year: 2025, month: 12, value: 5275 },
  { year: 2026, month: 1, value: 5290 },
  { year: 2026, month: 2, value: 5315 },
  { year: 2026, month: 3, value: 5280 },
  { year: 2026, month: 4, value: 5305 },
  { year: 2026, month: 5, value: 5207 },
  { year: 2026, month: 6, value: 5250 },
];

const NARRATIVES: Record<
  'up' | 'down' | 'flat',
  { short: string; paragraphs: string[] }
> = {
  up: {
    short: 'سجل المؤشر ارتفاعاً خلال الفترة الحالية في هذه العينة التوضيحية.',
    paragraphs: [
      'سجل المؤشر ارتفاعاً خلال الفترة الحالية، مدفوعاً بزيادة النشاط في عدد من المناطق ذات المعروض المرتفع ضمن بيانات العرض التجريبية.',
      'يعكس هذا التحرك التوضيحي تركز الاستفسارات على الوحدات السكنية الجاهزة، مع تفاوت واضح بين المدن الجديدة والمناطق القائمة.',
      'لا يُقرأ الارتفاع كحكم على أسعار المتر في حي بعينه؛ بل كملخص لاتجاه النشاط داخل مجموعة البيانات التجريبية للمنصة.',
    ],
  },
  down: {
    short: 'شهد المؤشر تراجعاً محدوداً مقارنة بالشهر السابق في هذه العينة التوضيحية.',
    paragraphs: [
      'شهد المؤشر خلال هذا الشهر تغيراً محدوداً نحو الانخفاض مقارنة بالشهر السابق، مع تفاوت النشاط بين المناطق السكنية المختلفة في العينة التجريبية.',
      'ظهر التراجع أوضح في الشرائح متوسطة المساحة، بينما بقي الطلب على الوحدات الأصغر أكثر استقراراً داخل بيانات العرض.',
      'يُستخدم هذا التقرير لشرح طريقة قراءة التغير الشهري فقط، دون الادعاء بأنه يعكس السوق المصري الفعلي.',
    ],
  },
  flat: {
    short: 'استقر المؤشر تقريباً مقارنة بالشهر السابق في هذه العينة التوضيحية.',
    paragraphs: [
      'استقر المؤشر تقريباً خلال الفترة الحالية، مع تغيرات طفيفة لا تتجاوز نطاق التذبذب الطبيعي داخل العينة التجريبية.',
      'يشير الاستقرار إلى توازن نسبي بين المعروض الجديد والاستفسارات، من دون إشارة قوية لاتجاه صاعد أو هابط.',
    ],
  },
};

function padMonth(month: number): string {
  return String(month).padStart(2, '0');
}

function lastDayOfMonth(year: number, month: number): string {
  const date = new Date(Date.UTC(year, month, 0));
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${padMonth(month)}-${day}`;
}

function chartForIndex(endIndex: number): MarketIndexPoint[] {
  const start = Math.max(0, endIndex - 14);
  return MONTHLY_VALUES.slice(start, endIndex + 1).map((item) => ({
    label: `${arabicMonthName(item.month)} ${String(item.year).slice(2)}`,
    value: item.value,
  }));
}

function directionOf(change: number): 'up' | 'down' | 'flat' {
  if (change > 0.15) return 'up';
  if (change < -0.15) return 'down';
  return 'flat';
}

export const marketIndexDemoEntries: MarketIndexEntry[] = MONTHLY_VALUES.map(
  (item, index) => {
    const previous = MONTHLY_VALUES[index - 1]?.value ?? item.value;
    const percentageChange = roundIndexChange(item.value, previous);
    const direction = directionOf(percentageChange);
    const copy = NARRATIVES[direction];
    const title = marketIndexTitle(item.year, item.month);

    return {
      id: `mi-${item.year}-${padMonth(item.month)}`,
      slug: `${item.year}/${item.month}`,
      year: item.year,
      month: item.month,
      title,
      shortDescription: copy.short,
      content: copy.paragraphs,
      currentValue: item.value,
      previousValue: previous,
      percentageChange,
      chartPoints: chartForIndex(index),
      publishedAt: lastDayOfMonth(item.year, item.month),
      seoTitle: title,
      seoDescription: `تقرير شهري توضيحي لمؤشر العقارات في ${arabicMonthName(item.month)} ${item.year}.`,
    };
  },
);
