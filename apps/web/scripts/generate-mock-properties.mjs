import { writeFileSync } from 'node:fs';

const locations = [
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'fifth-settlement',
    areaName: 'التجمع الخامس',
    lat: 30.0148,
    lng: 31.4281,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'madinaty',
    areaName: 'مدينتي',
    lat: 30.1001,
    lng: 31.637,
  },
  {
    governorateSlug: 'giza',
    governorateName: 'الجيزة',
    citySlug: 'sheikh-zayed',
    cityName: 'الشيخ زايد',
    areaSlug: 'sheikh-zayed',
    areaName: 'الشيخ زايد',
    lat: 30.0264,
    lng: 30.9695,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'nasr-city',
    cityName: 'مدينة نصر',
    areaSlug: 'nasr-city',
    areaName: 'مدينة نصر',
    lat: 30.0626,
    lng: 31.3497,
  },
  {
    governorateSlug: 'giza',
    governorateName: 'الجيزة',
    citySlug: '6th-october',
    cityName: '٦ أكتوبر',
    areaSlug: '6th-october',
    areaName: '٦ أكتوبر',
    lat: 29.9381,
    lng: 30.9138,
  },
  {
    governorateSlug: 'alexandria',
    governorateName: 'الإسكندرية',
    citySlug: 'alexandria',
    cityName: 'الإسكندرية',
    areaSlug: 'smouha',
    areaName: 'سموحة',
    lat: 31.2165,
    lng: 29.944,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'rehab',
    areaName: 'الرحاب',
    lat: 30.058,
    lng: 31.492,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'heliopolis',
    cityName: 'مصر الجديدة',
    areaSlug: 'heliopolis',
    areaName: 'مصر الجديدة',
    lat: 30.091,
    lng: 31.322,
  },
];

const apartmentTitles = [
  'شقة ٣ غرف للبيع',
  'شقة بحديقة للبيع',
  'شقة واسعة للبيع',
  'شقة دور كامل للبيع',
  'شقة سكنية للبيع',
  'شقة استثمارية للبيع',
  'شقة حديثة للبيع',
  'شقة فاخرة للبيع',
  'شقة مطلة على حديقة للبيع',
  'شقة عائلية للبيع',
  'شقة بتشطيب كامل للبيع',
  'شقة قريبة من الخدمات للبيع',
  'شقة بإطلالة مفتوحة للبيع',
  'شقة مناسبة للسكن الفوري',
  'شقة في موقع حيوي للبيع',
  'شقة بغرفتين وصالة للبيع',
  'شقة بثلاث غرف ومطبخ أمريكي',
  'شقة في كمبوند هادئ للبيع',
  'شقة بإطلالة شارع رئيسي',
  'شقة بمدخل خاص للبيع',
  'شقة بروف صغير للبيع',
  'شقة في برج حديث للبيع',
  'شقة بتشطيب سوبر لوكس',
  'شقة قريبة من المدارس للبيع',
  'شقة في قلب التجمع للبيع',
  'شقة بواجهة زجاجية للبيع',
  'شقة بحديقة خلفية للبيع',
  'شقة عصرية بمساحة مرنة للبيع',
];

const apartmentFeatures = [
  ['سكني', 'قريبة من الخدمات'],
  ['شقة بحديقة', 'تطل على حديقة'],
  ['سكني'],
  ['دور كامل'],
  ['سكني'],
  ['سكني'],
  ['قريبة من الخدمات'],
  ['سكني', 'تشطيب كامل'],
  ['شقة بحديقة'],
  ['سكني'],
  ['تشطيب كامل'],
  ['قريبة من الخدمات'],
  ['إطلالة مفتوحة'],
  ['استلام فوري'],
  ['سكني'],
  ['سكني'],
  ['مطبخ أمريكي'],
  ['داخل كمبوند'],
  ['شارع رئيسي'],
  ['مدخل خاص'],
  ['روف'],
  ['سكني'],
  ['سوبر لوكس'],
  ['قريبة من المدارس'],
  ['سكني'],
  ['واجهة زجاجية'],
  ['شقة بحديقة'],
  ['سكني'],
];

