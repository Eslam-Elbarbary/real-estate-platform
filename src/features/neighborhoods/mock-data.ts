import { routes } from '@/config/routes';
import { getPropertyTypeLabel } from '@/config/property-types';
import type { PropertyType, TransactionType } from '@/types';
import type {
  Neighborhood,
  NeighborhoodBroker,
  NeighborhoodFaqItem,
  NeighborhoodPropertyLink,
  NeighborhoodPropertyPrice,
  NeighborhoodRatings,
} from './types';

const asset = (name: string) => `/assets/neighborhoods/${name}.webp`;

function crumb(...items: { label: string; href: string }[]) {
  return [
    { label: 'عقارات مصر', href: routes.home },
    { label: 'أسعار العقارات', href: routes.neighborhood.root },
    ...items,
  ];
}

function price(
  propertyType: PropertyType,
  sale: number,
  rent?: number,
  yearlyChangePercent?: number,
): NeighborhoodPropertyPrice {
  return {
    propertyType,
    salePricePerSqm: sale,
    rentPricePerSqm: rent,
    yearlyChangePercent,
  };
}

function ratings(partial: NeighborhoodRatings): NeighborhoodRatings {
  return partial;
}

function brokers(prefix: string): NeighborhoodBroker[] {
  return [
    {
      id: `${prefix}-b1`,
      name: 'مكتب النيل العقاري',
      logo: '/assets/developers/nile-horizon.svg',
      listingCount: 1840,
      verified: true,
    },
    {
      id: `${prefix}-b2`,
      name: 'دار الواحة للعقارات',
      logo: '/assets/developers/oasis-homes.svg',
      listingCount: 1265,
      verified: true,
    },
    {
      id: `${prefix}-b3`,
      name: 'أفق الساحل للتسويق',
      logo: '/assets/developers/coastal-vista.svg',
      listingCount: 980,
      verified: true,
    },
  ];
}

function faqs(name: string): NeighborhoodFaqItem[] {
  return [
    {
      id: `${name}-faq-1`,
      question: `ما متوسط سعر المتر في ${name}؟`,
      answer: `متوسط سعر المتر يختلف حسب نوع العقار وموقع الوحدة داخل ${name}. راجع بطاقات الأسعار أعلاه كمرجع تجريبي، ثم قارن الإعلانات الفعلية في نتائج البحث.`,
    },
    {
      id: `${name}-faq-2`,
      question: `هل ${name} مناسبة للسكن على مدار العام؟`,
      answer: `يعتمد ذلك على نمط حياتك وطبيعة المنطقة. بعض الأحياء أكثر هدوءاً وخدمات يومية، بينما أخرى أقرب للطابع السياحي أو الاستثماري.`,
    },
    {
      id: `${name}-faq-3`,
      question: `كيف أقارن الأسعار بين الأحياء المجاورة؟`,
      answer:
        'استخدم دليل أسعار العقارات للتنقل بين المناطق، ثم افتح نتائج البحث لكل منطقة لمقارنة المعروض الحالي والمواصفات.',
    },
    {
      id: `${name}-faq-4`,
      question: `هل البيانات المعروضة أسعار سوق حية؟`,
      answer:
        'لا. الأرقام المعروضة في هذا العرض التجريبي لأغراض توضيح الواجهة فقط، ولا تمثل بيانات سوق لحظية.',
    },
  ];
}

function propertyLinks(
  name: string,
  locationSlugs: string[],
  transaction: TransactionType,
  types: PropertyType[],
  baseCount: number,
): NeighborhoodPropertyLink[] {
  return types.map((propertyType, index) => ({
    label: `${getPropertyTypeLabel(propertyType)} ${transaction === 'sale' ? 'للبيع' : 'للإيجار'} في ${name}`,
    transaction,
    propertyType,
    href: routes.properties.byLocation(transaction, propertyType, locationSlugs),
    count: baseCount - index * 37,
  }));
}

