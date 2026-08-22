import type { CommercialAccountRole, CreditPackage } from '@/features/credits/types';
import { routes } from '@/config/routes';
import type { PackageFaqItem, PackageTermsContent } from './faq-terms';

export const commercialRoleLabels: Record<CommercialAccountRole, string> = {
  owner: 'مالك عقار',
  marketer: 'مسوق عقاري',
  marketing_company: 'شركات التسويق',
  compound_developer: 'مطور كمبوند',
};

export interface PackageAudienceDefinition {
  role: CommercialAccountRole;
  slug: 'owner' | 'marketer' | 'marketing-company' | 'compound-developer';
  href: string;
  label: string;
  description: string;
  catalogTitle: string;
  catalogSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  /** When false, show contact CTA instead of inventing prices. */
  hasPricedCatalog: boolean;
  contactOnlyMessage?: string;
  contactCtaLabel?: string;
  contactHref?: string;
  /** Optional audience-specific FAQ override; falls back to shared defaults. */
  faqs?: PackageFaqItem[];
  /** Optional audience-specific terms override; falls back to shared defaults. */
  terms?: PackageTermsContent;
  promo?: {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    showAppBadges?: boolean;
    href?: string;
  };
  successStories?: {
    title: string;
    imageSrc: string;
    imageAlt: string;
    href?: string;
  };
}

export const packageAudiences: PackageAudienceDefinition[] = [
  {
    role: 'owner',
    slug: 'owner',
    href: routes.packages.owner,
    label: commercialRoleLabels.owner,
    description: 'للإعلان عن وحدتك السكنية والوصول إلى مشترين ومستأجرين جادين.',
    catalogTitle: 'باقات مالك عقار أساسية',
    catalogSubtitle: 'اختر الباقة التي تناسب ميزانيتك، واحصل على نتائج فورية',
    heroTitle: 'ستصل لعملاء أكثر مع عقارات مصر',
    heroDescription:
      'أعلن عن عقاراتك ليشاهدها آلاف العملاء المحتملين من زوار موقعنا',
    hasPricedCatalog: true,
    promo: {
      title: 'المؤشر العقاري',
      description: 'تابع حركة السوق والأسعار من تطبيق عقارات مصر.',
      imageSrc: '/assets/home/know/ai-phone.webp',
      imageAlt: 'تطبيق عقارات مصر على الهاتف',
      showAppBadges: true,
    },
  },
  {
    role: 'marketer',
    slug: 'marketer',
    href: routes.packages.marketer,
    label: commercialRoleLabels.marketer,
    description: 'باقات مصممة للمسوقين العقاريين لزيادة ظهور الإعلانات.',
    catalogTitle: 'باقات مسوق عقاري أساسية',
    catalogSubtitle: 'اختر الباقة التي تناسب ميزانيتك، واحصل على نتائج فورية',
    heroTitle: 'ستصل لعملاء أكثر مع عقارات مصر',
    heroDescription:
      'أعلن عن عقاراتك ليشاهدها آلاف العملاء المحتملين من زوار موقعنا',
    hasPricedCatalog: true,
    promo: {
      title: 'نصائح عقارية',
      description: 'تصفح معلومات ونصائح قيمة وعملية من خلال عقارات مصر.',
      imageSrc: '/assets/home/app/phones.webp',
      imageAlt: 'تطبيق النصائح العقارية',
      showAppBadges: true,
    },
  },
  {
    role: 'marketing_company',
    slug: 'marketing-company',
    href: routes.packages.marketingCompany,
    label: commercialRoleLabels.marketing_company,
    description: 'حلول إعلانية لشركات التسويق العقاري والفرق الكبيرة.',
    catalogTitle: 'باقات شركات التسويق أساسية',
    catalogSubtitle: 'اختر الباقة التي تناسب ميزانيتك، واحصل على نتائج فورية',
    heroTitle: 'ستصل لعملاء أكثر مع عقارات مصر',
    heroDescription:
      'أعلن عن عقاراتك ليشاهدها آلاف العملاء المحتملين من زوار موقعنا',
    hasPricedCatalog: true,
    successStories: {
      title: 'اعرف أكثر عن قصص نجاح عملاء عقارات مصر',
      imageSrc: '/assets/home/know/experts.webp',
      imageAlt: 'قصص نجاح العملاء',
    },
  },
  {
    role: 'compound_developer',
    slug: 'compound-developer',
    href: routes.packages.compoundDeveloper,
    label: commercialRoleLabels.compound_developer,
    description: 'عرض مشاريع الكمبوند للمطورين بباقات مخصصة للمشاريع.',
    catalogTitle: 'باقات مطور كمبوند',
    catalogSubtitle: 'حلول إعلانية مخصصة لمشاريع التطوير العقاري',
    heroTitle: 'ستصل لعملاء أكثر مع عقارات مصر',
    heroDescription:
      'أعلن عن مشاريعك ليشاهدها آلاف العملاء المحتملين من زوار موقعنا',
    hasPricedCatalog: false,
    contactOnlyMessage: 'تواصل معنا لمعرفة الباقة المناسبة لمشروعك',
    contactCtaLabel: 'تواصل معنا',
    contactHref: '/help',
  },
];