const otherTypes = [
  {
    type: 'villa',
    tx: 'sale',
    title: 'فيلا مستقلة للبيع',
    beds: 5,
    baths: 4,
    area: 380,
    price: 15500000,
  },
  {
    type: 'duplex',
    tx: 'sale',
    title: 'دوبلكس للبيع',
    beds: 4,
    baths: 3,
    area: 280,
    price: 9800000,
    features: ['دوبلكس'],
  },
  {
    type: 'penthouse',
    tx: 'sale',
    title: 'بنتهاوس للبيع',
    beds: 3,
    baths: 3,
    area: 240,
    price: 11200000,
    features: ['بنتهاوس', 'روف'],
  },
  {
    type: 'apartment',
    tx: 'rent',
    title: 'شقة للإيجار',
    beds: 2,
    baths: 2,
    area: 120,
    price: 18000,
    features: ['مفروش'],
  },
  {
    type: 'studio',
    tx: 'rent',
    title: 'استوديو للإيجار',
    beds: 0,
    baths: 1,
    area: 48,
    price: 9000,
    features: ['ستوديو', 'مفروش'],
  },
  {
    type: 'office',
    tx: 'rent',
    title: 'مكتب إداري للإيجار',
    beds: 0,
    baths: 2,
    area: 170,
    price: 40000,
  },
  {
    type: 'chalet',
    tx: 'sale',
    title: 'شاليه للبيع',
    beds: 3,
    baths: 2,
    area: 140,
    price: 7200000,
  },
  {
    type: 'townhouse',
    tx: 'sale',
    title: 'تاون هاوس للبيع',
    beds: 4,
    baths: 3,
    area: 250,
    price: 8900000,
  },
  {
    type: 'land',
    tx: 'sale',
    title: 'قطعة أرض للبيع',
    beds: 0,
    baths: 0,
    area: 600,
    price: 9800000,
  },
  {
    type: 'duplex',
    tx: 'sale',
    title: 'دوبلكس بحديقة للبيع',
    beds: 4,
    baths: 3,
    area: 300,
    price: 11800000,
    features: ['دوبلكس بحديقة', 'شقة بحديقة'],
  },
  {
    type: 'studio',
    tx: 'sale',
    title: 'ستوديو فندقي للبيع',
    beds: 0,
    baths: 1,
    area: 55,
    price: 2800000,
    features: ['ستوديو فندقي', 'مفروش'],
  },
  {
    type: 'apartment',
    tx: 'rent',
    title: 'شقة مفروشة للإيجار',
    beds: 2,
    baths: 1,
    area: 100,
    price: 15000,
    features: ['مفروش'],
  },
];

const amenityPools = [
  'أمن',
  'هاتف أرضي',
  'مصعد',
  'جراج مغطى',
  'شرفة',
  'عداد مياه',
  'غاز طبيعي',
  'تكييف مركزي',
  'موقف سيارات',
  'نظام إنذار',
  'حمام سباحة',
  'جيم',
  'حديقة خاصة',
  'بلكونة واسعة',
  'خزائن حائط',
  'تدفئة مركزية',
];

const viewTypes = ['حديقة', 'شارع رئيسي', 'مفتوح', 'بحيرة', 'حمام سباحة', 'نادي'];

const sellers = [
  {
    id: 'seller-01',
    name: 'مكتب النور العقاري',
    type: 'agency',
    phone: '+201000000101',
    whatsapp: '+201000000101',
    isVerified: true,
    rating: 4.2,
    listingCount: 128,
  },
  {
    id: 'seller-02',
    name: 'أحمد منصور',
    type: 'broker',
    phone: '+201000000202',
    whatsapp: '+201000000202',
    isVerified: true,
    rating: 4.6,
    listingCount: 42,
  },
  {
    id: 'seller-03',
    name: 'سارة فؤاد',
    type: 'owner',
    phone: '+201000000303',
    whatsapp: '+201000000303',
    isVerified: false,
    rating: 4.0,
    listingCount: 3,
  },
  {
    id: 'seller-04',
    name: 'شركة سكن بلس',
    type: 'agency',
    phone: '+201000000404',
    whatsapp: '+201000000404',
    isVerified: true,
    rating: 3.9,
    listingCount: 214,
  },
];

const compounds = [
  {
    id: 'cmp-orchid-park',
    slug: 'orchid-park',
    name: 'أوركيد بارك',
    description:
      'كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.',
  },
  {
    id: 'cmp-palm-valley',
    slug: 'palm-valley',
    name: 'بالم فالي',
    description:
      'مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.',
  },
  {
    id: 'cmp-eastwood-residence',
    slug: 'eastwood-residence',
    name: 'إيستوود ريزيدنس',
    description:
      'تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.',
  },
  null,
  null,
];

const ratingCategories = [
  { key: 'overall', label: 'التقييم العام' },
  { key: 'cleanliness', label: 'مستوى النظافة' },
  { key: 'location', label: 'الموقع' },
  { key: 'quiet', label: 'الهدوء' },
  { key: 'transport', label: 'المواصلات' },
  { key: 'schools', label: 'المدارس والخدمات' },
  { key: 'shopping', label: 'التسوق والمطاعم' },
  { key: 'health', label: 'الخدمات الصحية' },
];

