import { routes } from '@/config/routes';
import type {
  ResearchPartner,
  ResearchRequestDefinition,
  ResearchRequestType,
  ResearchService,
  ResearchVideo,
} from './types';

export const DEMO_RESEARCH_REQUEST_ID = 'REQ-RES-1001';

export const researchCopy = {
  portalTitle: 'بوابة الأبحاث والدراسات العقارية',
  portalSubtitle: 'المعرفة هي أساس القرار العقاري الأفضل',
  portalIntro:
    'نوفر تقارير ودراسات وبيانات تساعد المطورين والمستثمرين والباحثين على فهم اتجاهات السوق العقاري واتخاذ قرارات أكثر وضوحاً.',
  heroTitle: 'أبحاث ودراسات السوق العقاري',
  heroSubtitle: 'بيانات وتحليلات تساعدك على فهم السوق بصورة أعمق',
  heroCta: 'ابدأ الآن',
  heroImageAlt: 'مساحة عمل تحليلية للأبحاث العقارية',
  servicesHeading: 'خدمات الأبحاث',
  videosHeading: 'دراسات حالة',
  videoModalTitle: 'محتوى تجريبي',
  videoModalBody:
    'المحتوى المرئي التجريبي سيُضاف عند توفر المادة النهائية.',
  partnersHeading: 'شركاؤنا وعملاؤنا',
  partnersIntro:
    'نفخر بالتعاون مع جهات وشركات تعمل في مجالات التطوير والاستثمار والتسويق العقاري.',
  contactHeading: 'هل لديك استفسار أو طلب مختلف؟',
  contactCta: 'تواصل معنا',
  submit: 'إرسال الطلب',
  backToResearch: 'العودة إلى الأبحاث والدراسات',
  requiredHint: 'حقل مطلوب',
  demoDisclaimer:
    'نماذج الطلب تجريبية لأغراض العرض ولن تُرسل إلى جهة خارجية في هذه المرحلة.',
  seoTitle: 'أبحاث ودراسات السوق العقاري',
  seoDescription:
    'تقارير وبيانات ودراسات عقارية تساعد المستثمرين والمطورين على فهم السوق واتخاذ قرارات أكثر وضوحاً.',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbKnow: 'اعرف أكثر',
  breadcrumbResearch: 'أبحاث ودراسات',
} as const;

export const researchFieldLabels = {
  name: 'الاسم',
  company: 'اسم الشركة / الجهة',
  email: 'البريد الإلكتروني',
  phone: 'رقم الهاتف',
  jobTitle: 'المسمى الوظيفي',
  city: 'المدينة',
  notes: 'ملاحظات إضافية',
  usageType: 'نوع الاستخدام',
  sector: 'القطاع أو المجال الذي تهتم به',
  region: 'المنطقة الجغرافية',
  purpose: 'الغرض من التقرير',
  areas: 'المنطقة / المناطق',
  propertyKind: 'نوع العقار',
  dataKinds: 'نوع البيانات المطلوبة',
  period: 'الفترة الزمنية',
  projectName: 'اسم المشروع / الشركة',
  targetArea: 'المدينة أو المنطقة المستهدفة',
  projectKind: 'نوع المشروع',
  studyKinds: 'نوع الدراسة المطلوبة',
  needDescription: 'وصف احتياجك',
  timeline: 'المدة المتوقعة',
  inquiryType: 'نوع الاستفسار',
  message: 'الرسالة',
} as const;

export const researchServices: ResearchService[] = [
  {
    id: 'trends-report',
    title: 'تقرير اتجاهات السوق',
    description: 'تقرير دوري يوضح أبرز مؤشرات واتجاهات السوق العقاري.',
    ctaLabel: 'اطلب التقرير',
    badge: { label: 'جديد', variant: 'warning' },
  },
  {
    id: 'market-impact-report',
    title: 'تقرير أثر المتغيرات على السوق',
    description:
      'دراسة تحليلية لقياس تأثير المتغيرات الاقتصادية والسوقية على القطاع العقاري.',
    ctaLabel: 'اطلب التقرير',
  },
  {
    id: 'price-data',
    title: 'بيانات وأسعار المناطق',
    description:
      'احصل على بيانات سعرية ومؤشرات تساعدك على دراسة المناطق العقارية.',
    ctaLabel: 'اطلب البيانات',
  },
  {
    id: 'custom-study',
    title: 'دراسة مخصصة',
    description:
      'دراسة مصممة وفق احتياجات مشروعك والسوق أو المنطقة التي تستهدفها.',
    ctaLabel: 'اطلب دراسة',
    badge: { label: 'الأكثر طلباً', variant: 'success' },
  },
];

export const researchRequestDefinitions: Record<
  ResearchRequestType,
  ResearchRequestDefinition
