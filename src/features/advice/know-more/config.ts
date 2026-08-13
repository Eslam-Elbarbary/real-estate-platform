import { routes } from '@/config/routes';
import type { KnowMoreService } from './types';

export const knowMoreCopy = {
  title: 'علشان تختار عقارك صح',
  intro:
    'أدوات واضحة تساعدك تبحث وتقيّم وتعلن عن عقارك، وتتعرف على المناطق والكمبوندات قبل اتخاذ القرار.',
  servicesHeading: 'خدماتنا',
  heroVisualAlt: 'عرض توضيحي لأدوات اختيار العقار على المنصة',
  seoTitle: 'اعرف أكثر',
  seoDescription:
    'تعرّف على خدمات البحث والتقييم والإعلان ودلائل المناطق والكمبوندات والنصائح العقارية.',
} as const;

export const knowMoreServices: KnowMoreService[] = [
  {
    id: 'search',
    title: 'ابحث عن عقار',
    description:
      'تصفح آلاف الوحدات المعروضة للبيع والإيجار واختر ما يناسب ميزانيتك ومنطقتك.',
    ctaLabel: 'ابحث الآن',
    icon: 'search',
    href: routes.properties.root('sale'),
    status: 'live',
  },
  {
    id: 'valuation',
    title: 'قيّم عقارك',
    description:
      'احصل على تقدير سعري مبني على بيانات السوق لمساعدتك في قرار الشراء أو البيع.',
    ctaLabel: 'ابدأ التقييم',
    icon: 'valuation',
    href: routes.valuation.root,
    status: 'live',
  },
  {
    id: 'add-property',
    title: 'أعلن عن عقارك',
    description: 'انشر إعلانك بخطوات واضحة ليصل إلى الباحثين عن عقار في مصر.',
    ctaLabel: 'أعلن الآن',
    icon: 'addProperty',
    href: routes.addProperty.root,
    status: 'live',
  },
  {
    id: 'compounds',
    title: 'دليل الكمبوندات',
    description:
      'قارن المشروعات السكنية من حيث الموقع والخدمات والأسعار قبل الزيارة.',
    ctaLabel: 'تصفح الدليل',
    icon: 'compounds',
    href: routes.compounds.root,
    status: 'live',
  },
  {
    id: 'neighborhood',
    title: 'دليل المناطق والأسعار',
    description:
      'تعرّف على أسعار المتر وطبيعة الأحياء لتختار المنطقة الأنسب لك.',
    ctaLabel: 'شاهد الأسعار',
    icon: 'propertyPrices',
    href: routes.neighborhood.root,
    status: 'live',
  },
  {
    id: 'articles',
    title: 'نصائح عقارية',
    description: 'مقالات عملية عن الشراء والإيجار والتمويل واختيار المنطقة.',
    ctaLabel: 'اقرأ النصائح',
    icon: 'advice',
    href: routes.advice.index.root,
    status: 'live',
  },
];
