import { PrismaPg } from '@prisma/adapter-pg';
import { PlanStatus, PrismaClient } from './generated/prisma-client';
import * as bcrypt from 'bcrypt';
import { seedPermissionsAndRoleMappings } from './seeds/permissions.seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Same cost factor as AuthService password hashing. */
const BCRYPT_ROUNDS = 12;

const SUPER_ADMIN_SEED = {
  email: 'admin@dashboard.com',
  password: 'Admin@123456',
  firstName: 'Super',
  lastName: 'Admin',
} as const;

type RoleSeed = {
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

const ROLES: RoleSeed[] = [
  {
    code: 'USER',
    name: 'User',
    description: 'Standard marketplace user',
    isSystem: true,
    isAdmin: false,
    isSuperAdmin: false,
  },
  {
    code: 'BROKER',
    name: 'Broker',
    description: 'Licensed broker / agent',
    isSystem: true,
    isAdmin: false,
    isSuperAdmin: false,
  },
  {
    code: 'DEVELOPER',
    name: 'Developer',
    description: 'Real estate developer account',
    isSystem: true,
    isAdmin: false,
    isSuperAdmin: false,
  },
  {
    code: 'ADMIN',
    name: 'Admin',
    description: 'Platform administrator',
    isSystem: true,
    isAdmin: true,
    isSuperAdmin: false,
  },
  {
    code: 'MODERATOR',
    name: 'Moderator',
    description: 'Content and listing moderator',
    isSystem: true,
    isAdmin: true,
    isSuperAdmin: false,
  },
  {
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Full platform administrator',
    isSystem: true,
    isAdmin: true,
    isSuperAdmin: true,
  },
];

const TRANSACTION_TYPES = [
  { code: 'SALE', nameEn: 'Sale', nameAr: 'بيع' },
  { code: 'RENT', nameEn: 'Rent', nameAr: 'إيجار' },
];

const PROPERTY_TYPES = [
  { code: 'APARTMENT', nameEn: 'Apartment', nameAr: 'شقة', sortOrder: 1 },
  { code: 'VILLA', nameEn: 'Villa', nameAr: 'فيلا', sortOrder: 2 },
  { code: 'CHALET', nameEn: 'Chalet', nameAr: 'شاليه', sortOrder: 3 },
  { code: 'TWIN_HOUSE', nameEn: 'Twin House', nameAr: 'توين هاوس', sortOrder: 4 },
  { code: 'TOWN_HOUSE', nameEn: 'Town House', nameAr: 'تاون هاوس', sortOrder: 5 },
  { code: 'DUPLEX', nameEn: 'Duplex', nameAr: 'دوبلكس', sortOrder: 6 },
  { code: 'PENTHOUSE', nameEn: 'Penthouse', nameAr: 'بنتهاوس', sortOrder: 7 },
  { code: 'OFFICE', nameEn: 'Office', nameAr: 'مكتب', sortOrder: 8 },
  { code: 'SHOP', nameEn: 'Shop', nameAr: 'محل', sortOrder: 9 },
  { code: 'CLINIC', nameEn: 'Clinic', nameAr: 'عيادة', sortOrder: 10 },
  { code: 'LAND', nameEn: 'Land', nameAr: 'أرض', sortOrder: 11 },
];

const FEATURES = [
  { code: 'PARKING', nameEn: 'Parking', nameAr: 'موقف سيارات', category: 'amenities' },
  { code: 'ELEVATOR', nameEn: 'Elevator', nameAr: 'مصعد', category: 'amenities' },
  { code: 'BALCONY', nameEn: 'Balcony', nameAr: 'شرفة', category: 'amenities' },
  { code: 'SECURITY', nameEn: 'Security', nameAr: 'أمن', category: 'amenities' },
  { code: 'GARDEN', nameEn: 'Garden', nameAr: 'حديقة', category: 'outdoor' },
  { code: 'POOL', nameEn: 'Pool', nameAr: 'حمام سباحة', category: 'outdoor' },
  { code: 'GYM', nameEn: 'Gym', nameAr: 'جيم', category: 'amenities' },
  { code: 'AC', nameEn: 'AC', nameAr: 'تكييف', category: 'indoor' },
  { code: 'STORAGE', nameEn: 'Storage', nameAr: 'مخزن', category: 'amenities' },
];

const PLANS: Array<{
  code: string;
  name: string;
  price: number;
  durationDays: number;
  features: unknown;
  status: PlanStatus;
}> = [
  {
    code: 'BASIC',
    name: 'Basic',
    price: 0,
    durationDays: 30,
    status: PlanStatus.ACTIVE,
    features: {
      listingLimit: 1,
      featuredBoost: false,
      description: 'Entry listing plan',
    },
  },
  {
    code: 'PREMIUM',
    name: 'Premium',
    price: 499,
    durationDays: 30,
    status: PlanStatus.ACTIVE,
    features: {
      listingLimit: 5,
      featuredBoost: false,
      description: 'Higher visibility listing plan',
    },
  },
  {
    code: 'FEATURED',
    name: 'Featured',
    price: 999,
    durationDays: 30,
    status: PlanStatus.ACTIVE,
    features: {
      listingLimit: 10,
      featuredBoost: true,
      description: 'Featured placement listing plan',
    },
  },
];

async function seedRoles() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        isAdmin: role.isAdmin,
        isSuperAdmin: role.isSuperAdmin,
      },
      create: role,
    });
  }
}

