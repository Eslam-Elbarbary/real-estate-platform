import { routes } from '@/config/routes';

export interface KnowItem {
  id: string;
  title: string;
  description: string;
  /** Omit while the destination feature is not implemented yet. */
  href?: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: 'start' | 'end';
}

export const knowItems: KnowItem[] = [
  {
    id: 'neighborhoods',
    title: 'تعرّف على الأحياء',
    description: 'استكشف خصائص المناطق والخدمات المحيطة قبل اتخاذ قرارك.',
    href: routes.neighborhood.root,
    imageSrc: '/assets/home/know/neighborhoods.svg',
    imageAlt: 'رسم توضيحي للأحياء',
    imageSide: 'end',
  },
  {
    id: 'prices',
    title: 'أسعار العقارات',
    description: 'اعرف سعر المتر في المناطق المختلفة',
    href: routes.neighborhood.root,
    imageSrc: '/assets/home/know/prices.svg',
    imageAlt: 'رسم توضيحي لأسعار العقارات',
    imageSide: 'end',
  },
  {
    id: 'market-index',
    title: 'المؤشر العقاري',
    description: 'تابع حركة السوق عبر الزمن من خلال مؤشر شهري توضيحي.',
    href: routes.marketIndex.root,
    imageSrc: '/assets/home/know/prices.svg',
    imageAlt: 'رسم توضيحي للمؤشر العقاري',
    imageSide: 'end',
  },
  {
    id: 'experts',
    title: 'خبراء المناطق',
    description: 'نصائح عملية من متخصصين يعرفون السوق المحلي جيدًا.',
    href: routes.advice.ask.root,
    imageSrc: '/assets/home/know/experts.svg',
    imageAlt: 'رسم توضيحي لخبراء المناطق',
    imageSide: 'end',
  },
  {
    id: 'compounds',
    title: 'دليل الكمبوندات',
    description: 'قارن المشروعات السكنية من حيث الموقع والخدمات والأسعار.',
    href: routes.compounds.root,
    imageSrc: '/assets/home/know/compounds.svg',
    imageAlt: 'رسم توضيحي للكمبوندات',
    imageSide: 'end',
  },
  {
    id: 'guides',
    title: 'أدلة الشراء والإيجار',
    description: 'خطوات واضحة تساعدك على إتمام صفقتك بثقة أكبر.',
    href: routes.advice.index.root,
    imageSrc: '/assets/home/know/guides.svg',
    imageAlt: 'رسم توضيحي لأدلة الشراء',
    imageSide: 'end',
  },
];