function img(n, alt, cover = true, order = 1) {
  const num = String(((n - 1) % 23) + 1).padStart(2, '0');
  return {
    id: `img-${n}-${order}`,
    url: `/assets/properties/property-${num}.webp`,
    alt,
    isCover: cover,
    order,
  };
}

function buildImages(seed, title) {
  const count = 6 + (seed % 5);
  return Array.from({ length: count }, (_, order) =>
    img(seed + order + 1, order === 0 ? title : `${title} - صورة ${order + 1}`, order === 0, order + 1),
  );
}

function buildAmenities(seed) {
  const count = 6 + (seed % 7);
  return amenityPools
    .slice()
    .sort((a, b) => ((a.charCodeAt(0) + seed) % 7) - ((b.charCodeAt(0) + seed) % 5))
    .filter((_, index) => index < count);
}

function buildCompoundRatings(seed) {
  const categories = ratingCategories.map((category, index) => {
    const score = Math.min(5, Math.max(3.2, 3.6 + ((seed + index) % 12) * 0.12));
    return {
      key: category.key,
      label: category.label,
      score: Number(score.toFixed(1)),
    };
  });

  return {
    overall: categories[0].score,
    categories,
  };
}

function buildDescription(t, loc, compound) {
  const compoundLine = compound
    ? ` الوحدة تقع داخل كمبوند ${compound.name} مع إطلالة مناسبة وخدمات مشتركة.`
    : ' الوحدة في موقع سكني منظم وقريب من الخدمات اليومية.';

  return [
    `وحدة ${t.title} بمساحة ${t.area} م² في ${loc.areaName}،${compoundLine}`,
    `المساحات موزعة بشكل عملي مع ${t.beds || 0} غرف و${t.baths || 0} حمام، وواجهة مناسبة للاستخدام اليومي.`,
    `المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية.`,
    `الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.`,
  ].join(' ');
}

function buildProperty(t, i) {
  const idNum = 1001 + i;
  // Concentrate early sale apartments in fifth-settlement so similar listings fill.
  const loc =
    t.tx === 'sale' && t.type === 'apartment' && i < 8
      ? locations[0]
      : locations[i % locations.length];
  const seller = sellers[i % sellers.length];
  const compound =
    i === 0 ? compounds[0] : compounds[i % compounds.length];
  const pricePerSqm = Math.round(t.price / Math.max(t.area, 1));
  const slug = `${t.type}-for-${t.tx}-${loc.areaSlug}-${idNum}`;
  const finish = ['finished', 'lux', 'super_lux', 'semi_finished'][i % 4];
  const payment =
    t.tx === 'rent' ? 'cash' : ['cash', 'installment', 'cash_or_installment'][i % 3];
  const features = t.features ?? ['قريبة من الخدمات'];
  const images = buildImages(i + 1, t.title);
  const downPayment =
    payment === 'cash' ? undefined : Math.round(t.price * (0.05 + (i % 4) * 0.05));
  const installmentYears = payment === 'cash' ? undefined : 5 + (i % 6);
  const monthlyInstallment =
    payment === 'cash' || !downPayment || !installmentYears
      ? undefined
      : Math.round((t.price - downPayment) / (installmentYears * 12));

  return {
    id: `prop-${idNum}`,
    referenceNumber: `EH-${idNum}`,
    slug,
    title: `${t.title} في ${loc.areaName}`,
    description: buildDescription(t, loc, compound),
    transactionType: t.tx,
    propertyType: t.type,
    price: t.price,
    pricePerSqm,
    currency: 'EGP',
    area: t.area,
    bedrooms: t.beds,
    bathrooms: t.baths,
    ...(t.beds ? { floor: (i % 10) + 1 } : {}),
    finishingType: finish,
    paymentType: payment,
    ...(payment === 'cash'
      ? {}
      : {
          downPayment,
          installmentYears,
          monthlyInstallment,
        }),
    deliveryYear: 2024 + (i % 4),
    viewType: viewTypes[i % viewTypes.length],
    ...(features.some((f) => f.includes('حديقة'))
      ? { gardenArea: 40 + (i % 5) * 10 }
      : {}),
    location: {
      countrySlug: 'egypt',
      countryName: 'مصر',
      governorateSlug: loc.governorateSlug,
      governorateName: loc.governorateName,
      citySlug: loc.citySlug,
      cityName: loc.cityName,
      areaSlug: loc.areaSlug,
      areaName: loc.areaName,
      latitude: loc.lat,
      longitude: loc.lng,
    },
    ...(compound
      ? {
          compoundId: compound.id,
          compoundSlug: compound.slug,
          compoundName: compound.name,
          compoundDescription: compound.description,
          compoundRatings: buildCompoundRatings(i),
          developerId: 'dev-nile-horizon',
          developerName: 'نايل هورايزون للتطوير',
        }
      : {}),
    images,
    seller,
    amenities: buildAmenities(i),
    features,
    verificationState: i % 5 === 0 ? 'pending' : 'verified',
    views: 120 + i * 41,
    favoritesCount: 5 + (i * 3) % 45,
    searchAppearances: 800 + i * 37,
    createdAt: new Date(Date.UTC(2026, 3 + (i % 5), 2 + (i % 20), 10)).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 6, 1 + (i % 25), 12)).toISOString(),
  };
}