async function seedSuperAdmin() {
  const passwordHash = await bcrypt.hash(SUPER_ADMIN_SEED.password, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_SEED.email },
    update: {
      passwordHash,
      firstName: SUPER_ADMIN_SEED.firstName,
      lastName: SUPER_ADMIN_SEED.lastName,
      isEmailVerified: true,
      isActive: true,
    },
    create: {
      email: SUPER_ADMIN_SEED.email,
      passwordHash,
      firstName: SUPER_ADMIN_SEED.firstName,
      lastName: SUPER_ADMIN_SEED.lastName,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const role = await prisma.role.findUniqueOrThrow({
    where: { code: 'SUPER_ADMIN' },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: role.id,
    },
  });
}

async function seedTransactionTypes() {
  for (const item of TRANSACTION_TYPES) {
    await prisma.transactionType.upsert({
      where: { code: item.code },
      update: { nameEn: item.nameEn, nameAr: item.nameAr },
      create: item,
    });
  }
}

async function seedPropertyTypes() {
  for (const item of PROPERTY_TYPES) {
    await prisma.propertyType.upsert({
      where: { code: item.code },
      update: {
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        sortOrder: item.sortOrder,
      },
      create: item,
    });
  }
}

async function seedPlans() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        features: plan.features,
        status: plan.status,
      },
      create: plan,
    });
  }
}

async function seedFeatures() {
  for (const item of FEATURES) {
    await prisma.feature.upsert({
      where: { code: item.code },
      update: {
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        category: item.category,
        isActive: true,
      },
      create: item,
    });
  }
}

const SEED_COUNTRY = {
  code: 'EG',
  nameEn: 'Egypt',
  nameAr: 'مصر',
};

const SEED_CITY = {
  slug: 'cairo',
  nameEn: 'Cairo',
  nameAr: 'القاهرة',
};

const SEED_AREA = {
  slug: 'new-cairo',
  nameEn: 'New Cairo',
  nameAr: 'القاهرة الجديدة',
};

const SEED_DEVELOPERS = [
  {
    slug: 'prime-urban',
    nameEn: 'Prime Urban Developments',
    nameAr: 'Prime Urban',
    description: 'Seed developer for local development.',
    logoUrl: 'https://cdn.example.com/developers/prime-urban.svg',
    website: 'https://prime-urban.example.com',
    isActive: true,
  },
  {
    slug: 'nile-horizon',
    nameEn: 'Nile Horizon',
    nameAr: 'Nile Horizon',
    description: 'Secondary seed developer.',
    logoUrl: 'https://cdn.example.com/developers/nile-horizon.svg',
    website: 'https://nile-horizon.example.com',
    isActive: true,
  },
  {
    slug: 'inactive-dev-seed',
    nameEn: 'Inactive Dev Seed',
    nameAr: 'Inactive Dev',
    description: 'Inactive developer for API testing.',
    isActive: false,
  },
] as const;

