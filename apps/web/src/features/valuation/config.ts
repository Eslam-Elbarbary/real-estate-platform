import type { PropertyType } from '@/types';
import { uiLabels } from '@/config/labels';
import type { ValuationFinishing, ValuationView } from './types';

export const valuationViewOptions: { value: ValuationView; label: string }[] = [
  { value: 'nile', label: 'النيل' },
  { value: 'golf', label: 'جولف' },
  { value: 'lake', label: 'بحيرة' },
  { value: 'plaza', label: 'بلازا' },
  { value: 'club', label: 'نادي' },
  { value: 'rear', label: 'خلفي' },
  { value: 'garden', label: 'حديقة' },
  { value: 'pool', label: 'حمام سباحة' },
  { value: 'sea', label: 'إطلالة بحر' },
  { value: 'corner', label: 'ناصية' },
  { value: 'side_street', label: 'شارع جانبي' },
  { value: 'main_street', label: 'شارع رئيسي' },
  { value: 'other', label: 'أخرى' },
];

export const valuationFinishingOptions: {
  value: ValuationFinishing;
  label: string;
}[] = [
  { value: 'lux', label: uiLabels.finishingLux },
  { value: 'super_lux', label: uiLabels.finishingSuperLux },
  { value: 'extra_super_lux', label: 'اكسترا سوبر لوكس' },
  { value: 'semi_finished', label: uiLabels.finishingSemi },
  { value: 'unfinished', label: uiLabels.finishingUnfinished },
];

/** Display choices mapped onto existing PropertyType domain values. */
export const valuationPropertyTypeOptions: {
  value: PropertyType;
  label: string;
}[] = [
  { value: 'apartment', label: 'شقة' },
  { value: 'studio', label: 'شقة مفروشة' },
  { value: 'villa', label: 'فيلا' },
  { value: 'chalet', label: 'شاليه' },
  { value: 'land', label: 'أرض' },
  { value: 'townhouse', label: 'مبنى' },
  { value: 'office', label: 'إداري' },
  { value: 'shop', label: 'تجاري' },
  { value: 'duplex', label: 'طبي' },
  { value: 'penthouse', label: 'عقارات أخرى' },
];

export const valuationCopy = {
  publicTitle: 'اعرف القيمة الحقيقية لعقارك مع أداة تقييم العقارات',
  aiBadge: 'مدعوم بالذكاء الاصطناعي',
  benefits: [
    'تحليل فوري لبيانات السوق العقاري',
    'نتيجة سريعة لتقدير سعر عقارك',
    'متابعة السعر التقديري ومستوى الطلب في المنطقة',
  ] as const,
  dashboardTitle: 'تقييم العقار',
  addNew: 'أضف تقييم جديد',
  tabValuations: 'التقييمات',
  tabPortfolio: 'المحفظة العقارية',
  valuationsHint:
    'اطّلع على تقييماتك السابقة وتابع متوسط سعر المتر في مناطق اهتمامك.',
  portfolioHint:
    'وحدات تملكها محفوظة هنا لمتابعة قيمتها التقديرية بمرور الوقت.',
  moreDetails: 'المزيد من التفاصيل',
  goalTitle: 'اختر هدف التقييم',
  ownedGoal: 'تقييم عقار أملكه',
  inquiryGoal: 'استعلام عن سعر عقار',
  ownedSaveHint: 'سيتم حفظ النتيجة في المحفظة العقارية',
  inquirySaveHint: 'سيتم حفظ النتيجة في التقييمات',
  locationTitle: 'موقع العقار',
  locationLabel: 'الموقع',
  detailsTitle: 'ادخل تفاصيل العقار',
  propertyTypeLabel: 'نوع العقار',
  viewLabel: 'الإطلالة',
  finishingLabel: 'نوع التشطيب',
  areaLabel: 'المساحة (بالمتر)',
  bedroomsLabel: 'عدد الغرف',
  bathroomsLabel: 'عدد الحمامات',
  purchasePriceLabel: 'سعر شراء العقار',
  purchaseDateLabel: 'تاريخ شراء العقار (الشهر والسنة)',
  currentEstimateLabel: 'سعر العقار اليوم من وجهة نظرك',
  calculateCta: 'احسب القيمة التقديرية',
  next: 'التالي',
  previous: 'السابق',
  analysisText: 'تحليل بيانات العقارات',
  reportTitle: 'تقرير التقييم',
  avgMeter: 'متوسط سعر المتر',
  confidence: 'دقة التقييم',
  relatedHeading: 'إعلانات ذات صلة بتقييمك',
  discoverMore: 'اكتشف المزيد',
  demoDisclaimer: 'تقدير تجريبي لأغراض العرض',
  marketDemoDisclaimer: 'البيانات التحليلية المعروضة تجريبية لأغراض العرض',
  saleEstimateNow: 'السعر التقريبي للبيع الآن',
  rentEstimateNow: 'السعر التقريبي للإيجار الآن',
  rentComingSoon: 'قريباً',
  addListing: 'أضف إعلان',
  portfolioAction: 'المحفظة العقارية',
  investmentReturnTitle: 'العائد الاستثماري للعقار',
  purchasePriceKpi: 'سعر الشراء',
  currentValueKpi: 'القيمة الحالية',
  roiKpi: 'نسبة العائد الاستثماري',
  marketComparisonTitle: 'مقارنة القيمة السوقية',
  marketAnalysisTitle: 'تحليلات السوق',
  priceIndexTitle: 'مؤشر الأسعار',
  priceIndexSubtitle: 'يوضح هذا المؤشر حركة سعر العقار في آخر 12 شهر.',
  annualPriceChange: 'التغير السنوي في السعر',
  sampleSizeTitle: 'حجم العينة السوقية',
  sampleSizeSubtitle: 'عدد الإعلانات التي تم تحليلها',
  demandTitle: 'مستوى طلب الشراء',
  demandSubtitle: 'هو مدى الإقبال على الشراء في المنطقة',
  sampleHigh: 'عالي',
  sampleMedium: 'متوسط',
  sampleLow: 'منخفض',
  login: 'تسجيل الدخول',
  register: 'إنشاء حساب',
} as const;
