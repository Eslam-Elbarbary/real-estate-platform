import {
  BarChart3,
  Building2,
  ChartNoAxesCombined,
  GraduationCap,
  Handshake,
  MapPinned,
  Megaphone,
  Smartphone,
  Trophy,
} from 'lucide-react';
import { routes } from '@/config/routes';
import { commercialRoleLabels } from '@/features/packages/config/catalog';
import type { CommercialAccountRole } from '@/features/credits/types';
import type {
  MarketingPartner,
  MarketingServiceSectionConfig,
  MarketingStat,
  MarketingTestimonial,
} from './types';

export const marketingServicesCopy = {
  seoTitle: 'خدمات التسويق العقاري',
  seoDescription:
    'حلول تسويقية للمسوقين وشركات التسويق والمطورين لزيادة ظهور الإعلانات والمشروعات أمام جمهور يبحث فعليًا عن العقار.',
  heroTitle: 'خدمات شركات التسويق العقاري',
  heroSubtitle: 'اعرف أكثر.. حقق نجاح أكبر',
  heroDescription:
    'وصول لجمهور يبحث فعليًا عن العقار، مع حلول مخصصة لزيادة ظهور المشروعات والإعلانات ودعم الشركات والمطورين.',
  joinNow: 'انضم الآن',
  knowMore: 'اعرف أكثر',
  formTitle: 'تواصل معنا',
  formSubmit: 'سجل',
  formSuccess: 'تم إرسال طلبك بنجاح',
  formSuccessHint: 'هذا إرسال تجريبي للعرض فقط ولن يتم إرسال بريد حقيقي.',
  formLabels: {
    name: 'الاسم',
    phone: 'الموبايل',
    email: 'البريد الإلكتروني',
    company: 'الشركة',
    businessType: 'نوع الشركة',
    address: 'عنوان الشركة',
  },
  formPlaceholders: {
    name: 'الإسم Name',
    phone: 'الموبايل - Mobile',
    email: 'البريد الإلكتروني - Email',
    company: 'الشركة Company',
    address: 'عنوان الشركة - Address',
  },
  demoStatsNote: 'أرقام توضيحية للعرض',
  testimonialsTitle: 'شهادات شركاء التسويق العقاري',
  partnersCta: 'شاهد تجربة الشركات معنا',
  finalCtaTitle: 'ابدأ حملتك التسويقية اليوم',
  finalCtaDescription:
    'اختر الباقة المناسبة أو أرسل طلب تواصل وسنساعدك في تحديد العرض الأنسب لنشاطك.',
  finalCtaPrimary: 'اطلب عرضًا مناسبًا',
  finalCtaSecondary: 'استعرض الباقات',
  videoPlayLabel: 'تشغيل المعاينة',
  videoDemoMessage: 'معاينة تجريبية — لا يوجد فيديو مضمّن',
} as const;

export const marketingBusinessTypeOptions: Array<{
  value: CommercialAccountRole;
  label: string;
}> = [
  { value: 'owner', label: commercialRoleLabels.owner },
  { value: 'marketer', label: commercialRoleLabels.marketer },
  { value: 'marketing_company', label: commercialRoleLabels.marketing_company },
  {
    value: 'compound_developer',
    label: commercialRoleLabels.compound_developer,
  },
];

/** Deterministic fictional demo metrics — not live marketplace stats. */
export const marketingStats: MarketingStat[] = [
  { id: 'listings', value: '+300,000', label: 'عقارات', demo: true },
  { id: 'leads', value: '+200,000', label: 'عميل مهتم', demo: true },
  { id: 'agencies', value: '+7,500', label: 'شركات التسويق', demo: true },
  { id: 'visits', value: '+2,000,000', label: 'زيارة', demo: true },
  { id: 'developers', value: '+1,000', label: 'شركات التطوير', demo: true },
  { id: 'years', value: '12', label: 'سنوات', demo: true },
];

const joinHref = `#marketing-lead-form`;
const packagesHref = routes.packages.marketingCompany;