> = {
  'trends-report': {
    type: 'trends-report',
    title: 'طلب تقرير اتجاهات السوق',
    description: 'أدخل بياناتك لنراجع الطلب ونشارك التقرير المناسب لجهة عملك.',
    successTitle: 'تم استلام طلبك بنجاح',
    successBody: 'وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.',
  },
  'market-impact-report': {
    type: 'market-impact-report',
    title: 'طلب تقرير تحليلي للسوق',
    description: 'حدّد القطاع والمنطقة والغرض لنجهّز تقريراً تحليلياً أوضح.',
    successTitle: 'تم استلام طلبك بنجاح',
    successBody: 'وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.',
  },
  'price-data': {
    type: 'price-data',
    title: 'طلب بيانات وأسعار عقارية',
    description:
      'طلب بيانات بحثية للمناطق والعقارات — منفصل عن دليل أسعار الأحياء العام.',
    successTitle: 'تم استلام طلبك بنجاح',
    successBody: 'وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.',
  },
  'custom-study': {
    type: 'custom-study',
    title: 'طلب دراسة عقارية مخصصة',
    description: 'صف احتياج مشروعك لنصمّم دراسة وفق السوق أو المنطقة المستهدفة.',
    successTitle: 'تم استلام طلبك بنجاح',
    successBody: 'وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.',
  },
  contact: {
    type: 'contact',
    title: 'تواصل مع فريق الأبحاث',
    description: 'أرسل استفسارك وسيتواصل معك الفريق عبر بيانات التواصل.',
    successTitle: 'تم استلام طلبك بنجاح',
    successBody: 'وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.',
  },
};

export const usageTypeOptions = [
  { value: 'investment', label: 'استثمار' },
  { value: 'development', label: 'تطوير عقاري' },
  { value: 'marketing', label: 'تسويق' },
  { value: 'research', label: 'بحث ودراسة' },
  { value: 'personal', label: 'استخدام شخصي' },
  { value: 'other', label: 'أخرى' },
] as const;

export const propertyKindOptions = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'office', label: 'إداري' },
  { value: 'coastal', label: 'ساحلي' },
  { value: 'land', label: 'أراضي' },
  { value: 'other', label: 'أخرى' },
] as const;

export const dataKindOptions = [
  { value: 'avg-prices', label: 'متوسط الأسعار' },
  { value: 'meter-price', label: 'سعر المتر' },
  { value: 'price-change', label: 'تغير الأسعار' },
  { value: 'supply-demand', label: 'العرض والطلب' },
  { value: 'area-compare', label: 'مقارنة مناطق' },
] as const;

export const periodOptions = [
  { value: '3m', label: 'آخر 3 أشهر' },
  { value: '6m', label: 'آخر 6 أشهر' },
  { value: '1y', label: 'آخر سنة' },
  { value: 'custom', label: 'فترة مخصصة' },
] as const;

export const projectKindOptions = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'office', label: 'إداري' },
  { value: 'mixed', label: 'متعدد الاستخدامات' },
  { value: 'coastal', label: 'ساحلي' },
  { value: 'other', label: 'أخرى' },
] as const;

export const studyKindOptions = [
  { value: 'market', label: 'دراسة سوق' },
  { value: 'competitors', label: 'دراسة منافسين' },
  { value: 'pricing', label: 'تحليل أسعار' },
  { value: 'demand', label: 'دراسة طلب' },
  { value: 'area', label: 'تحليل منطقة' },
  { value: 'feasibility', label: 'دراسة جدوى أولية' },
  { value: 'other', label: 'أخرى' },
] as const;

export const timelineOptions = [
  { value: 'urgent', label: 'عاجل' },
  { value: 'two-weeks', label: 'خلال أسبوعين' },
  { value: 'month', label: 'خلال شهر' },
  { value: 'flexible', label: 'مرن' },
] as const;

export const inquiryTypeOptions = [
  { value: 'report', label: 'تقرير' },
  { value: 'data', label: 'بيانات' },
  { value: 'study', label: 'دراسة' },
  { value: 'other', label: 'أخرى' },
] as const;

export const researchVideos: ResearchVideo[] = [
  {
    id: 'case-project-performance',
    title: 'دراسة حالة: تحليل أداء مشروع عقاري',
    posterSrc: '/assets/valuation/analysis.webp',
    posterAlt: 'ملصق تجريبي لتحليل أداء مشروع عقاري',
  },
  {
    id: 'case-market-trends',
    title: 'دراسة حالة: كيف نقرأ اتجاهات السوق؟',
    posterSrc: '/assets/marketing-services/video-poster.webp',
    posterAlt: 'ملصق تجريبي لقراءة اتجاهات السوق',
  },
];

export const researchPartners: ResearchPartner[] = [
  { id: 'masar', name: 'مسار للتطوير', mark: 'مسار' },
  { id: 'roya', name: 'رؤية العقارية', mark: 'رؤية' },
  { id: 'madar', name: 'مدار', mark: 'مدار' },
  { id: 'ofoq', name: 'أفق', mark: 'أفق' },
  { id: 'nawah', name: 'نواة', mark: 'نواة' },
  { id: 'bunyan', name: 'بُنيان', mark: 'بُنيان' },
  { id: 'rakaiz', name: 'ركائز', mark: 'ركائز' },
  { id: 'maqam', name: 'مقام', mark: 'مقام' },
  { id: 'ittijah', name: 'اتجاه', mark: 'اتجاه' },
  { id: 'manara', name: 'منارة', mark: 'منارة' },
  { id: 'wasat', name: 'وسط', mark: 'وسط' },
];

export function researchRequestHref(type: ResearchRequestType): string {
  return routes.advice.research.request(type);
}
