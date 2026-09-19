import * as bcrypt from 'bcrypt';
import {
  FinishingType,
  PaymentType,
  PrismaClient,
  PropertyContactSource,
  PropertyContactType,
  PropertyStatus,
  RentPeriod,
} from '../generated/prisma-client';

/** Same cost factor as AuthService password hashing / the other seed users. */
const BCRYPT_ROUNDS = 12;

/** Email of the admin user created in seed.ts — used as the reviewer for reviewed listings. */
const SUPER_ADMIN_EMAIL = 'admin@dashboard.com';

const SEED_OWNER = {
  email: 'owner.seed@dashboard.com',
  password: 'Owner@123456',
  firstName: 'Seed',
  lastName: 'Owner',
  phone: '+201000000001',
  roleCode: 'BROKER',
} as const;

/** Reused by other seed modules (engagement, billing) that attribute records to this owner. */
export const SEED_OWNER_EMAIL = SEED_OWNER.email;

/** Extra district (under the "new-cairo" area seeded alongside developers/compounds). */
const SEED_DISTRICT = {
  areaSlug: 'new-cairo',
  slug: 'fifth-settlement',
  nameEn: 'Fifth Settlement',
  nameAr: 'التجمع الخامس',
} as const;

/** Extra coastal city/area (under the "EG" country seeded alongside developers/compounds) — gives
 * a realistic home for a sea-view, daily-rent chalet so that view/rent-period combo isn't seeded
 * on a New Cairo property. */
const SEED_COASTAL_AREA = {
  countryCode: 'EG',
  citySlug: 'alexandria',
  cityNameEn: 'Alexandria',
  cityNameAr: 'الإسكندرية',
  areaSlug: 'north-coast',
  areaNameEn: 'North Coast',
  areaNameAr: 'الساحل الشمالي',
} as const;

type SeedImage = {
  publicId: string;
  url: string;
  isPrimary?: boolean;
};

type SeedContact = {
  source: PropertyContactSource;
  contactType: PropertyContactType;
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
};

type SeedProperty = {
  slug: string;
  referenceNumber: string;
  title: string | null;
  description?: string;
  status: PropertyStatus;
  propertyTypeCode?: string;
  transactionTypeCode?: string;
  areaSlug?: string;
  districtSlug?: string;
  compoundSlug?: string;
  legalStatusCode?: string;

  price?: number;
  paymentType?: PaymentType;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  furnished?: boolean;
  rentPeriod?: RentPeriod;
  finishingType?: FinishingType;

  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  floor?: number;
  yearBuilt?: number;

  address?: string;
  latitude?: number;
  longitude?: number;

  featureCodes?: string[];
  viewCodes?: string[];
  contact?: SeedContact;
  images?: SeedImage[];

  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedByAdmin?: boolean;
  publishedAt?: Date;
  archivedAt?: Date;
  rejectedReason?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);

/**
 * Cloudinary's public "demo" cloud sample assets — real, always-available images so seeded
 * property photos actually render through next/image (both apps only allowlist
 * `res.cloudinary.com` in their `images.remotePatterns`, not arbitrary placeholder hosts).
 */
const CLOUDINARY_DEMO_BASE = 'https://res.cloudinary.com/demo/image/upload';
export const demoImage = (publicId: string): string => `${CLOUDINARY_DEMO_BASE}/${publicId}.jpg`;

