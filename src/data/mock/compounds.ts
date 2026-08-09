import type { Compound, Developer } from '@/types';
import {
  createMockCompound,
  type MockCompoundLocation,
} from './create-mock-compound';

export const mockDevelopers: Developer[] = [
  {
    id: 'dev-nile-horizon',
    name: 'نايل هورايزون للتطوير',
    slug: 'nile-horizon',
    logoUrl: '/assets/developers/nile-horizon.svg',
    description:
      'مطور متخصص في المجتمعات السكنية المتوسطة والفاخرة حول القاهرة الكبرى.',
    projectsCount: 12,
    memberSinceYear: 2009,
    rating: 4.6,
    unitsForSale: 48,
    unitsForRent: 6,
  },
  {
    id: 'dev-delta-living',
    name: 'دلتا ليفينج',
    slug: 'delta-living',
    logoUrl: '/assets/developers/delta-living.svg',
    description:
      'شركة تطوير عقاري تركز على الوحدات العائلية والخدمات المتكاملة.',
    projectsCount: 8,
    memberSinceYear: 2012,
    rating: 4.3,
    unitsForSale: 32,
    unitsForRent: 4,
  },
  {
    id: 'dev-oasis-homes',
    name: 'واحة هومز',
    slug: 'oasis-homes',
    logoUrl: '/assets/developers/oasis-homes.svg',
    description:
      'مشاريع سكنية حديثة بمواقع استراتيجية وخدمات يومية متكاملة.',
    projectsCount: 6,
    memberSinceYear: 2014,
    rating: 4.2,
    unitsForSale: 24,
    unitsForRent: 3,
  },
  {
    id: 'dev-prime-urban',
    name: 'برايم أوربان',
    slug: 'prime-urban',
    logoUrl: '/assets/developers/prime-urban.svg',
    description:
      'تطوير مجتمعات متوسطة وفاخرة مع تركيز على جودة التشطيب.',
    projectsCount: 9,
    memberSinceYear: 2011,
    rating: 4.5,
    unitsForSale: 36,
    unitsForRent: 5,
  },
  {
    id: 'dev-coastal-vista',
    name: 'كوستال فيستا',
    slug: 'coastal-vista',
    logoUrl: '/assets/developers/coastal-vista.svg',
    description: 'مطور متخصص في مشاريع الساحل والتجمعات السياحية.',
    projectsCount: 5,
    memberSinceYear: 2015,
    rating: 4.4,
    unitsForSale: 20,
    unitsForRent: 8,
  },
];

const locations: MockCompoundLocation[] = [
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'fifth-settlement',
    areaName: 'التجمع الخامس',
    lat: 30.0142,
    lng: 31.4275,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'madinaty',
    areaName: 'مدينتي',
    lat: 30.0995,
    lng: 31.6362,
  },
  {
    governorateSlug: 'giza',
    governorateName: 'الجيزة',
    citySlug: '6th-october',
    cityName: '٦ أكتوبر',
    areaSlug: 'sheikh-zayed',
    areaName: 'الشيخ زايد',
    lat: 30.0481,
    lng: 30.976,
  },
  {
    governorateSlug: 'giza',
    governorateName: 'الجيزة',
    citySlug: '6th-october',
    cityName: '٦ أكتوبر',
    areaSlug: '6th-october',
    areaName: '٦ أكتوبر',
    lat: 29.9697,
    lng: 30.921,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-administrative-capital',
    cityName: 'العاصمة الإدارية الجديدة',
    areaSlug: 'r7',
    areaName: 'R7',
    lat: 30.02,
    lng: 31.7,
  },
  {
    governorateSlug: 'matrouh',
    governorateName: 'مطروح',
    citySlug: 'north-coast',
    cityName: 'الساحل الشمالي',
    areaSlug: 'ras-el-hekma',
    areaName: 'رأس الحكمة',
    lat: 31.15,
    lng: 27.85,
  },
  {
    governorateSlug: 'alexandria',
    governorateName: 'الإسكندرية',
    citySlug: 'alexandria',
    cityName: 'الإسكندرية',
    areaSlug: 'alexandria',
    areaName: 'الإسكندرية',
    lat: 31.2,
    lng: 29.92,
  },
  {
    governorateSlug: 'cairo',
    governorateName: 'القاهرة',
    citySlug: 'new-cairo',
    cityName: 'القاهرة الجديدة',
    areaSlug: 'downtown-new-cairo',
    areaName: 'الداون تاون',
    lat: 30.02,
    lng: 31.45,
  },
];