function seo(name: string): { title: string; description: string } {
  return {
    title: `أسعار العقارات في ${name}`,
    description: `تعرّف على متوسط سعر المتر وتقييم الحي وخيارات العقارات في ${name} عبر دليل أسعار عقارات مصر التجريبي.`,
  };
}

/** Deterministic demo catalog — not live market data. */
export const DEMO_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'nc',
    slug: 'north-coast',
    pathSegments: ['north-coast'],
    nameAr: 'الساحل الشمالي',
    nameEn: 'North Coast',
    level: 'region',
    breadcrumb: crumb({
      label: 'الساحل الشمالي',
      href: routes.neighborhood.details('north-coast'),
    }),
    heroImage: asset('north-coast'),
    cardImage: asset('north-coast'),
    coverImage: asset('north-coast'),
    shortDescription: 'منطقة ساحلية تجمع بين المنتجعات والوحدات السكنية.',
    description:
      'الساحل الشمالي وجهة سكنية وسياحية على البحر المتوسط، وتضم تجمعات متعددة بمستويات أسعار مختلفة حسب القرب من الشاطئ والخدمات.',
    priceStats: [price('apartment', 78000, 420), price('villa', 92000, 650)],
    featuredOnDirectory: true,
    directoryOrder: 1,
    seo: seo('الساحل الشمالي'),
    relatedPropertyLinks: [
      ...propertyLinks('الساحل الشمالي', ['north-coast'], 'sale', ['apartment', 'villa', 'chalet', 'shop'], 1798),
      ...propertyLinks('الساحل الشمالي', ['north-coast'], 'rent', ['apartment', 'villa', 'chalet'], 640),
    ],
  },
  {
    id: 'nc-alamein',
    slug: 'el-alamein',
    pathSegments: ['north-coast', 'el-alamein'],
    nameAr: 'العلمين',
    nameEn: 'El Alamein',
    level: 'area',
    parentId: 'nc',
    breadcrumb: crumb(
      {
        label: 'الساحل الشمالي',
        href: routes.neighborhood.details('north-coast'),
      },
      {
        label: 'العلمين',
        href: routes.neighborhood.details('north-coast', 'el-alamein'),
      },
    ),
    heroImage: asset('el-alamein'),
    cardImage: asset('el-alamein'),
    coverImage: asset('el-alamein'),
    shortDescription: 'منطقة ساحلية تشهد نمواً سكنياً وسياحياً.',
    description:
      'العلمين تجمع بين الطابع الساحلي والمشروعات السكنية الحديثة. يساعد دليل الأسعار هنا على قراءة متوسط سعر المتر للشقق والفلل بشكل تجريبي قبل الانتقال إلى نتائج البحث الفعلية.',
    priceStats: [
      price('apartment', 75800, 380, 12.4),
      price('villa', 66950, 520, 9.8),
      price('chalet', 81200, 410),
    ],
    annualChange: {
      valuePercent: 12.4,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 8,
      safety: 9,
      services: 7,
      quietness: 8,
      transportation: 7,
      shopping: 7,
      lifestyle: 6,
    }),
    brokers: brokers('alamein'),
    faq: faqs('العلمين'),
    seo: seo('العلمين'),
    relatedPropertyLinks: [
      ...propertyLinks(
        'العلمين',
        ['north-coast', 'el-alamein'],
        'sale',
        ['apartment', 'villa', 'chalet', 'townhouse'],
        420,
      ),
      ...propertyLinks(
        'العلمين',
        ['north-coast', 'el-alamein'],
        'rent',
        ['apartment', 'villa', 'chalet'],
        180,
      ),
    ],
  },
  {
    id: 'nc-new-alamein',
    slug: 'new-alamein',
    pathSegments: ['north-coast', 'new-alamein'],
    nameAr: 'العلمين الجديدة',
    level: 'area',
    parentId: 'nc',
    breadcrumb: crumb(
      {
        label: 'الساحل الشمالي',
        href: routes.neighborhood.details('north-coast'),
      },
      {
        label: 'العلمين الجديدة',
        href: routes.neighborhood.details('north-coast', 'new-alamein'),
      },
    ),
    heroImage: asset('new-alamein'),
    cardImage: asset('new-alamein'),
    coverImage: asset('new-alamein'),
    description:
      'العلمين الجديدة مدينة ساحلية مخططة تضم مشروعات سكنية وسياحية متنوعة، مع اختلاف واضح في متوسط سعر المتر حسب نوع الوحدة والإطلالة.',
    priceStats: [
      price('apartment', 52050, 290, 8.2),
      price('villa', 61000, 440, 7.1),
    ],
    annualChange: {
      valuePercent: 8.2,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 7,
      safety: 8,
      services: 7,
      quietness: 7,
      transportation: 6,
      shopping: 6,
      lifestyle: 7,
    }),
    brokers: brokers('new-alamein'),
    faq: faqs('العلمين الجديدة'),
    seo: seo('العلمين الجديدة'),
    relatedPropertyLinks: propertyLinks(
      'العلمين الجديدة',
      ['north-coast', 'new-alamein'],
      'sale',
      ['apartment', 'villa'],
      310,
    ),
  },
  {
    id: 'nc-resorts',
    slug: 'north-coast-resorts',
    pathSegments: ['north-coast', 'north-coast-resorts'],
    nameAr: 'منتجعات الساحل الشمالي',
    level: 'area',
    parentId: 'nc',
    breadcrumb: crumb(
      {
        label: 'الساحل الشمالي',
        href: routes.neighborhood.details('north-coast'),
      },
      {
        label: 'منتجعات الساحل الشمالي',
        href: routes.neighborhood.details('north-coast', 'north-coast-resorts'),
      },
    ),
    heroImage: asset('north-coast-resorts'),
    cardImage: asset('north-coast-resorts'),
    coverImage: asset('north-coast-resorts'),
    description:
      'تجمع منتجعات الساحل الشمالي وحدات صيفية وشاليهات بمتوسطات أسعار أعلى عادةً في المواقع الأقرب للشاطئ والخدمات الترفيهية.',
    priceStats: [
      price('chalet', 115250, 780, 5.6),
      price('apartment', 98000, 610),
      price('villa', 132000, 920),
    ],
    annualChange: {
      valuePercent: 5.6,
      periodLabel: '12 شهر',
      propertyType: 'chalet',
    },
    ratings: ratings({
      overall: 8,
      safety: 8,
      services: 8,
      quietness: 6,
      transportation: 5,
      shopping: 7,
      lifestyle: 9,
    }),
    brokers: brokers('resorts'),
    faq: faqs('منتجعات الساحل الشمالي'),
    seo: seo('منتجعات الساحل الشمالي'),
    relatedPropertyLinks: propertyLinks(
      'منتجعات الساحل الشمالي',
      ['north-coast', 'north-coast-resorts'],
      'sale',
      ['chalet', 'apartment', 'villa'],
      890,
    ),
  },
  {
    id: 'alex',
    slug: 'alexandria',
    pathSegments: ['alexandria'],
    nameAr: 'الإسكندرية',
    level: 'city',
    breadcrumb: crumb({
      label: 'الإسكندرية',
      href: routes.neighborhood.details('alexandria'),
    }),
    heroImage: asset('alexandria'),
    cardImage: asset('alexandria'),
    coverImage: asset('alexandria'),
    description:
      'الإسكندرية مدينة ساحلية متنوعة الأحياء، وتختلف متوسطات سعر المتر بين المناطق السكنية المركزية والضواحي.',
    priceStats: [price('apartment', 42000, 220), price('villa', 68000, 400)],
    featuredOnDirectory: true,
    directoryOrder: 2,
    seo: seo('الإسكندرية'),
    relatedPropertyLinks: propertyLinks(
      'الإسكندرية',
      ['alexandria'],
      'sale',
      ['apartment', 'villa', 'duplex'],
      9200,
    ),
  },
  {
    id: 'alex-smouha',
    slug: 'smouha',
    pathSegments: ['alexandria', 'smouha'],
    nameAr: 'سموحة',
    level: 'district',
    parentId: 'alex',
    breadcrumb: crumb(
      {
        label: 'الإسكندرية',
        href: routes.neighborhood.details('alexandria'),
      },
      { label: 'سموحة', href: routes.neighborhood.details('alexandria', 'smouha') },
    ),
    heroImage: asset('smouha'),
    cardImage: asset('smouha'),
    coverImage: asset('smouha'),
    description:
      'سموحة حي سكني معروف بكثافته الخدمية وتنوع المعروض من الشقق والوحدات العائلية.',
    priceStats: [
      price('apartment', 38500, 210, 6.3),
      price('duplex', 45500, 250),
    ],
    annualChange: {
      valuePercent: 6.3,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 7,
      safety: 7,
      services: 8,
      quietness: 6,
      transportation: 8,
      shopping: 8,
      lifestyle: 7,
    }),
    brokers: brokers('smouha'),
    faq: faqs('سموحة'),
    seo: seo('سموحة'),
    relatedPropertyLinks: propertyLinks(
      'سموحة',
      ['alexandria', 'smouha'],
      'sale',
      ['apartment', 'duplex'],
      540,
    ),
  },
  {
    id: 'cairo',
    slug: 'greater-cairo',
    pathSegments: ['greater-cairo'],
    nameAr: 'القاهرة الكبرى',
    level: 'region',
    breadcrumb: crumb({
      label: 'القاهرة الكبرى',
      href: routes.neighborhood.details('greater-cairo'),
    }),
    heroImage: asset('greater-cairo'),
    cardImage: asset('greater-cairo'),
    coverImage: asset('greater-cairo'),
    description:
      'القاهرة الكبرى تضم أحياء ومدناً جديدة متعددة، مع فروقات واسعة في متوسط سعر المتر حسب الكثافة والخدمات.',
    priceStats: [price('apartment', 51000, 260), price('villa', 78000, 480)],
    featuredOnDirectory: true,
    directoryOrder: 3,
    seo: seo('القاهرة الكبرى'),
    relatedPropertyLinks: propertyLinks(
      'القاهرة الكبرى',
      ['cairo'],
      'sale',
      ['apartment', 'villa', 'townhouse'],
      154001,
    ),
  },
  {
    id: 'cairo-new',
    slug: 'new-cairo',
    pathSegments: ['greater-cairo', 'new-cairo'],
    nameAr: 'القاهرة الجديدة',
    level: 'city',
    parentId: 'cairo',
    breadcrumb: crumb(
      {
        label: 'القاهرة الكبرى',
        href: routes.neighborhood.details('greater-cairo'),
      },
      {
        label: 'القاهرة الجديدة',
        href: routes.neighborhood.details('greater-cairo', 'new-cairo'),
      },
    ),
    heroImage: asset('new-cairo'),
    cardImage: asset('new-cairo'),
    coverImage: asset('new-cairo'),
    description:
      'القاهرة الجديدة من أبرز الوجهات السكنية شرق القاهرة، وتتنوع فيها متوسطات الأسعار بين التجمعات السكنية المختلفة.',
    priceStats: [
      price('apartment', 54500, 280, 7.5),
      price('villa', 82000, 510),
      price('townhouse', 71000, 430),
    ],
    annualChange: {
      valuePercent: 7.5,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 8,
      safety: 8,
      services: 8,
      quietness: 7,
      transportation: 7,
      shopping: 8,
      lifestyle: 8,
    }),
    brokers: brokers('new-cairo'),
    faq: faqs('القاهرة الجديدة'),
    seo: seo('القاهرة الجديدة'),
    relatedPropertyLinks: propertyLinks(
      'القاهرة الجديدة',
      ['cairo', 'new-cairo'],
      'sale',
      ['apartment', 'villa', 'townhouse'],
      12800,
    ),
  },
  {
    id: 'cairo-nasr',
    slug: 'nasr-city',
    pathSegments: ['greater-cairo', 'nasr-city'],
    nameAr: 'مدينة نصر',
    level: 'district',
    parentId: 'cairo',
    breadcrumb: crumb(
      {
        label: 'القاهرة الكبرى',
        href: routes.neighborhood.details('greater-cairo'),
      },
      {
        label: 'مدينة نصر',
        href: routes.neighborhood.details('greater-cairo', 'nasr-city'),
      },
    ),
    heroImage: asset('nasr-city'),
    cardImage: asset('nasr-city'),
    coverImage: asset('nasr-city'),
    description:
      'مدينة نصر حي مركزي بكثافة سكانية وخدمية مرتفعة، ويغلب عليه عرض الشقق السكنية.',
    priceStats: [price('apartment', 46800, 240, 4.2), price('office', 39000)],
    annualChange: {
      valuePercent: 4.2,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 7,
      safety: 7,
      services: 9,
      quietness: 5,
      transportation: 9,
      shopping: 9,
      lifestyle: 7,
    }),
    brokers: brokers('nasr'),
    faq: faqs('مدينة نصر'),
    seo: seo('مدينة نصر'),
    relatedPropertyLinks: propertyLinks(
      'مدينة نصر',
      ['cairo', 'nasr-city'],
      'sale',
      ['apartment', 'office'],
      6400,
    ),
  },
  {
    id: 'cairo-maadi',
    slug: 'maadi',
    pathSegments: ['greater-cairo', 'maadi'],
    nameAr: 'المعادي',
    level: 'district',
    parentId: 'cairo',
    breadcrumb: crumb(
      {
        label: 'القاهرة الكبرى',
        href: routes.neighborhood.details('greater-cairo'),
      },
      { label: 'المعادي', href: routes.neighborhood.details('greater-cairo', 'maadi') },
    ),
    heroImage: asset('maadi'),
    cardImage: asset('maadi'),
    coverImage: asset('maadi'),
    description:
      'المعادي حي هادئ نسبياً مع مزيج من الوحدات السكنية والفيلا في بعض الأجزاء، ويُنظر إليه غالباً كخيار عائلي.',
    priceStats: [price('apartment', 50200, 270, 3.8), price('villa', 89000, 560)],
    annualChange: {
      valuePercent: 3.8,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 8,
      safety: 8,
      services: 8,
      quietness: 8,
      transportation: 7,
      shopping: 7,
      lifestyle: 8,
    }),
    brokers: brokers('maadi'),
    faq: faqs('المعادي'),
    seo: seo('المعادي'),
    relatedPropertyLinks: propertyLinks(
      'المعادي',
      ['cairo', 'maadi'],
      'sale',
      ['apartment', 'villa'],
      2100,
    ),
  },
  {
    id: 'giza-zayed',
    slug: 'sheikh-zayed',
    pathSegments: ['giza', 'sheikh-zayed'],
    nameAr: 'الشيخ زايد',
    level: 'city',
    parentId: 'giza',
    breadcrumb: crumb(
      { label: 'الجيزة', href: routes.neighborhood.details('giza') },
      {
        label: 'الشيخ زايد',
        href: routes.neighborhood.details('giza', 'sheikh-zayed'),
      },
    ),
    heroImage: asset('sheikh-zayed'),
    cardImage: asset('sheikh-zayed'),
    coverImage: asset('sheikh-zayed'),
    description:
      'الشيخ زايد من المدن الجديدة غرب القاهرة، وتتميز بتنوع المشروعات السكنية والمتوسطات السعرية حسب الكمبوند والموقع.',
    priceStats: [
      price('apartment', 56000, 300, 6.9),
      price('villa', 95000, 580),
      price('townhouse', 74000, 450),
    ],
    annualChange: {
      valuePercent: 6.9,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 8,
      safety: 9,
      services: 8,
      quietness: 7,
      transportation: 7,
      shopping: 8,
      lifestyle: 8,
    }),
    brokers: brokers('zayed'),
    faq: faqs('الشيخ زايد'),
    seo: seo('الشيخ زايد'),
    relatedPropertyLinks: propertyLinks(
      'الشيخ زايد',
      ['giza', 'sheikh-zayed'],
      'sale',
      ['apartment', 'villa', 'townhouse'],
      4300,
    ),
  },
  {
    id: 'giza',
    slug: 'giza',
    pathSegments: ['giza'],
    nameAr: 'الجيزة',
    level: 'region',
    breadcrumb: crumb({
      label: 'الجيزة',
      href: routes.neighborhood.details('giza'),
    }),
    heroImage: asset('6-october'),
    cardImage: asset('6-october'),
    coverImage: asset('6-october'),
    description: 'محافظة الجيزة تضم مدناً جديدة وأحياء حضرية بمتوسطات أسعار متنوعة.',
    priceStats: [price('apartment', 48000, 250)],
    seo: seo('الجيزة'),
    relatedPropertyLinks: propertyLinks(
      'الجيزة',
      ['giza'],
      'sale',
      ['apartment', 'villa'],
      22000,
    ),
  },
  {
    id: 'giza-october',
    slug: '6-october',
    pathSegments: ['giza', '6-october'],
    nameAr: '6 أكتوبر',
    level: 'city',
    parentId: 'giza',
    breadcrumb: crumb(
      { label: 'الجيزة', href: routes.neighborhood.details('giza') },
      {
        label: '6 أكتوبر',
        href: routes.neighborhood.details('giza', '6-october'),
      },
    ),
    heroImage: asset('6-october'),
    cardImage: asset('6-october'),
    coverImage: asset('6-october'),
    description:
      'مدينة 6 أكتوبر وجهة سكنية وصناعية غرب القاهرة، وتتنوع فيها الشقق والفلل بمستويات أسعار مختلفة.',
    priceStats: [price('apartment', 41000, 230, 5.1), price('villa', 70000, 420)],
    annualChange: {
      valuePercent: 5.1,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 7,
      safety: 7,
      services: 7,
      quietness: 6,
      transportation: 7,
      shopping: 7,
      lifestyle: 6,
    }),
    brokers: brokers('october'),
    faq: faqs('6 أكتوبر'),
    seo: seo('6 أكتوبر'),
    relatedPropertyLinks: propertyLinks(
      '6 أكتوبر',
      ['giza', '6-october'],
      'sale',
      ['apartment', 'villa'],
      5100,
    ),
  },
  {
    id: 'hurghada',
    slug: 'hurghada',
    pathSegments: ['hurghada'],
    nameAr: 'الغردقة',
    level: 'city',
    breadcrumb: crumb({
      label: 'الغردقة',
      href: routes.neighborhood.details('hurghada'),
    }),
    heroImage: asset('hurghada'),
    cardImage: asset('hurghada'),
    coverImage: asset('hurghada'),
    description: 'الغردقة وجهة ساحلية على البحر الأحمر بمعروض سياحي وسكني.',
    priceStats: [price('apartment', 36000, 300), price('chalet', 48000, 420)],
    featuredOnDirectory: true,
    directoryOrder: 4,
    seo: seo('الغردقة'),
    relatedPropertyLinks: propertyLinks(
      'الغردقة',
      ['red-sea', 'hurghada'],
      'sale',
      ['apartment', 'chalet'],
      2800,
    ),
  },
  {
    id: 'dakahlia',
    slug: 'dakahlia',
    pathSegments: ['dakahlia'],
    nameAr: 'الدقهلية',
    level: 'region',
    breadcrumb: crumb({
      label: 'الدقهلية',
      href: routes.neighborhood.details('dakahlia'),
    }),
    heroImage: asset('dakahlia'),
    cardImage: asset('dakahlia'),
    coverImage: asset('dakahlia'),
    description: 'محافظة الدقهلية وتضم المنصورة ومدناً أخرى بمتوسطات أسعار محلية.',
    priceStats: [price('apartment', 28000, 150)],
    featuredOnDirectory: true,
    directoryOrder: 5,
    seo: seo('الدقهلية'),
    relatedPropertyLinks: propertyLinks(
      'الدقهلية',
      ['dakahlia'],
      'sale',
      ['apartment'],
      4100,
    ),
  },
  {
    id: 'mansoura',
    slug: 'mansoura',
    pathSegments: ['dakahlia', 'mansoura'],
    nameAr: 'المنصورة',
    level: 'city',
    parentId: 'dakahlia',
    breadcrumb: crumb(
      { label: 'الدقهلية', href: routes.neighborhood.details('dakahlia') },
      {
        label: 'المنصورة',
        href: routes.neighborhood.details('dakahlia', 'mansoura'),
      },
    ),
    heroImage: asset('mansoura'),
    cardImage: asset('mansoura'),
    coverImage: asset('mansoura'),
    description: 'المنصورة مركز حضري في الدلتا بمعروض سكني متنوع.',
    priceStats: [price('apartment', 29500, 160, 2.4)],
    annualChange: {
      valuePercent: 2.4,
      periodLabel: '12 شهر',
      propertyType: 'apartment',
    },
    ratings: ratings({
      overall: 7,
      safety: 7,
      services: 8,
      quietness: 6,
      transportation: 8,
      shopping: 8,
      lifestyle: 7,
    }),
    brokers: brokers('mansoura'),
    faq: faqs('المنصورة'),
    seo: seo('المنصورة'),
    relatedPropertyLinks: propertyLinks(
      'المنصورة',
      ['dakahlia', 'mansoura'],
      'sale',
      ['apartment'],
      1900,
    ),
  },
  {
    id: 'ain-sokhna',
    slug: 'ain-sokhna',
    pathSegments: ['ain-sokhna'],
    nameAr: 'العين السخنة',
    level: 'region',
    breadcrumb: crumb({
      label: 'العين السخنة',
      href: routes.neighborhood.details('ain-sokhna'),
    }),
    heroImage: asset('ain-sokhna'),
    cardImage: asset('ain-sokhna'),
    coverImage: asset('ain-sokhna'),
    description: 'العين السخنة وجهة ساحلية قريبة من القاهرة بمزيج من الشاليهات والوحدات السياحية.',
    priceStats: [price('chalet', 55000, 500), price('apartment', 43000, 350)],
    featuredOnDirectory: true,
    directoryOrder: 6,
    seo: seo('العين السخنة'),
    relatedPropertyLinks: propertyLinks(
      'العين السخنة',
      ['ain-sokhna'],
      'sale',
      ['chalet', 'apartment'],
      1600,
    ),
  },
  {
    id: 'qalyubia',
    slug: 'qalyubia',
    pathSegments: ['qalyubia'],
    nameAr: 'القليوبية',
    level: 'region',
    breadcrumb: crumb({
      label: 'القليوبية',
      href: routes.neighborhood.details('qalyubia'),
    }),
    heroImage: asset('qalyubia'),
    cardImage: asset('qalyubia'),
    coverImage: asset('qalyubia'),
    description: 'محافظة القليوبية شمال القاهرة بمعروض سكني متنوع الأسعار.',
    priceStats: [price('apartment', 26000, 140)],
    featuredOnDirectory: true,
    directoryOrder: 7,
    seo: seo('القليوبية'),
    relatedPropertyLinks: propertyLinks(
      'القليوبية',
      ['qalyubia'],
      'sale',
      ['apartment'],
      3200,
    ),
  },
];

/** Fix sampleSize to be fully deterministic (no Math in price helper output variance). */
for (const n of DEMO_NEIGHBORHOODS) {
  n.priceStats = n.priceStats.map((stat, index) => ({
    ...stat,
    sampleSize: 100 + index * 25 + (stat.salePricePerSqm ?? 0) % 50,
  }));
}
