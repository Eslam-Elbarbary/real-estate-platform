import * as bcrypt from 'bcrypt';
import { CompanyMemberRole, PrismaClient } from '../generated/prisma-client';
import { SEED_OWNER_EMAIL } from './properties.seed';

/** Same cost factor as AuthService password hashing / the other seed users. */
const BCRYPT_ROUNDS = 12;

const SEED_AGENT = {
  email: 'agent.seed@dashboard.com',
  password: 'Agent@123456',
  firstName: 'Seed',
  lastName: 'Agent',
  phone: '+201000000008',
} as const;

const SEED_COMPANY = {
  slug: 'prime-realty-partners',
  nameEn: 'Prime Realty Partners',
  nameAr: 'برايم ريالتي بارتنرز',
  description: 'Seed real-estate brokerage demonstrating the Company/CompanyMember model.',
  phone: '+201000000009',
  email: 'contact@prime-realty-partners.example.com',
  website: 'https://prime-realty-partners.example.com',
} as const;

/** Reassigned to the demo company below, to prove Property.companyId wiring end-to-end. */
const SEED_COMPANY_PROPERTY_SLUG = 'seed-new-cairo-twin-house';

async function ensureSeedAgent(prisma: PrismaClient): Promise<string> {
  const passwordHash = await bcrypt.hash(SEED_AGENT.password, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: SEED_AGENT.email },
    update: {
      passwordHash,
      firstName: SEED_AGENT.firstName,
      lastName: SEED_AGENT.lastName,
      phone: SEED_AGENT.phone,
      isEmailVerified: true,
      isActive: true,
    },
    create: {
      email: SEED_AGENT.email,
      passwordHash,
      firstName: SEED_AGENT.firstName,
      lastName: SEED_AGENT.lastName,
      phone: SEED_AGENT.phone,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const role = await prisma.role.findUniqueOrThrow({ where: { code: 'USER' } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  return user.id;
}

export async function seedCompanies(prisma: PrismaClient): Promise<void> {
  // The existing seed property owner doubles as the agency OWNER — demonstrates
  // that an individual can both list personally and run a company.
  const owner = await prisma.user.findUniqueOrThrow({ where: { email: SEED_OWNER_EMAIL } });
  const agentId = await ensureSeedAgent(prisma);

  const company = await prisma.company.upsert({
    where: { slug: SEED_COMPANY.slug },
    update: {
      nameEn: SEED_COMPANY.nameEn,
      nameAr: SEED_COMPANY.nameAr,
      description: SEED_COMPANY.description,
      phone: SEED_COMPANY.phone,
      email: SEED_COMPANY.email,
      website: SEED_COMPANY.website,
      isActive: true,
    },
    create: {
      slug: SEED_COMPANY.slug,
      nameEn: SEED_COMPANY.nameEn,
      nameAr: SEED_COMPANY.nameAr,
      description: SEED_COMPANY.description,
      phone: SEED_COMPANY.phone,
      email: SEED_COMPANY.email,
      website: SEED_COMPANY.website,
      isActive: true,
    },
  });

  const memberships: Array<{ userId: string; role: CompanyMemberRole }> = [
    { userId: owner.id, role: CompanyMemberRole.OWNER },
    { userId: agentId, role: CompanyMemberRole.AGENT },
  ];

  for (const membership of memberships) {
    await prisma.companyMember.upsert({
      where: {
        companyId_userId: { companyId: company.id, userId: membership.userId },
      },
      update: { role: membership.role },
      create: {
        companyId: company.id,
        userId: membership.userId,
        role: membership.role,
      },
    });
  }

  const property = await prisma.property.findUnique({
    where: { slug: SEED_COMPANY_PROPERTY_SLUG },
  });
  if (property) {
    await prisma.property.update({
      where: { id: property.id },
      data: { companyId: company.id },
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  companies: 1 company (${memberships.length} members) upserted`);
  }
}