export const marketingServiceSections: MarketingServiceSectionConfig[] = [
  {
    id: 'sales-growth',
    title: 'نمو المبيعات',
    description:
      'أظهر إعلاناتك ومشروعاتك أمام جمهور يبحث فعليًا عن العقار، وزد فرص التواصل مع عملاء جادين عبر حلول ظهور مخصصة.',
    icon: Megaphone,
    imageSrc: '/assets/marketing-services/service-01.webp',
    imageAlt: 'جلسة عرض تسويقي عقاري',
    mediaKind: 'video',
    reversed: false,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: joinHref,
  },
  {
    id: 'live-tools',
    title: 'أدوات إدارة الاشتراك',
    description:
      'تابع أداء حملاتك وإعلاناتك من لوحة واحدة، مع تقارير واضحة تساعدك على تحسين الظهور وفرص التواصل مع العملاء.',
    icon: Smartphone,
    imageSrc: '/assets/marketing-services/service-02.webp',
    imageAlt: 'واجهة أدوات إدارة الاشتراك',
    mediaKind: 'video',
    reversed: true,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: joinHref,
  },
  {
    id: 'supply-demand',
    title: 'إحصائيات العرض والطلب',
    description:
      'اطّلع على مؤشرات الطلب في المناطق والأنواع العقارية لدعم قرارات التسعير والترويج لمشروعاتك وإعلاناتك.',
    icon: BarChart3,
    imageSrc: '/assets/marketing-services/service-03.webp',
    imageAlt: 'لوحة مؤشرات العرض والطلب',
    mediaKind: 'video',
    reversed: false,
    ctaLabel: marketingServicesCopy.knowMore,
    ctaHref: packagesHref,
  },
  {
    id: 'academy',
    title: 'أكاديمية التسويق العقاري',
    description:
      'محتوى تدريبي وورش عمل تساعد فرق المبيعات والتسويق على تحسين جودة الإعلانات ورفع كفاءة التواصل مع العملاء.',
    icon: GraduationCap,
    imageSrc: '/assets/marketing-services/service-04.webp',
    imageAlt: 'ورشة عمل للتسويق العقاري',
    mediaKind: 'image',
    reversed: true,
    ctaLabel: marketingServicesCopy.knowMore,
    ctaHref: joinHref,
  },
  {
    id: 'recognition',
    title: 'تكريم شركاء النجاح',
    description:
      'نبرز الشركات والمطورين الذين يحققون نتائج مميزة عبر الحملات الترويجية وتحسين ظهور المشروعات على المنصة.',
    icon: Trophy,
    imageSrc: '/assets/marketing-services/service-05.webp',
    imageAlt: 'تكريم شركاء النجاح',
    mediaKind: 'image',
    reversed: false,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: joinHref,
  },
  {
    id: 'events',
    title: 'ندوات وفعاليات',
    description:
      'لقاءات دورية حول اتجاهات السوق والحلول الإعلانية لدعم المسوقين وشركات التطوير في بناء خطط ترويج أوضح.',
    icon: Handshake,
    imageSrc: '/assets/marketing-services/service-06.webp',
    imageAlt: 'فعالية عقارية',
    mediaKind: 'video',
    reversed: true,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: joinHref,
  },
  {
    id: 'company-services',
    title: 'خدماتنا للشركات',
    description:
      'باقات وحلول موجهة لشركات التسويق والمطورين تشمل تمييز الإعلانات، الظهور في نتائج البحث، والحملات الترويجية.',
    icon: Building2,
    imageSrc: '/assets/marketing-services/service-07.webp',
    imageAlt: 'خدمات تسويقية للشركات',
    mediaKind: 'video',
    reversed: false,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: packagesHref,
  },
  {
    id: 'visibility-map',
    title: 'خريطة الظهور الإعلاني',
    description:
      'حسّن توزيع ظهور إعلاناتك ومشروعاتك عبر المناطق الأكثر طلبًا، وارفع فرص الوصول للعملاء المستهدفين.',
    icon: MapPinned,
    imageSrc: '/assets/marketing-services/service-08.webp',
    imageAlt: 'خريطة الظهور الإعلاني',
    mediaKind: 'video',
    reversed: true,
    ctaLabel: marketingServicesCopy.knowMore,
    ctaHref: joinHref,
  },
  {
    id: 'cpl',
    title: 'تكلفة الاتصالات CPL',
    description:
      'تابع مؤشرات التواصل وفعالية الحملات لقياس العائد وتحسين خطط التسويق للمسوقين والمستثمرين العقاريين.',
    icon: ChartNoAxesCombined,
    imageSrc: '/assets/marketing-services/service-09.webp',
    imageAlt: 'تحليل تكلفة الاتصالات',
    mediaKind: 'image',
    reversed: false,
    ctaLabel: marketingServicesCopy.joinNow,
    ctaHref: joinHref,
  },
];