const projects = [
  { ar: 'أوركيد بارك', en: 'Orchid Park' },
  { ar: 'بالم فالي', en: 'Palm Valley' },
  { ar: 'إيستوود ريزيدنس', en: 'Eastwood Residence' },
  { ar: 'ريفيرا هايتس', en: 'Rivera Heights' },
  { ar: 'صن ست جاردنز', en: 'Sunset Gardens' },
  { ar: 'أورلا ريزيدنس', en: 'Orla Residence' },
  { ar: 'كالي كوست', en: 'Cali Coast' },
  { ar: 'نيل فيو', en: 'Nile View' },
  { ar: 'جرين ويفز', en: 'Green Waves' },
  { ar: 'سيتي لينز', en: 'City Lanes' },
  { ar: 'ليك سايد بارك', en: 'Lakeside Park' },
  { ar: 'ميرا جيت', en: 'Mira Gate' },
  { ar: 'بلو هاربور', en: 'Blue Harbor' },
  { ar: 'فيستا هيلز', en: 'Vista Hills' },
  { ar: 'أوربان سكوير', en: 'Urban Square' },
  { ar: 'بارك أفينيو', en: 'Park Avenue' },
  { ar: 'سكاي جاردن', en: 'Sky Garden' },
  { ar: 'واحة النخيل', en: 'Palm Oasis' },
  { ar: 'ديستريكت ون', en: 'District One' },
  { ar: 'هايفن هومز', en: 'Haven Homes' },
  { ar: 'مارينا باي', en: 'Marina Bay' },
  { ar: 'إيجلز لاند', en: 'Eagles Land' },
  { ar: 'ريفو ريزيدنس', en: 'Revo Residence' },
  { ar: 'جولدن جيت', en: 'Golden Gate' },
  { ar: 'سيتي هومز', en: 'City Homes' },
  { ar: 'نورا هايتس', en: 'Nora Heights' },
  { ar: 'ألاسكا بارك', en: 'Alaska Park' },
  { ar: 'بريما فيو', en: 'Prima View' },
  { ar: 'لوتس ليفينج', en: 'Lotus Living' },
  { ar: 'أورا سايد', en: 'Aura Side' },
  { ar: 'ميترو هيلز', en: 'Metro Hills' },
  { ar: 'سيليا بارك', en: 'Celia Park' },
] as const;

const ALIAS_BY_NAME: Record<string, string> = {
  'أوركيد بارك': 'orchid-park',
  'بالم فالي': 'palm-valley',
  'إيستوود ريزيدنس': 'eastwood-residence',
};

function orchidRecommendation() {
  return {
    score: 78,
    label: 'موصى به للسكن العائلي',
    summary:
      'تقييم المشروع إيجابي من حيث الموقع والخدمات وتنوّع الوحدات، مع خطط سداد مرنة نسبيًا.',
    benefits: [
      'موقع قريب من المحاور الرئيسية',
      'تنوّع في المساحات والأنماط',
      'خدمات ومرافق يومية داخل المشروع',
      'خيارات سداد مناسبة للشراء الأول',
    ],
    expertReviewAvailable: true,
    pro: true,
    ctaLabel: 'تواصل مع مستشار عقاري',
  };
}

export const mockCompounds: Compound[] = projects.map((project, index) => {
  const location = locations[index % locations.length];
  const developer = mockDevelopers[index % mockDevelopers.length];
  const startingPrice = 2_400_000 + index * 275_000 + (index % 4) * 120_000;
  const slugBase = project.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const alias = ALIAS_BY_NAME[project.ar];
  const slug = alias ?? `${slugBase}-${1001 + index}`;
  const id = alias ? `cmp-${alias}` : `cmp-${String(1001 + index)}`;

  const isOrchid = alias === 'orchid-park';

  return createMockCompound({
    index,
    id,
    slug,
    nameAr: project.ar,
    nameEn: project.en,
    location,
    developer,
    startingPrice,
    galleryCount: isOrchid ? 9 : undefined,
    galleryOffset: isOrchid ? 3 : undefined,
    brochureUrl: isOrchid
      ? '/assets/compounds-directory/compound-01.webp'
      : undefined,
    overrides: isOrchid
      ? {
          recommendation: orchidRecommendation(),
          shortDescription:
            'مجتمع سكني متكامل في التجمع الخامس يجمع بين المساحات الخضراء والوحدات المتنوعة والخدمات اليومية.',
        }
      : undefined,
  });
});
