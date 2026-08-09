import type {
  Compound,
  CompoundContentSection,
  CompoundFaqItem,
  CompoundGalleryImage,
  CompoundRecommendation,
  Developer,
  FinishingType,
  PropertyType,
} from '@/types';

export interface MockCompoundLocation {
  governorateSlug: string;
  governorateName: string;
  citySlug: string;
  cityName: string;
  areaSlug: string;
  areaName: string;
  lat: number;
  lng: number;
}

export interface CreateMockCompoundInput {
  index: number;
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  location: MockCompoundLocation;
  developer: Developer;
  startingPrice: number;
  galleryCount?: number;
  galleryOffset?: number;
  verified?: boolean;
  priceLevel?: Compound['priceLevel'];
  constructionStatus?: Compound['constructionStatus'];
  finishingTypes?: FinishingType[];
  paymentMethods?: Compound['paymentMethods'];
  availablePropertyTypes?: PropertyType[];
  brochureUrl?: string | null;
  overrides?: Partial<Compound>;
}

const ASSET_COUNT = 28;

function galleryImages(
  slug: string,
  title: string,
  count: number,
  offset: number,
): CompoundGalleryImage[] {
  return Array.from({ length: count }, (_, index) => {
    const n = String(((offset + index) % ASSET_COUNT) + 1).padStart(2, '0');
    return {
      id: `${slug}-gal-${index + 1}`,
      src: `/assets/compounds-directory/compound-${n}.webp`,
      alt: `${title} - صورة ${index + 1}`,
      order: index + 1,
    };
  });
}

function toCompoundImages(
  gallery: CompoundGalleryImage[],
): Compound['images'] {
  return gallery.map((image, index) => ({
    id: image.id,
    url: image.src,
    alt: image.alt,
    isCover: index === 0,
    order: image.order,
  }));
}

function buildContentSections(input: {
  nameAr: string;
  nameEn: string;
  areaName: string;
  cityName: string;
  developerName: string;
  startingPrice: number;
  constructionStatus?: Compound['constructionStatus'];
}): CompoundContentSection[] {
  const statusNote =
    input.constructionStatus === 'delivered'
      ? 'المشروع في مرحلة تسليم جزئي أو كامل حسب البلوك.'
      : input.constructionStatus === 'under_construction'
        ? 'المشروع قيد الإنشاء مع جداول تسليم معلنة للوحدات.'
        : input.constructionStatus === 'ready'
          ? 'تتوفر وحدات جاهزة أو قريبة من التسليم ضمن الطرح الحالي.'
          : 'المشروع في مراحل التخطيط والطرح الأولي.';

  return [
    {
      heading: 'نبذة عن المشروع',
      paragraphs: [
        `${input.nameEn} - ${input.nameAr} مجتمع سكني في ${input.areaName} يقدّم مزيجًا من الوحدات السكنية والخدمات اليومية داخل بيئة منظمة.`,
        `صُمم المشروع للعائلات الباحثة عن توازن بين الخصوصية وسهولة الوصول إلى الخدمات، مع واجهات حديثة وتوزيع هادئ للكتل السكنية.`,
      ],
    },
    {
      heading: 'موقع الكمبوند',
      paragraphs: [
        `يقع المشروع في ${input.areaName} ضمن ${input.cityName}، مع إمكانية الوصول إلى المحاور الرئيسية والخدمات المحيطة في زمن تنقّل معقول.`,
      ],
      listItems: [
        `قرب من خدمات ${input.cityName}`,
        'سهولة الوصول إلى المحاور والطرق الرئيسية',
        'بيئة سكنية مناسبة للاستخدام اليومي',
      ],
    },
    {
      heading: 'التصميم',
      paragraphs: [
        'يعتمد المخطط العام على مساحات خضراء وممرات مشاة وفصل منطقي لحركة السيارات قدر الإمكان، مع ساحات مشتركة تدعم الاستخدام اليومي للسكان.',
      ],
    },
    {
      heading: 'الخدمات والمرافق',
      paragraphs: [
        'يوفر المشروع حزمة مرافق أساسية تقلل الحاجة إلى الخروج المتكرر وتدعم أسلوب حياة مريح داخل الكمبوند.',
      ],
      listItems: [
        'أمن وبوابات منظمة',
        'مساحات خضراء ومناطق مشاة',
        'مواقف للسكان والزوار',
        'خدمات تجارية ومساندة حسب المخطط',
      ],
    },
    {
      heading: 'الوحدات والأسعار',
      paragraphs: [
        `تبدأ أسعار الوحدات من حوالي ${input.startingPrice.toLocaleString('ar-EG')} ج.م حسب المساحة والتشطيب ومصدر البيع (مطوّر أو معلنين).`,
        'تختلف المساحات بين الوحدات الأصغر المناسبة للأفراد والشقق العائلية وحتى الفلل أو الأنماط الأكبر حسب الطرح.',
      ],
    },
    {
      heading: 'أنظمة السداد',
      paragraphs: [
        'تشمل العروض المتاحة خطط تقسيط وكاش أو كاش مع تقسيط حسب الطرح الحالي، مع اختلاف الشروط بين وحدات المطوّر ووحدات المعلنين.',
      ],
    },
    {
      heading: 'المطور العقاري',
      paragraphs: [
        `يطوّر المشروع ${input.developerName}. ${statusNote}`,
      ],
    },
  ];
}