export const marketingTestimonials: MarketingTestimonial[] = [
  {
    id: 't1',
    quote:
      'ساعدنا الظهور المميز في زيادة استفسارات العملاء الجادين على مشروعاتنا خلال أشهر قليلة.',
    name: 'سارة منصور',
    company: 'شركة أفق للتسويق',
    role: 'مديرة تسويق',
    avatarSrc: '/assets/marketing-services/avatars/a1.webp',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'تقارير الأداء واضحة، وسهّلت علينا تحسين الإعلانات ورفع فرص التواصل مع المشترين.',
    name: 'كريم عبد الله',
    company: 'مكتب النخبة العقاري',
    role: 'مسوق عقاري',
    avatarSrc: '/assets/marketing-services/avatars/a2.webp',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'الحملات الترويجية دعمت إطلاق الكمبوند الجديد ووصلت لجمهور يبحث فعليًا عن السكن.',
    name: 'نورا فريد',
    company: 'تطوير الواحة',
    role: 'مسؤولة مبيعات',
    avatarSrc: '/assets/marketing-services/avatars/a3.webp',
    rating: 5,
  },
];

export const marketingPartners: MarketingPartner[] = [
  { id: 'northstar', name: 'نورث ستار', logoSrc: '/assets/marketing-services/partners/northstar.webp' },
  { id: 'orbit', name: 'أوربت', logoSrc: '/assets/marketing-services/partners/orbit.webp' },
  { id: 'horizon', name: 'هورايزون', logoSrc: '/assets/marketing-services/partners/horizon.webp' },
  { id: 'crest', name: 'كريست', logoSrc: '/assets/marketing-services/partners/crest.webp' },
  { id: 'atlas', name: 'أطلس', logoSrc: '/assets/marketing-services/partners/atlas.webp' },
  { id: 'vertex', name: 'فيرتكس', logoSrc: '/assets/marketing-services/partners/vertex.webp' },
  { id: 'lumen', name: 'لومن', logoSrc: '/assets/marketing-services/partners/lumen.webp' },
  { id: 'prime', name: 'برايم', logoSrc: '/assets/marketing-services/partners/prime.webp' },
  { id: 'nova', name: 'نوفا', logoSrc: '/assets/marketing-services/partners/nova.webp' },
  { id: 'ridge', name: 'ريدج', logoSrc: '/assets/marketing-services/partners/ridge.webp' },
  { id: 'summit', name: 'سامت', logoSrc: '/assets/marketing-services/partners/summit.webp' },
  { id: 'harbor', name: 'هاربر', logoSrc: '/assets/marketing-services/partners/harbor.webp' },
  { id: 'cedar', name: 'سيدار', logoSrc: '/assets/marketing-services/partners/cedar.webp' },
  { id: 'folio', name: 'فوليو', logoSrc: '/assets/marketing-services/partners/folio.webp' },
  { id: 'canvas', name: 'كانفس', logoSrc: '/assets/marketing-services/partners/canvas.webp' },
  { id: 'bridge', name: 'بريدج', logoSrc: '/assets/marketing-services/partners/bridge.webp' },
  { id: 'pulse', name: 'بولس', logoSrc: '/assets/marketing-services/partners/pulse.webp' },
  { id: 'quartz', name: 'كوارتز', logoSrc: '/assets/marketing-services/partners/quartz.webp' },
];