const SEED_PROPERTIES: SeedProperty[] = [
  {
    slug: 'seed-mountain-view-icity-apartment-201',
    referenceNumber: 'PROP-SEED-0001',
    title: 'Modern 3BR apartment in Mountain View iCity',
    description:
      'Spacious super-lux finished apartment overlooking the central park, ready to move in with a flexible payment plan.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'APARTMENT',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    districtSlug: SEED_DISTRICT.slug,
    compoundSlug: 'mountain-view-icity',
    legalStatusCode: 'REGISTERED_MONTHLY',
    price: 4_500_000,
    paymentType: PaymentType.CASH_OR_INSTALLMENT,
    downPayment: 900_000,
    installmentYears: 7,
    monthlyInstallment: 45_000,
    furnished: false,
    finishingType: FinishingType.SUPER_LUX,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 165,
    floor: 3,
    yearBuilt: 2024,
    address: 'Mountain View iCity, Fifth Settlement, New Cairo',
    latitude: 30.0296,
    longitude: 31.4913,
    featureCodes: ['PARKING', 'ELEVATOR', 'AC', 'SECURITY'],
    viewCodes: ['GARDEN', 'POOL'],
    contact: {
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: 'Seed Owner',
      phone: SEED_OWNER.phone,
      whatsapp: SEED_OWNER.phone,
      email: SEED_OWNER.email,
    },
    images: [
      {
        publicId: 'samples/landscapes/architecture-signs',
        url: demoImage('samples/landscapes/architecture-signs'),
        isPrimary: true,
      },
      {
        publicId: 'samples/people/kitchen-bar',
        url: demoImage('samples/people/kitchen-bar'),
      },
      {
        publicId: 'samples/landscapes/nature-mountains',
        url: demoImage('samples/landscapes/nature-mountains'),
      },
    ],
    submittedAt: daysAgo(30),
    reviewedAt: daysAgo(29),
    reviewedByAdmin: true,
    publishedAt: daysAgo(29),
  },
  {
    slug: 'seed-madinaty-standalone-villa',
    referenceNumber: 'PROP-SEED-0002',
    title: 'Standalone villa in Madinaty with private garden',
    description: 'Five-bedroom standalone villa with a private garden and pool, close to Madinaty central park.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'VILLA',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    compoundSlug: 'madinaty',
    legalStatusCode: 'INITIAL_CONTRACT',
    price: 12_000_000,
    paymentType: PaymentType.INSTALLMENT,
    downPayment: 2_000_000,
    installmentYears: 8,
    monthlyInstallment: 104_167,
    finishingType: FinishingType.LUX,
    bedrooms: 5,
    bathrooms: 4,
    areaSqm: 350,
    yearBuilt: 2023,
    address: 'Madinaty, New Cairo',
    latitude: 30.0665,
    longitude: 31.6404,
    featureCodes: ['PARKING', 'GARDEN', 'POOL', 'SECURITY', 'GYM'],
    viewCodes: ['NILE', 'GARDEN'],
    contact: {
      source: PropertyContactSource.CUSTOM,
      contactType: PropertyContactType.AGENT,
      name: 'Nour El-Sayed',
      phone: '+201000000002',
      whatsapp: '+201000000002',
    },
    images: [
      {
        publicId: 'samples/landscapes/beach-boat',
        url: demoImage('samples/landscapes/beach-boat'),
        isPrimary: true,
      },
      {
        publicId: 'samples/landscapes/girl-urban-view',
        url: demoImage('samples/landscapes/girl-urban-view'),
      },
    ],
    submittedAt: daysAgo(45),
    reviewedAt: daysAgo(44),
    reviewedByAdmin: true,
    publishedAt: daysAgo(44),
  },
  {
    slug: 'seed-new-cairo-rent-apartment',
    referenceNumber: 'PROP-SEED-0003',
    title: 'Furnished 2BR apartment for rent in New Cairo',
    description: 'Fully furnished, finished apartment available for immediate rent with a city view balcony.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'APARTMENT',
    transactionTypeCode: 'RENT',
    areaSlug: 'new-cairo',
    districtSlug: SEED_DISTRICT.slug,
    legalStatusCode: 'REGISTRABLE',
    price: 25_000,
    rentPeriod: RentPeriod.MONTHLY,
    furnished: true,
    finishingType: FinishingType.FINISHED,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 110,
    floor: 5,
    yearBuilt: 2021,
    address: 'Fifth Settlement, New Cairo',
    featureCodes: ['AC', 'BALCONY'],
    viewCodes: ['CITY_VIEW'],
    contact: {
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: 'Seed Owner',
      phone: SEED_OWNER.phone,
      email: SEED_OWNER.email,
    },
    images: [
      {
        publicId: 'samples/people/kitchen-bar',
        url: demoImage('samples/people/kitchen-bar'),
        isPrimary: true,
      },
    ],
    submittedAt: daysAgo(10),
    reviewedAt: daysAgo(9),
    reviewedByAdmin: true,
    publishedAt: daysAgo(9),
  },
  {
    slug: 'seed-town-house-pending-review',
    referenceNumber: 'PROP-SEED-0004',
    title: 'Corner townhouse awaiting review',
    description: 'Semi-finished townhouse submitted by the owner and currently waiting on moderation.',
    status: PropertyStatus.PENDING_REVIEW,
    propertyTypeCode: 'TOWN_HOUSE',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    districtSlug: SEED_DISTRICT.slug,
    price: 6_800_000,
    paymentType: PaymentType.CASH,
    finishingType: FinishingType.SEMI_FINISHED,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 220,
    yearBuilt: 2022,
    address: 'Fifth Settlement, New Cairo',
    featureCodes: ['PARKING', 'GARDEN'],
    contact: {
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: 'Seed Owner',
      phone: SEED_OWNER.phone,
      email: SEED_OWNER.email,
    },
    images: [
      {
        publicId: 'samples/landscapes/architecture-signs',
        url: demoImage('samples/landscapes/architecture-signs'),
        isPrimary: true,
      },
    ],
    submittedAt: daysAgo(2),
  },
  {
    slug: 'draft-seed-chalet-001',
    referenceNumber: 'PROP-SEED-0005',
    title: null,
    status: PropertyStatus.DRAFT,
    propertyTypeCode: 'CHALET',
  },
  {
    slug: 'seed-office-rejected',
    referenceNumber: 'PROP-SEED-0006',
    title: 'Ground floor office space',
    description: 'Unfinished office shell submitted for review; rejected pending missing ownership documents.',
    status: PropertyStatus.REJECTED,
    propertyTypeCode: 'OFFICE',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    price: 3_200_000,
    finishingType: FinishingType.UNFINISHED,
    bathrooms: 1,
    areaSqm: 90,
    floor: 0,
    address: 'New Cairo',
    submittedAt: daysAgo(20),
    reviewedAt: daysAgo(18),
    reviewedByAdmin: true,
    rejectedReason: 'Incomplete ownership documentation provided.',
  },
  {
    slug: 'seed-shop-archived',
    referenceNumber: 'PROP-SEED-0007',
    title: 'Retail shop for rent (archived)',
    description: 'Small retail shop previously listed for rent; archived by the owner after it was taken off market.',
    status: PropertyStatus.ARCHIVED,
    propertyTypeCode: 'SHOP',
    transactionTypeCode: 'RENT',
    areaSlug: 'new-cairo',
    legalStatusCode: 'NOT_REGISTERED',
    price: 15_000,
    rentPeriod: RentPeriod.MONTHLY,
    finishingType: FinishingType.FINISHED,
    areaSqm: 45,
    address: 'New Cairo',
    submittedAt: daysAgo(120),
    reviewedAt: daysAgo(119),
    reviewedByAdmin: true,
    publishedAt: daysAgo(119),
    archivedAt: daysAgo(15),
  },
  {
    slug: 'seed-land-plot-new-cairo',
    referenceNumber: 'PROP-SEED-0008',
    title: '500 sqm residential land plot',
    description: 'Registrable residential land plot suitable for a standalone villa build.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'LAND',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    legalStatusCode: 'POWER_OF_ATTORNEY',
    price: 5_000_000,
    areaSqm: 500,
    address: 'New Cairo',
    viewCodes: ['OPEN_VIEW'],
    contact: {
      source: PropertyContactSource.CUSTOM,
      contactType: PropertyContactType.COMPANY,
      name: 'Prime Urban Developments',
      phone: '+201000000003',
      email: 'sales@prime-urban.example.com',
    },
    submittedAt: daysAgo(60),
    reviewedAt: daysAgo(59),
    reviewedByAdmin: true,
    publishedAt: daysAgo(59),
  },
  {
    slug: 'seed-duplex-pending-payment',
    referenceNumber: 'PROP-SEED-0009',
    title: 'Duplex awaiting listing payment',
    description: 'Finished duplex draft completed by the owner, waiting on the listing fee payment.',
    status: PropertyStatus.PENDING_PAYMENT,
    propertyTypeCode: 'DUPLEX',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    price: 5_200_000,
    paymentType: PaymentType.CASH_OR_INSTALLMENT,
    finishingType: FinishingType.FINISHED,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 240,
    yearBuilt: 2022,
    address: 'New Cairo',
  },
  {
    slug: 'seed-penthouse-expired',
    referenceNumber: 'PROP-SEED-0010',
    title: 'Penthouse with pool access (expired listing)',
    description: 'Lux penthouse rental listing that expired after its listing period ended.',
    status: PropertyStatus.EXPIRED,
    propertyTypeCode: 'PENTHOUSE',
    transactionTypeCode: 'RENT',
    areaSlug: 'new-cairo',
    price: 40_000,
    rentPeriod: RentPeriod.MONTHLY,
    finishingType: FinishingType.LUX,
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 200,
    floor: 12,
    address: 'New Cairo',
    featureCodes: ['POOL', 'AC'],
    viewCodes: ['CITY_VIEW'],
    submittedAt: daysAgo(90),
    reviewedAt: daysAgo(89),
    reviewedByAdmin: true,
    publishedAt: daysAgo(89),
  },
  {
    slug: 'seed-new-cairo-twin-house',
    referenceNumber: 'PROP-SEED-0011',
    title: 'Twin house on the main street, New Cairo',
    description: 'Finished twin house with a private storage room, allocated under the New Urban Communities Authority.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'TWIN_HOUSE',
    transactionTypeCode: 'SALE',
    areaSlug: 'new-cairo',
    districtSlug: SEED_DISTRICT.slug,
    legalStatusCode: 'NEW_COMMUNITIES_AUTHORITY',
    price: 5_500_000,
    paymentType: PaymentType.INSTALLMENT,
    downPayment: 1_100_000,
    installmentYears: 6,
    monthlyInstallment: 61_111,
    finishingType: FinishingType.FINISHED,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 230,
    yearBuilt: 2023,
    address: 'Fifth Settlement, New Cairo',
    featureCodes: ['PARKING', 'STORAGE'],
    viewCodes: ['MAIN_STREET'],
    contact: {
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: 'Seed Owner',
      phone: SEED_OWNER.phone,
      email: SEED_OWNER.email,
    },
    images: [
      {
        publicId: 'samples/landscapes/architecture-signs',
        url: demoImage('samples/landscapes/architecture-signs'),
        isPrimary: true,
      },
    ],
    submittedAt: daysAgo(14),
    reviewedAt: daysAgo(13),
    reviewedByAdmin: true,
    publishedAt: daysAgo(13),
  },
  {
    slug: 'seed-new-cairo-clinic-yearly-rent',
    referenceNumber: 'PROP-SEED-0012',
    title: 'Medical clinic for yearly rent',
    description: 'Semi-finished ground floor clinic space allocated by administrative decision, leased on a yearly basis.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'CLINIC',
    transactionTypeCode: 'RENT',
    areaSlug: 'new-cairo',
    legalStatusCode: 'ALLOCATION_DECISION',
    price: 180_000,
    rentPeriod: RentPeriod.YEARLY,
    finishingType: FinishingType.SEMI_FINISHED,
    bathrooms: 1,
    areaSqm: 60,
    floor: 0,
    address: 'Fifth Settlement, New Cairo',
    contact: {
      source: PropertyContactSource.CUSTOM,
      contactType: PropertyContactType.AGENT,
      name: 'Nour El-Sayed',
      phone: '+201000000002',
      whatsapp: '+201000000002',
    },
    images: [
      {
        publicId: 'samples/people/kitchen-bar',
        url: demoImage('samples/people/kitchen-bar'),
        isPrimary: true,
      },
    ],
    submittedAt: daysAgo(7),
    reviewedAt: daysAgo(6),
    reviewedByAdmin: true,
    publishedAt: daysAgo(6),
  },
  {
    slug: 'seed-north-coast-chalet-daily-rent',
    referenceNumber: 'PROP-SEED-0013',
    title: 'Sea view chalet for daily rent, North Coast',
    description: 'Lux-finished beachfront chalet available for short daily stays, fully furnished with a sea view.',
    status: PropertyStatus.PUBLISHED,
    propertyTypeCode: 'CHALET',
    transactionTypeCode: 'RENT',
    areaSlug: SEED_COASTAL_AREA.areaSlug,
    legalStatusCode: 'REGISTRABLE',
    price: 3_500,
    rentPeriod: RentPeriod.DAILY,
    furnished: true,
    finishingType: FinishingType.LUX,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 140,
    floor: 1,
    yearBuilt: 2022,
    address: 'North Coast, Alexandria',
    featureCodes: ['POOL', 'AC', 'PARKING'],
    viewCodes: ['SEA'],
    contact: {
      source: PropertyContactSource.OWNER,
      contactType: PropertyContactType.OWNER,
      name: 'Seed Owner',
      phone: SEED_OWNER.phone,
      whatsapp: SEED_OWNER.phone,
      email: SEED_OWNER.email,
    },
    images: [
      {
        publicId: 'samples/landscapes/beach-boat',
        url: demoImage('samples/landscapes/beach-boat'),
        isPrimary: true,
      },
      {
        publicId: 'samples/landscapes/nature-mountains',
        url: demoImage('samples/landscapes/nature-mountains'),
      },
    ],
    submittedAt: daysAgo(5),
    reviewedAt: daysAgo(4),
    reviewedByAdmin: true,
    publishedAt: daysAgo(4),
  },
];