function buildFaq(input: {
  nameAr: string;
  areaName: string;
  cityName: string;
  developerName: string;
}): CompoundFaqItem[] {
  return [
    {
      id: 'faq-location',
      question: 'أين يقع المشروع؟',
      answer: `يقع ${input.nameAr} في ${input.areaName} ضمن ${input.cityName}. يمكن مراجعة الإحداثيات في قسم الخريطة.`,
    },
    {
      id: 'faq-developer',
      question: 'من هو المطور؟',
      answer: `المطور هو ${input.developerName}، ويمكن الاطلاع على نبذة عنه في قسم المطور أسفل الصفحة.`,
    },
    {
      id: 'faq-units',
      question: 'ما أنواع الوحدات؟',
      answer:
        'تشمل الوحدات المتاحة عروض المطوّر وإعادة البيع والإيجار حسب التوفر، ويمكن تصفحها من قسم وحدات الكمبوند.',
    },
    {
      id: 'faq-payment',
      question: 'ما طرق السداد؟',
      answer:
        'تختلف طرق السداد حسب مصدر الوحدة، وتشمل عادةً التقسيط والكاش أو الكاش مع تقسيط وفق الطرح الحالي.',
    },
    {
      id: 'faq-delivery',
      question: 'هل توجد وحدات جاهزة؟',
      answer:
        'مواعيد التسليم تختلف حسب البلوك والطرح، وقد تتوفر وحدات أقرب للتسليم ضمن عروض المعلنين.',
    },
  ];
}

function buildRecommendation(
  nameEn: string,
  nameAr: string,
  score: number,
  areaName: string,
): CompoundRecommendation {
  const label =
    score >= 75
      ? 'موصى به للسكن العائلي'
      : score >= 55
        ? 'خيار متوازن يستحق المراجعة'
        : 'يحتاج مقارنة أدق مع بدائل المنطقة';

  return {
    score,
    label,
    summary: `تقييم أولي لـ ${nameEn} - ${nameAr} في ${areaName} من حيث الموقع والخدمات وتنوّع الوحدات.`,
    benefits: [
      `موقع داخل ${areaName}`,
      'تنوّع في المساحات المعروضة',
      'خدمات ومرافق أساسية داخل المشروع',
      'خيارات تواصل مباشرة مع المعلن',
    ],
    expertReviewAvailable: score >= 60,
    pro: score >= 70,
    ctaLabel: 'تواصل مع مستشار عقاري',
  };
}

/**
 * Deterministic mock compound builder with complete details defaults.
 * Unit inventory lives on Property records (see compound-unit-listings).
 */