const saleApartments = apartmentTitles.map((title, i) => {
  const beds = /٣|ثلاث/.test(title)
    ? 3
    : /غرفتين|٢/.test(title)
      ? 2
      : [2, 3, 3, 4, 2, 3][i % 6];
  const baths = Math.max(1, beds - 1);
  const area = 95 + (i % 12) * 12 + (i % 3) * 5;
  const price = 2_600_000 + i * 185_000 + (i % 4) * 90_000;

  return {
    type: 'apartment',
    tx: 'sale',
    title,
    beds,
    baths,
    area,
    price,
    features: apartmentFeatures[i] ?? ['سكني'],
  };
});

const types = [...saleApartments, ...otherTypes];
const items = types.map((t, i) => buildProperty(t, i));

/** Full-featured listing used by Property Details visual QA (prop-1001). */
function enrichVisualQaProperty(property) {
  const downPayment = Math.round(property.price * 0.1);
  const installmentYears = 8;
  const monthlyInstallment = Math.round(
    (property.price - downPayment) / (installmentYears * 12),
  );

  return {
    ...property,
    title: 'شقة ٣ غرف بحديقة للبيع في التجمع الخامس',
    description: [
      'وحدة سكنية بمساحة مناسبة للعائلة داخل كمبوند أوركيد بارك بالتجمع الخامس،',
      'مع توزيع عملي للغرف وصالة واسعة وإطلالة على الحديقة.',
      'الوحدة متاحة بنظام تقسيط مرن، وقريبة من الخدمات اليومية والمحاور الرئيسية.',
      'هذا الوصف مخصص للعرض التجريبي ويغطي تفاصيل العقار والموقع والمزايا المشتركة.',
      'يمكن معاينة صور إضافية ومقارنة الوحدات المشابهة في نفس المنطقة بسهولة.',
    ].join(' '),
    paymentType: 'installment',
    downPayment,
    installmentYears,
    monthlyInstallment,
    deliveryYear: 2025,
    viewType: 'حديقة',
    gardenArea: 70,
    finishingType: 'semi_finished',
    images: buildImages(1, property.title).concat(
      buildImages(12, property.title).slice(0, 4).map((image, index) => ({
        ...image,
        id: `img-qa-${index + 1}`,
        isCover: false,
        order: 20 + index,
      })),
    ),
    amenities: [...amenityPools],
    compoundId: 'cmp-orchid-park',
    compoundSlug: 'orchid-park',
    compoundName: 'أوركيد بارك',
    compoundDescription:
      'كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات، مع تقييمات جيدة للموقع والخدمات.',
    compoundRatings: {
      overall: 4.4,
      categories: ratingCategories.map((category, index) => ({
        key: category.key,
        label: category.label,
        score: Number((4.4 - Math.min(index, 4) * 0.05 + (index > 4 ? (index - 4) * 0.05 : 0)).toFixed(1)),
      })),
    },
    developerId: 'dev-nile-horizon',
    developerName: 'نايل هورايزون للتطوير',
    seller: {
      ...sellers[0],
      rating: 4.5,
      listingCount: 186,
    },
    verificationState: 'verified',
    views: 1840,
    favoritesCount: 96,
    searchAppearances: 6420,
  };
}

items[0] = enrichVisualQaProperty(items[0]);

const out = `import type { Property } from '@/types';

export const mockProperties: Property[] = ${JSON.stringify(items, null, 2)};
`;

writeFileSync('src/data/mock/properties.ts', out);
const saleApt = items.filter(
  (p) => p.transactionType === 'sale' && p.propertyType === 'apartment',
).length;
const qa = items[0];
const similarPool = items.filter(
  (p) =>
    p.id !== qa.id &&
    p.transactionType === qa.transactionType &&
    p.propertyType === qa.propertyType &&
    p.location.areaSlug === qa.location.areaSlug,
).length;
console.log(
  'wrote',
  items.length,
  'properties;',
  saleApt,
  'sale apartments; QA similar pool',
  similarPool,
);