async function ensureSeedOwner(prisma: PrismaClient): Promise<string> {
  const passwordHash = await bcrypt.hash(SEED_OWNER.password, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: SEED_OWNER.email },
    update: {
      passwordHash,
      firstName: SEED_OWNER.firstName,
      lastName: SEED_OWNER.lastName,
      phone: SEED_OWNER.phone,
      isEmailVerified: true,
      isActive: true,
    },
    create: {
      email: SEED_OWNER.email,
      passwordHash,
      firstName: SEED_OWNER.firstName,
      lastName: SEED_OWNER.lastName,
      phone: SEED_OWNER.phone,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const role = await prisma.role.findUniqueOrThrow({ where: { code: SEED_OWNER.roleCode } });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  return user.id;
}

async function ensureSeedDistrict(prisma: PrismaClient): Promise<void> {
  const area = await prisma.area.findFirst({ where: { slug: SEED_DISTRICT.areaSlug } });
  if (!area) {
    return;
  }

  await prisma.district.upsert({
    where: { areaId_slug: { areaId: area.id, slug: SEED_DISTRICT.slug } },
    update: {
      nameEn: SEED_DISTRICT.nameEn,
      nameAr: SEED_DISTRICT.nameAr,
      isActive: true,
    },
    create: {
      areaId: area.id,
      slug: SEED_DISTRICT.slug,
      nameEn: SEED_DISTRICT.nameEn,
      nameAr: SEED_DISTRICT.nameAr,
      isActive: true,
    },
  });
}

async function ensureCoastalArea(prisma: PrismaClient): Promise<void> {
  const country = await prisma.country.findUnique({ where: { code: SEED_COASTAL_AREA.countryCode } });
  if (!country) {
    return;
  }

  const city = await prisma.city.upsert({
    where: { countryId_slug: { countryId: country.id, slug: SEED_COASTAL_AREA.citySlug } },
    update: {
      nameEn: SEED_COASTAL_AREA.cityNameEn,
      nameAr: SEED_COASTAL_AREA.cityNameAr,
      isActive: true,
    },
    create: {
      countryId: country.id,
      slug: SEED_COASTAL_AREA.citySlug,
      nameEn: SEED_COASTAL_AREA.cityNameEn,
      nameAr: SEED_COASTAL_AREA.cityNameAr,
      isActive: true,
    },
  });

  await prisma.area.upsert({
    where: { cityId_slug: { cityId: city.id, slug: SEED_COASTAL_AREA.areaSlug } },
    update: {
      nameEn: SEED_COASTAL_AREA.areaNameEn,
      nameAr: SEED_COASTAL_AREA.areaNameAr,
      isActive: true,
    },
    create: {
      cityId: city.id,
      slug: SEED_COASTAL_AREA.areaSlug,
      nameEn: SEED_COASTAL_AREA.areaNameEn,
      nameAr: SEED_COASTAL_AREA.areaNameAr,
      isActive: true,
    },
  });
}

type LookupMaps = {
  propertyTypes: Map<string, string>;
  transactionTypes: Map<string, string>;
  legalStatuses: Map<string, string>;
  features: Map<string, string>;
  views: Map<string, string>;
  areas: Map<string, string>;
  districts: Map<string, string>;
  compounds: Map<string, string>;
};

async function loadLookups(prisma: PrismaClient): Promise<LookupMaps> {
  const [propertyTypes, transactionTypes, legalStatuses, features, views, areas, districts, compounds] =
    await Promise.all([
      prisma.propertyType.findMany(),
      prisma.transactionType.findMany(),
      prisma.propertyLegalStatus.findMany(),
      prisma.feature.findMany(),
      prisma.propertyView.findMany(),
      prisma.area.findMany(),
      prisma.district.findMany(),
      prisma.compound.findMany(),
    ]);

  return {
    propertyTypes: new Map(propertyTypes.map((row) => [row.code, row.id])),
    transactionTypes: new Map(transactionTypes.map((row) => [row.code, row.id])),
    legalStatuses: new Map(legalStatuses.map((row) => [row.code, row.id])),
    features: new Map(features.map((row) => [row.code, row.id])),
    views: new Map(views.map((row) => [row.code, row.id])),
    areas: new Map(areas.map((row) => [row.slug, row.id])),
    districts: new Map(districts.map((row) => [row.slug, row.id])),
    compounds: new Map(compounds.map((row) => [row.slug, row.id])),
  };
}

async function seedOneProperty(
  prisma: PrismaClient,
  seed: SeedProperty,
  ownerId: string,
  adminId: string | null,
  lookups: LookupMaps,
): Promise<void> {
  const reviewedById = seed.reviewedByAdmin ? adminId : null;

  const data = {
    ownerId,
    propertyTypeId: seed.propertyTypeCode ? lookups.propertyTypes.get(seed.propertyTypeCode) ?? null : null,
    transactionTypeId: seed.transactionTypeCode
      ? lookups.transactionTypes.get(seed.transactionTypeCode) ?? null
      : null,
    areaId: seed.areaSlug ? lookups.areas.get(seed.areaSlug) ?? null : null,
    districtId: seed.districtSlug ? lookups.districts.get(seed.districtSlug) ?? null : null,
    compoundId: seed.compoundSlug ? lookups.compounds.get(seed.compoundSlug) ?? null : null,
    legalStatusId: seed.legalStatusCode ? lookups.legalStatuses.get(seed.legalStatusCode) ?? null : null,
    title: seed.title,
    description: seed.description ?? null,
    referenceNumber: seed.referenceNumber,
    status: seed.status,
    price: seed.price ?? null,
    paymentType: seed.paymentType ?? null,
    downPayment: seed.downPayment ?? null,
    installmentYears: seed.installmentYears ?? null,
    monthlyInstallment: seed.monthlyInstallment ?? null,
    furnished: seed.furnished ?? null,
    rentPeriod: seed.rentPeriod ?? null,
    finishingType: seed.finishingType ?? null,
    bedrooms: seed.bedrooms ?? null,
    bathrooms: seed.bathrooms ?? null,
    areaSqm: seed.areaSqm ?? null,
    floor: seed.floor ?? null,
    yearBuilt: seed.yearBuilt ?? null,
    address: seed.address ?? null,
    latitude: seed.latitude ?? null,
    longitude: seed.longitude ?? null,
    submittedAt: seed.submittedAt ?? null,
    reviewedAt: seed.reviewedAt ?? null,
    reviewedById,
    publishedAt: seed.publishedAt ?? null,
    archivedAt: seed.archivedAt ?? null,
    rejectedReason: seed.rejectedReason ?? null,
  };

  const property = await prisma.property.upsert({
    where: { slug: seed.slug },
    update: data,
    create: { ...data, slug: seed.slug },
  });

  for (const featureCode of seed.featureCodes ?? []) {
    const featureId = lookups.features.get(featureCode);
    if (!featureId) {
      throw new Error(`Missing feature seed for code: ${featureCode}`);
    }
    await prisma.propertyFeature.upsert({
      where: { propertyId_featureId: { propertyId: property.id, featureId } },
      update: {},
      create: { propertyId: property.id, featureId },
    });
  }

  for (const viewCode of seed.viewCodes ?? []) {
    const viewId = lookups.views.get(viewCode);
    if (!viewId) {
      throw new Error(`Missing property view seed for code: ${viewCode}`);
    }
    await prisma.propertyViewAssignment.upsert({
      where: { propertyId_viewId: { propertyId: property.id, viewId } },
      update: {},
      create: { propertyId: property.id, viewId },
    });
  }

  if (seed.contact) {
    await prisma.propertyContact.upsert({
      where: { propertyId: property.id },
      update: {
        source: seed.contact.source,
        contactType: seed.contact.contactType,
        name: seed.contact.name ?? null,
        phone: seed.contact.phone ?? null,
        whatsapp: seed.contact.whatsapp ?? null,
        email: seed.contact.email ?? null,
      },
      create: {
        propertyId: property.id,
        source: seed.contact.source,
        contactType: seed.contact.contactType,
        name: seed.contact.name ?? null,
        phone: seed.contact.phone ?? null,
        whatsapp: seed.contact.whatsapp ?? null,
        email: seed.contact.email ?? null,
      },
    });
  }

  if (seed.images?.length) {
    const mediaAssetIds: string[] = [];
    for (const image of seed.images) {
      const mediaAsset = await prisma.mediaAsset.upsert({
        where: { publicId: image.publicId },
        update: { url: image.url, uploadedById: ownerId, folder: 'properties' },
        create: {
          url: image.url,
          publicId: image.publicId,
          uploadedById: ownerId,
          folder: 'properties',
          mimeType: 'image/jpeg',
        },
      });
      mediaAssetIds.push(mediaAsset.id);
    }

    // Re-link the gallery from scratch so re-running the seed stays idempotent
    // even if image order/primary flags changed.
    await prisma.propertyImage.deleteMany({ where: { propertyId: property.id } });
    await prisma.propertyImage.createMany({
      data: seed.images.map((image, index) => ({
        propertyId: property.id,
        mediaAssetId: mediaAssetIds[index],
        sortOrder: index,
        isPrimary: Boolean(image.isPrimary),
      })),
    });
  }
}

export async function seedProperties(prisma: PrismaClient): Promise<void> {
  const ownerId = await ensureSeedOwner(prisma);
  await ensureSeedDistrict(prisma);
  await ensureCoastalArea(prisma);

  const admin = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });
  const lookups = await loadLookups(prisma);

  for (const seed of SEED_PROPERTIES) {
    await seedOneProperty(prisma, seed, ownerId, admin?.id ?? null, lookups);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  properties: ${SEED_PROPERTIES.length} upserted`);
  }
}