export function createMockCompound(
  input: CreateMockCompoundInput,
): Compound {
  const {
    index,
    id,
    slug,
    nameAr,
    nameEn,
    location,
    developer,
    startingPrice,
    overrides = {},
  } = input;

  const galleryCount = input.galleryCount ?? 5 + (index % 5);
  const galleryOffset = input.galleryOffset ?? index * 3;
  const gallery = galleryImages(slug, nameAr, galleryCount, galleryOffset);
  const images = toCompoundImages(gallery);
  const score = 52 + ((index * 7) % 41);
  const priceLevel =
    input.priceLevel ??
    (['economy', 'mid', 'premium', 'luxury'] as const)[index % 4];
  const constructionStatus =
    input.constructionStatus ??
    (
      [
        'planning',
        'under_construction',
        'delivered',
        'ready',
      ] as const
    )[index % 4];
  const finishingTypes = input.finishingTypes ??
    (
      [
        ['semi_finished'],
        ['finished'],
        ['lux', 'super_lux'],
        ['finished', 'lux'],
      ] as FinishingType[][]
    )[index % 4];
  const paymentMethods = input.paymentMethods ??
    (
      [
        ['installment'],
        ['cash'],
        ['cash_or_installment'],
        ['installment', 'cash'],
      ] as Compound['paymentMethods'][]
    )[index % 4];
  const availablePropertyTypes = input.availablePropertyTypes ?? [
    'apartment',
    'villa',
    'studio',
    'townhouse',
  ];

  const developerRecord: Developer = {
    ...developer,
    memberSinceYear: developer.memberSinceYear ?? 2008 + (index % 8),
    rating: developer.rating ?? 4.1 + (index % 6) * 0.1,
    unitsForSale: developer.unitsForSale ?? 12 + (index % 20),
    unitsForRent: developer.unitsForRent ?? index % 7,
  };

  const base: Compound = {
    id,
    slug,
    name: nameAr,
    nameAr,
    nameEn,
    description: `مشروع ${nameAr} في ${location.areaName} من تطوير ${developer.name}، بوحدات متنوعة وخدمات يومية مناسبة للعائلات.`,
    shortDescription: `مجتمع سكني في ${location.areaName} يجمع بين تنوّع الوحدات والخدمات اليومية.`,
    contentSections: buildContentSections({
      nameAr,
      nameEn,
      areaName: location.areaName,
      cityName: location.cityName,
      developerName: developer.name,
      startingPrice,
      constructionStatus,
    }),
    developerId: developer.id,
    developerName: developer.name,
    developerLogo: developer.logoUrl,
    developerProjectCount: developer.projectsCount,
    developer: developerRecord,
    governorateSlug: location.governorateSlug,
    governorateName: location.governorateName,
    citySlug: location.citySlug,
    cityName: location.cityName,
    areaSlug: location.areaSlug,
    areaName: location.areaName,
    coverImageUrl: gallery[0].src,
    images,
    gallery,
    verified: input.verified ?? index % 4 !== 3,
    startingPrice,
    minPrice: startingPrice,
    maxPrice: startingPrice * (2 + (index % 3)),
    currency: 'EGP',
    priceLevel,
    constructionStatus,
    finishingTypes,
    paymentMethods,
    availablePropertyTypes,
    propertyCount: 4 + (index % 18),
    amenities: ['أمن', 'مساحات خضراء', 'مواقف', 'خدمات تجارية'].slice(
      0,
      2 + (index % 3),
    ),
    phone: `+20100000${String(200 + index).padStart(4, '0')}`,
    whatsapp: `+20100000${String(200 + index).padStart(4, '0')}`,
    brochureUrl:
      input.brochureUrl === null
        ? undefined
        : (input.brochureUrl ??
          (index % 3 === 0
            ? '/assets/compounds-directory/compound-01.webp'
            : undefined)),
    recommendation: buildRecommendation(nameEn, nameAr, score, location.areaName),
    faq: buildFaq({
      nameAr,
      areaName: location.areaName,
      cityName: location.cityName,
      developerName: developer.name,
    }),
    latitude: location.lat + (index % 5) * 0.0012,
    longitude: location.lng + (index % 4) * 0.0011,
    isNew: index % 5 === 0,
    statusLabel: index % 5 === 0 ? 'طرح جديد' : 'متاح',
    createdAt: new Date(
      Date.UTC(2025, index % 10, 3 + (index % 20), 10),
    ).toISOString(),
    updatedAt: new Date(
      Date.UTC(2026, 5, 1 + (index % 20), 12),
    ).toISOString(),
  };

  return { ...base, ...overrides };
}