export const packageRolePickerCopy = {
  pageTitle: 'قم ببيع أو تأجير عقاراتك أسرع مع عقارات مصر',
  pageSubtitle:
    'اختر نوع حسابك لعرض الباقات المناسبة لاحتياجك الإعلاني.',
  sectionTitle: 'اخترنا من أنت',
  sectionSubtitle:
    'جهّزنا باقات مختلفة حسب نوع حسابك — مالك، مسوق، شركة تسويق، أو مطور كمبوند.',
} as const;

export const packagePageCopy = {
  subscribe: 'اشترك الآن',
  faq: 'الأسئلة الشائعة',
  terms: 'الأحكام والشروط',
  confirmTitle: 'تأكيد اختيار الباقة',
  confirmContinue: 'متابعة',
  confirmSuccess: 'تم اختيار الباقة التجريبية',
  confirmClose: 'إغلاق',
  priceSuffix: 'جنيه',
  pointsUnit: 'نقطة',
} as const;

/** Catalog extracted from reference screenshots — deterministic, no invention beyond readable values. */
export const creditPackagesByAudience: Record<
  CommercialAccountRole,
  CreditPackage[]
> = {
  owner: [
    {
      id: 'owner-basic-750',
      audience: 'owner',
      priceEgp: 750,
      points: 10,
      badge: 'لا تُستخدم لتمييز الإعلان',
      features: [
        { key: 'points', label: 'عدد النقاط', value: '10 نقطة', included: true },
        { key: 'regular-ad', label: 'إعلان عقاري عادي', included: true },
        { key: 'more-views', label: 'مشاهدات أكثر', included: true },
        {
          key: 'sale-validity',
          label: 'صلاحية إعلان البيع 6 أشهر',
          included: false,
        },
        {
          key: 'rent-validity',
          label: 'صلاحية إعلان الإيجار 6 أشهر',
          included: false,
        },
      ],
    },
    {
      id: 'owner-standard-3100',
      audience: 'owner',
      priceEgp: 3100,
      points: 250,
      features: [
        { key: 'points', label: 'عدد النقاط', value: '250 نقطة', included: true },
        { key: 'more-views', label: 'مشاهدات أكثر', included: true },
        {
          key: 'sales-opportunity',
          label: 'فرص بيع أكبر',
          included: true,
        },
        {
          key: 'sale-validity',
          label: 'صلاحية إعلان البيع 6 أشهر',
          included: true,
        },
        {
          key: 'rent-validity',
          label: 'صلاحية إعلان الإيجار 6 أشهر',
          included: true,
        },
      ],
    },
    {
      id: 'owner-featured-10100',
      audience: 'owner',
      priceEgp: 10100,
      points: 810,
      highlighted: true,
      badge: 'مفضلة',
      features: [
        { key: 'points', label: 'عدد النقاط', value: '810 نقطة', included: true },
        {
          key: 'search-priority',
          label: 'أعلى أولوية في نتائج البحث',
          included: true,
        },
        {
          key: 'views-20x',
          label: 'مشاهدات أعلى بـ 20 مرة من الإعلان العادي',
          included: true,
        },
        { key: 'offline-banner', label: 'بانر أوفلاين', included: true },
        {
          key: 'social-story',
          label: 'ستوري فيسبوك وإنستجرام',
          included: true,
        },
        {
          key: 'sale-validity',
          label: 'صلاحية إعلان البيع 6 أشهر',
          included: true,
        },
        {
          key: 'rent-validity',
          label: 'صلاحية إعلان الإيجار 6 أشهر',
          included: true,
        },
      ],
    },
  ],
  marketer: [
    {
      id: 'marketer-40000',
      audience: 'marketer',
      priceEgp: 40000,
      points: 5000,
      activationFeeEgp: 5000,
      features: [
        {
          key: 'points',
          label: 'عدد النقاط',
          value: '5,000 نقطة / شهر',
          included: true,
        },
        {
          key: 'featured-ads',
          label: 'إعلانات مميزة',
          value: '125',
          included: true,
        },
        {
          key: 'free-posts',
          label: 'بوستات مجانية',
          value: '20 / الأسبوع',
          included: true,
        },
        {
          key: 'validity',
          label: 'صلاحية النقاط',
          value: '30 يوم',
          included: true,
        },
        {
          key: 'activation-fee',
          label: 'رسوم التفعيل',
          value: '5000 جنيه',
          included: false,
        },
        { key: 'live', label: 'عقارات مصر لايف', included: true },
        { key: 'logo', label: 'شعار الشركة', included: true },
      ],
    },
  ],
  marketing_company: [
    {
      id: 'marketing-company-60000',
      audience: 'marketing_company',
      priceEgp: 60000,
      points: 7500,
      activationFeeEgp: 5000,
      features: [
        {
          key: 'points',
          label: 'عدد النقاط',
          value: '7,500 نقطة / شهر',
          included: true,
        },
        {
          key: 'featured-ads',
          label: 'إعلانات مميزة',
          value: '188',
          included: true,
        },
        {
          key: 'free-posts',
          label: 'بوستات مجانية',
          value: '20 / الأسبوع',
          included: true,
        },
        {
          key: 'validity',
          label: 'صلاحية النقاط',
          value: '30 يوم',
          included: true,
        },
        {
          key: 'search-priority',
          label: 'أعلى أولوية للظهور بنتائج البحث',
          included: true,
        },
        {
          key: 'activation-fee',
          label: 'رسوم التفعيل',
          value: '5000 جنيه',
          included: false,
        },
        { key: 'live', label: 'عقارات مصر لايف', included: true },
        { key: 'logo', label: 'شعار الشركة', included: true },
      ],
    },
    {
      id: 'marketing-company-80000',
      audience: 'marketing_company',
      priceEgp: 80000,
      points: 11250,
      activationFeeEgp: 5000,
      features: [
        {
          key: 'points',
          label: 'عدد النقاط',
          value: '11,250 نقطة / شهر',
          included: true,
        },
        {
          key: 'featured-ads',
          label: 'إعلانات مميزة',
          value: '281',
          included: true,
        },
        {
          key: 'free-posts',
          label: 'بوستات مجانية',
          value: '20 / الأسبوع',
          included: true,
        },
        {
          key: 'validity',
          label: 'صلاحية النقاط',
          value: '30 يوم',
          included: true,
        },
        {
          key: 'search-priority',
          label: 'أعلى أولوية للظهور بنتائج البحث',
          included: true,
        },
        {
          key: 'activation-fee',
          label: 'رسوم التفعيل',
          value: '5000 جنيه',
          included: false,
        },
        { key: 'live', label: 'عقارات مصر لايف', included: true },
        { key: 'logo', label: 'شعار الشركة', included: true },
      ],
    },
  ],
  /** No priced plans in reference screenshots — intentionally empty. */
  compound_developer: [],
};

export function getAudienceBySlug(slug: string): PackageAudienceDefinition | null {
  return packageAudiences.find((item) => item.slug === slug) ?? null;
}

export function getPackagesForAudience(
  role: CommercialAccountRole,
): CreditPackage[] {
  return creditPackagesByAudience[role];
}
