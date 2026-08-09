import { routes } from '@/config/routes';

export interface KnowItem {
  id: string;
  title: string;
  description: string;
  href: string;
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
    title: 'اتجاهات الأسعار',
    description: 'تابع متوسطات الأسعار وتغيّرها عبر أهم المدن والمناطق.',
    href: routes.neighborhood.root,
    imageSrc: '/assets/home/know/prices.svg',
    imageAlt: 'رسم توضيحي لأسعار العقارات',
    imageSide: 'end',
  },
  {
    id: 'experts',
    title: 'خبراء المناطق',
    description: 'نصائح عملية من متخصصين يعرفون السوق المحلي جيدًا.',
    href: routes.advice.root,
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
    href: routes.advice.root,
    imageSrc: '/assets/home/know/guides.svg',
    imageAlt: 'رسم توضيحي لأدلة الشراء',
    imageSide: 'end',
  },
  {
    id: 'faq',
    title: 'أسئلة شائعة',
    description: 'إجابات سريعة عن البحث والإعلان والتمويل العقاري.',
    href: '/faq',
    imageSrc: '/assets/home/know/faq.svg',
    imageAlt: 'رسم توضيحي للأسئلة الشائعة',
    imageSide: 'end',
  },
];
