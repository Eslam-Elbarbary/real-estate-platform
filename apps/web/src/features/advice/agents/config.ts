import type { RealEstateAgentType } from './types';

export const AGENT_DIRECTORY_PAGE_SIZE = 5;
export const AGENT_PROFILE_PAGE_SIZE = 9;
export const DEFAULT_AGENT_TYPE: RealEstateAgentType = 'company';
export const DEFAULT_AGENT_LOCATION_ID = 'loc-greater-cairo';

export const agentCopy = {
  directoryTitle: 'اعثر على أفضل الوسطاء العقاريين',
  searchCta: 'ابحث',
  locationLabel: 'المنطقة',
  company: 'شركة',
  broker: 'وسيط',
  resultsCompany: 'أفضل الشركات العقارية',
  resultsBroker: 'أفضل الوسطاء العقاريين',
  resultsIn: (location: string) => `في ${location}`,
  resultsSubtitle: 'تواصل مع مجموعة من الشركات والوسطاء ذوي الخبرة في السوق المحلي.',
  partnership: (years: number) => `شريك المنصة منذ ${years} سنة`,
  memberSince: (year: number) => `عضو منذ ${year}`,
  listingCount: (n: number) => `${n.toLocaleString('en-US')} إعلان`,
  customerCount: (n: number) => `تم التعامل مع ${n.toLocaleString('en-US')} عميل`,
  serveAreas: 'يخدم المناطق التالية:',
  revealPhone: 'إظهار رقم الهاتف',
  hidePhone: 'إخفاء الرقم',
  call: 'اتصال',
  whatsapp: 'واتساب',
  emptyAgents: 'لا توجد نتائج مطابقة',
  emptyAgentsHint: 'جرّب تغيير نوع الحساب أو المنطقة.',
  emptyProperties: 'لا توجد عقارات منشورة لهذا الوسيط حالياً',
  emptyPropertiesHint: 'عد إلى دليل الوسطاء لاختيار وسيط آخر.',
  backToDirectory: 'العودة إلى دليل الوسطاء',
  profileTitle: (name: string) => `عقارات ${name}`,
  verified: 'موثّق',
  breadcrumbHome: 'عقارات مصر',
  breadcrumbKnow: 'اعرف أكثر',
  breadcrumbAgents: 'الوسطاء العقاريون',
  seoDirectoryTitle: 'أفضل الوسطاء العقاريين',
  seoDirectoryDescription:
    'اعثر على شركات ووسطاء عقاريين في مصر وتصفح إعلاناتهم للتواصل مباشرة.',
} as const;