const SEED_COMPOUNDS = [
  {
    slug: 'mountain-view-icity',
    nameEn: 'Mountain View iCity',
    nameAr: 'Mountain View iCity',
    description: 'Flagship compound in New Cairo.',
    developerSlug: 'prime-urban',
    coverUrl: 'https://cdn.example.com/compounds/mountain-view-icity.jpg',
    isActive: true,
  },
  {
    slug: 'madinaty',
    nameEn: 'Madinaty',
    nameAr: 'مدينتي',
    description: 'Large integrated community compound.',
    developerSlug: 'nile-horizon',
    coverUrl: 'https://cdn.example.com/compounds/madinaty.jpg',
    isActive: true,
  },
  {
    slug: 'inactive-compound-seed',
    nameEn: 'Inactive Compound Seed',
    nameAr: 'Inactive Compound',
    description: 'Inactive compound for API testing.',
    developerSlug: 'prime-urban',
    isActive: false,
  },
] as const;

async function seedLocationsForCompounds() {
  const country = await prisma.country.upsert({
    where: { code: SEED_COUNTRY.code },
    update: {
      nameEn: SEED_COUNTRY.nameEn,
      nameAr: SEED_COUNTRY.nameAr,
      isActive: true,
    },
    create: {
      ...SEED_COUNTRY,
      isActive: true,
    },
  });

  const city = await prisma.city.upsert({
    where: {
      countryId_slug: {
        countryId: country.id,
        slug: SEED_CITY.slug,
      },
    },
    update: {
      nameEn: SEED_CITY.nameEn,
      nameAr: SEED_CITY.nameAr,
      isActive: true,
    },
    create: {
      countryId: country.id,
      ...SEED_CITY,
      isActive: true,
    },
  });

  const area = await prisma.area.upsert({
    where: {
      cityId_slug: {
        cityId: city.id,
        slug: SEED_AREA.slug,
      },
    },
    update: {
      nameEn: SEED_AREA.nameEn,
      nameAr: SEED_AREA.nameAr,
      isActive: true,
    },
    create: {
      cityId: city.id,
      ...SEED_AREA,
      isActive: true,
    },
  });

  return { country, city, area };
}

async function seedDevelopersAndCompounds() {
  const { area } = await seedLocationsForCompounds();

  const developerIds = new Map<string, string>();

  for (const developer of SEED_DEVELOPERS) {
    const row = await prisma.developer.upsert({
      where: { slug: developer.slug },
      update: {
        nameEn: developer.nameEn,
        nameAr: developer.nameAr,
        description: developer.description,
        logoUrl: 'logoUrl' in developer ? developer.logoUrl : null,
        website: 'website' in developer ? developer.website : null,
        isActive: developer.isActive,
      },
      create: {
        slug: developer.slug,
        nameEn: developer.nameEn,
        nameAr: developer.nameAr,
        description: developer.description,
        logoUrl: 'logoUrl' in developer ? developer.logoUrl : null,
        website: 'website' in developer ? developer.website : null,
        isActive: developer.isActive,
      },
    });
    developerIds.set(developer.slug, row.id);
  }

  for (const compound of SEED_COMPOUNDS) {
    const developerId = developerIds.get(compound.developerSlug) ?? null;

    await prisma.compound.upsert({
      where: { slug: compound.slug },
      update: {
        nameEn: compound.nameEn,
        nameAr: compound.nameAr,
        description: compound.description,
        developerId,
        areaId: area.id,
        coverUrl: 'coverUrl' in compound ? compound.coverUrl : null,
        isActive: compound.isActive,
      },
      create: {
        slug: compound.slug,
        nameEn: compound.nameEn,
        nameAr: compound.nameAr,
        description: compound.description,
        developerId,
        areaId: area.id,
        coverUrl: 'coverUrl' in compound ? compound.coverUrl : null,
        isActive: compound.isActive,
      },
    });
  }
}

async function main() {
  console.log('Seeding reference data…');
  await seedRoles();
  await seedPermissionsAndRoleMappings(prisma);
  await seedSuperAdmin();
  await seedTransactionTypes();
  await seedPropertyTypes();
  await seedFeatures();
  await seedPlans();
  await seedDevelopersAndCompounds();
  console.log(
    'Seed complete (roles, permissions, super admin, transaction types, property types, features, plans, developers, compounds).',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
