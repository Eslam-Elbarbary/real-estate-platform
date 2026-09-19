import * as bcrypt from 'bcrypt';
import { DeveloperMemberRole, PrismaClient } from '../generated/prisma-client';
import { SEED_OWNER_EMAIL } from './properties.seed';

/** Same cost factor as AuthService password hashing / the other seed users. */
const BCRYPT_ROUNDS = 12;

/** Reuses the developer created by seedDevelopersAndCompounds() in seed.ts. */
const SEED_DEVELOPER_SLUG = 'prime-urban';

const SEED_STAFF = {
  email: 'staff.seed@dashboard.com',
  password: 'Staff@123456',
  firstName: 'Seed',
  lastName: 'Staff',
  phone: '+201000000010',
} as const;

async function ensureSeedStaff(prisma: PrismaClient): Promise<string> {
  const passwordHash = await bcrypt.hash(SEED_STAFF.password, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: SEED_STAFF.email },
    update: {
      passwordHash,
      firstName: SEED_STAFF.firstName,
      lastName: SEED_STAFF.lastName,
      phone: SEED_STAFF.phone,
      isEmailVerified: true,
      isActive: true,
    },
    create: {
      email: SEED_STAFF.email,
      passwordHash,
      firstName: SEED_STAFF.firstName,
      lastName: SEED_STAFF.lastName,
      phone: SEED_STAFF.phone,
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

/**
 * Attaches a User -> Developer membership to the already-seeded 'prime-urban'
 * developer (created by seedDevelopersAndCompounds), to prove the DeveloperMember
 * model end-to-end. The existing seed owner doubles as the developer OWNER —
 * demonstrating a user who both owns a company and runs a compound developer account.
 */
export async function seedDeveloperAccounts(prisma: PrismaClient): Promise<void> {
  const developer = await prisma.developer.findUnique({
    where: { slug: SEED_DEVELOPER_SLUG },
  });
  if (!developer) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('  developer accounts: skipped (seed developer not found)');
    }
    return;
  }

  const owner = await prisma.user.findUniqueOrThrow({ where: { email: SEED_OWNER_EMAIL } });
  const staffId = await ensureSeedStaff(prisma);

  const memberships: Array<{ userId: string; role: DeveloperMemberRole }> = [
    { userId: owner.id, role: DeveloperMemberRole.OWNER },
    { userId: staffId, role: DeveloperMemberRole.STAFF },
  ];

  for (const membership of memberships) {
    await prisma.developerMember.upsert({
      where: {
        developerId_userId: { developerId: developer.id, userId: membership.userId },
      },
      update: { role: membership.role },
      create: {
        developerId: developer.id,
        userId: membership.userId,
        role: membership.role,
      },
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  developer accounts: 1 developer account (${memberships.length} members) upserted`);
  }
}
