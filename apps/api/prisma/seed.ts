import { PlanStatus, PrismaClient, RoleCode } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES: Array<{ code: RoleCode; name: string; description: string }> = [
  { code: RoleCode.USER, name: 'User', description: 'Standard marketplace user' },
  { code: RoleCode.BROKER, name: 'Broker', description: 'Licensed broker / agent' },
  { code: RoleCode.DEVELOPER, name: 'Developer', description: 'Real estate developer account' },
  { code: RoleCode.ADMIN, name: 'Admin', description: 'Platform administrator' },
  { code: RoleCode.MODERATOR, name: 'Moderator', description: 'Content and listing moderator' },
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
      update: { name: role.name, description: role.description },
      create: role,
    });
  }
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

async function main() {
  console.log('Seeding reference data…');
  await seedRoles();
  await seedTransactionTypes();
  await seedPropertyTypes();
  await seedPlans();
  console.log('Seed complete (roles, transaction types, property types, plans).');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
