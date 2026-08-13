import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    id: 'properties',
    title: 'العقارات',
    links: [
      { label: 'عقارات للبيع', href: routes.properties.root('sale') },
      { label: 'عقارات للإيجار', href: routes.properties.root('rent') },
      { label: 'شقق للبيع', href: routes.properties.byType('sale', 'apartment') },
      { label: 'فيلات للبيع', href: routes.properties.byType('sale', 'villa') },
      { label: 'أضف عقارك', href: routes.addListing },
    ],
  },
  {
    id: 'areas',
    title: 'المناطق',
    links: [
      {
        label: 'القاهرة الجديدة',
        href: routes.properties.byLocation('sale', 'apartment', [
          'cairo',
          'new-cairo',
        ]),
      },
      {
        label: 'التجمع الخامس',
        href: routes.properties.byLocation('sale', 'apartment', [
          'cairo',
          'new-cairo',
          'fifth-settlement',
        ]),
      },
      {
        label: 'الشيخ زايد',
        href: routes.properties.byLocation('sale', 'villa', ['giza', 'sheikh-zayed']),
      },
      { label: 'الكمبوندات', href: routes.compounds.root },
      { label: 'دليل الأسعار', href: routes.neighborhood.root },
    ],
  },
  {
    id: 'services',
    title: 'الخدمات',
    links: [
      { label: 'البحث عن عقار', href: routes.properties.root('sale') },
      { label: 'نصائح عقارية', href: routes.advice.index.root },
      { label: 'المفضلة', href: routes.favorites },
      { label: 'تسجيل الدخول', href: routes.login },
    ],
  },
  {
    id: 'about',
    title: 'عن المنصة',
    links: [
      { label: `عن ${siteConfig.shortName}`, href: '/about' },
      { label: 'تواصل معنا', href: '/contact' },
      { label: 'الشروط والأحكام', href: '/terms' },
      { label: 'سياسة الخصوصية', href: '/privacy' },
    ],
  },
  {
    id: 'help',
    title: 'المساعدة',
    links: [
      { label: 'مركز المساعدة', href: '/help' },
      { label: 'الأسئلة الشائعة', href: '/faq' },
      { label: 'أبلغ عن مشكلة', href: '/report' },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'ملفات تعريف الارتباط', href: '/cookies' },
];
