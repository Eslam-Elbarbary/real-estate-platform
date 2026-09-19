import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma-client';

/** Same cost factor as AuthService password hashing / the other seed users. */
const BCRYPT_ROUNDS = 12;

export type DemoUserKey = 'developer' | 'moderator' | 'buyerOne' | 'buyerTwo';

type DemoUserSeed = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleCode: string;
};

/**
 * A small pool of non-admin, non-owner accounts so engagement data (favorites, leads, notes,
 * notifications, saved search alerts) has realistic actors distinct from the property owner —
 * and so every Role in the system has at least one real user assigned to it.
 */
const DEMO_USERS: Record<DemoUserKey, DemoUserSeed> = {
  developer: {
    email: 'developer.seed@dashboard.com',
    password: 'Developer@123456',
    firstName: 'Seed',
    lastName: 'Developer',
    phone: '+201000000004',
    roleCode: 'DEVELOPER',
  },
  moderator: {
    email: 'moderator.seed@dashboard.com',
    password: 'Moderator@123456',
    firstName: 'Seed',
    lastName: 'Moderator',
    phone: '+201000000005',
    roleCode: 'MODERATOR',
  },
  buyerOne: {
    email: 'buyer1.seed@dashboard.com',
    password: 'Buyer@123456',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    phone: '+201000000006',
    roleCode: 'USER',
  },
  buyerTwo: {
    email: 'buyer2.seed@dashboard.com',
    password: 'Buyer@123456',
    firstName: 'Mona',
    lastName: 'Farouk',
    phone: '+201000000007',
    roleCode: 'USER',
  },
};

export async function seedDemoUsers(prisma: PrismaClient): Promise<Record<DemoUserKey, string>> {
  const ids = {} as Record<DemoUserKey, string>;

  for (const [key, seed] of Object.entries(DEMO_USERS) as [DemoUserKey, DemoUserSeed][]) {
    const passwordHash = await bcrypt.hash(seed.password, BCRYPT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        passwordHash,
        firstName: seed.firstName,
        lastName: seed.lastName,
        phone: seed.phone,
        isEmailVerified: true,
        isActive: true,
      },
      create: {
        email: seed.email,
        passwordHash,
        firstName: seed.firstName,
        lastName: seed.lastName,
        phone: seed.phone,
        isEmailVerified: true,
        isActive: true,
      },
    });

    const role = await prisma.role.findUniqueOrThrow({ where: { code: seed.roleCode } });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });

    ids[key] = user.id;
  }

  return ids;
}
