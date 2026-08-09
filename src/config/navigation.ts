import type { AppIconName } from '@/config/icons';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  title?: string;
  links: MegaMenuLink[];
}

export interface MegaMenuFeature {
  icon: AppIconName;
  title: string;
  description: string;
  href: string;
}

export interface MegaMenuDefinition {
  variant: 'columns' | 'features';
  columns?: MegaMenuColumn[];
  featureColumns?: MegaMenuFeature[][];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
  description?: string;
  megaMenu?: MegaMenuDefinition;
}

function saleLink(label: string, propertyType: 'apartment' | 'villa' | 'chalet', location: string[]) {
  return {
    label,
    href: routes.properties.byLocation('sale', propertyType, location),
  };
}

function rentLink(label: string, propertyType: 'apartment' | 'villa' | 'chalet', location: string[]) {
  return {
    label,
    href: routes.properties.byLocation('rent', propertyType, location),
  };
}

export const primaryNavigation: NavigationItem[] = [
  {
    id: 'sale',
    label: 'للبيع',
    href: routes.properties.root('sale'),
    icon: 'sale',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          links: [
            saleLink('شقق للبيع', 'apartment', ['cairo']),
            saleLink('شقق للبيع في التجمع الخامس', 'apartment', [
              'cairo',
              'new-cairo',
              'fifth-settlement',
            ]),
            saleLink('شقق للبيع في 6 أكتوبر', 'apartment', ['giza', '6th-october']),
            saleLink('شقق للبيع في الشيخ زايد', 'apartment', ['giza', 'sheikh-zayed']),
            saleLink('شقق للبيع في العاصمة الإدارية', 'apartment', [
              'cairo',
              'new-admin-capital',
            ]),
            saleLink('شقق للبيع في مدينة نصر', 'apartment', ['cairo', 'nasr-city']),
          ],
        },
        {
          links: [
            saleLink('شقق للبيع في مصر الجديدة', 'apartment', ['cairo', 'heliopolis']),
            saleLink('شقق للبيع في حدائق أكتوبر', 'apartment', [
              'giza',
              'october-gardens',
            ]),
            saleLink('شقق للبيع في الرحاب', 'apartment', ['cairo', 'rehab']),
            saleLink('شقق للبيع في الشروق', 'apartment', ['cairo', 'shorouk']),
            saleLink('شقق للبيع في المعادي', 'apartment', ['cairo', 'maadi']),
          ],
        },
        {
          links: [
            saleLink('فلل للبيع في التجمع الخامس', 'villa', [
              'cairo',
              'new-cairo',
              'fifth-settlement',
            ]),
            saleLink('فلل للبيع في 6 أكتوبر', 'villa', ['giza', '6th-october']),
            saleLink('فلل للبيع في العاصمة الإدارية', 'villa', [
              'cairo',
              'new-admin-capital',
            ]),
            saleLink('شاليهات للبيع في الساحل الشمالي', 'chalet', [
              'north-coast',
            ]),
          ],
        },
        {
          links: [
            saleLink('شقق للبيع في الساحل الشمالي', 'apartment', ['north-coast']),
          ],
        },
      ],
    },
  },
  {
    id: 'rent',
    label: 'للإيجار',
    href: routes.properties.root('rent'),
    icon: 'rent',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          links: [
            rentLink('شقق للإيجار', 'apartment', ['cairo']),
            rentLink('شقق للإيجار في القاهرة الجديدة', 'apartment', [
              'cairo',
              'new-cairo',
            ]),
            rentLink('شقق للإيجار في 6 أكتوبر', 'apartment', ['giza', '6th-october']),
            rentLink('شقق للإيجار في الشيخ زايد', 'apartment', [
              'giza',
              'sheikh-zayed',
            ]),
            rentLink('شقق للإيجار في العاصمة الإدارية', 'apartment', [
              'cairo',
              'new-admin-capital',
            ]),
            rentLink('شقق للإيجار في مدينة نصر', 'apartment', ['cairo', 'nasr-city']),
          ],
        },
        {
          links: [
            rentLink('شقق للإيجار في مصر الجديدة', 'apartment', [
              'cairo',
              'heliopolis',
            ]),
            rentLink('شقق للإيجار في الرحاب', 'apartment', ['cairo', 'rehab']),
            rentLink('شقق للإيجار في الشروق', 'apartment', ['cairo', 'shorouk']),
            rentLink('شقق للإيجار في المعادي', 'apartment', ['cairo', 'maadi']),
          ],
        },
        {
          links: [
            rentLink('فلل للإيجار في التجمع الخامس', 'villa', [
              'cairo',
              'new-cairo',
              'fifth-settlement',
            ]),
            rentLink('فلل للإيجار في الشيخ زايد', 'villa', ['giza', 'sheikh-zayed']),
            rentLink('شاليهات للإيجار في الساحل الشمالي', 'chalet', [
              'north-coast',
            ]),
          ],
        },
        {
          links: [
            rentLink('شقق للإيجار في الساحل الشمالي', 'apartment', ['north-coast']),
          ],
        },
      ],
    },
  },
  {
    id: 'compounds',
    label: 'كمبوندات',
    href: routes.compounds.root,
    icon: 'compounds',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          links: [
            { label: 'أوركيد بارك', href: routes.compounds.details('orchid-park') },
            { label: 'بالم فالي', href: routes.compounds.details('palm-valley') },
            { label: 'إيستوود ريزيدنس', href: routes.compounds.details('eastwood-residence') },
          ],
        },
        {
          links: [
            { label: 'ريفيرا هايتس', href: routes.compounds.details('rivera-heights') },
            { label: 'صن ست جاردنز', href: routes.compounds.details('sunset-gardens') },
            { label: 'كمبوندات القاهرة الجديدة', href: routes.compounds.byLocation(['cairo', 'new-cairo']) },
          ],
        },
        {
          links: [
            { label: 'كمبوندات الشيخ زايد', href: routes.compounds.byLocation(['giza', 'sheikh-zayed']) },
            { label: 'كمبوندات التجمع الخامس', href: routes.compounds.byLocation(['cairo', 'new-cairo', 'fifth-settlement']) },
            { label: 'كمبوندات مدينتي', href: routes.compounds.byLocation(['cairo', 'new-cairo', 'madinaty']) },
          ],
        },
        {
          links: [
            { label: 'كل الكمبوندات', href: routes.compounds.root },
          ],
        },
      ],
    },
  },
  {
    id: 'know',
    label: 'أعرف',
    href: routes.advice.root,
    icon: 'know',
    megaMenu: {
      variant: 'features',
      featureColumns: [
        [
          {
            icon: 'valuation',
            title: 'تقييم عقاري',
            description: 'قيم سعر أي عقار بسهولة وبسرعة',
            href: routes.valuation.root,
          },
          {
            icon: 'propertyPrices',
            title: 'أسعار العقارات',
            description: 'اعرف سعر المتر في المناطق المختلفة',
            href: routes.neighborhood.root,
          },
          {
            icon: 'askNeighborhood',
            title: 'اسأل أهل المنطقة',
            description: 'احصل على إجابات دقيقة من سكان المنطقة',
            href: routes.advice.category('ask'),
          },
          {
            icon: 'knowMore',
            title: 'أعرف أكثر',
            description: 'تصفح معلومات ونصائح قيمة وعملية',
            href: routes.advice.root,
          },
        ],
        [
          {
            icon: 'compoundReview',
            title: 'تقييم الكمبوندات',
            description: 'اكتشف تقييم الكمبوند والمطور ورأي الخبراء',
            href: routes.compounds.root,
          },
          {
            icon: 'agents',
            title: 'الوسطاء المميزون',
            description: 'تواصل مع أفضل الوسطاء العقاريين',
            href: routes.advice.category('agents'),
          },
          {
            icon: 'exhibitions',
            title: 'دليل المعارض',
            description: 'اكتشف كل المعارض العقارية القادمة',
            href: routes.advice.category('exhibitions'),
          },
        ],
        [
          {
            icon: 'propertyIndex',
            title: 'المؤشر العقاري',
            description: 'تعرف على مستوى الطلب ووضع السوق',
            href: routes.advice.category('index'),
          },
          {
            icon: 'advice',
            title: 'نصائح عقارية',
            description: 'تصفح معلومات ونصائح قيمة وعملية',
            href: routes.advice.root,
          },
          {
            icon: 'research',
            title: 'أبحاث ودراسات',
            description: 'احصل على معلومات مباشرة من المشترين',
            href: routes.advice.category('research'),
          },
        ],
      ],
    },
  },
];

export const headerActions = {
  addListing: {
    label: uiLabels.addListing,
    href: routes.addListing,
  },
  login: {
    label: uiLabels.login,
    href: routes.login,
  },
  favorites: {
    label: uiLabels.favorites,
    href: routes.favorites,
  },
  support: {
    label: 'الدعم',
    href: '/help',
  },
} as const;
