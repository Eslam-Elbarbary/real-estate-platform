import {
  LeadStatus,
  LeadType,
  NotificationType,
  PrismaClient,
} from '../generated/prisma-client';
import { SEED_OWNER_EMAIL } from './properties.seed';
import type { DemoUserKey } from './demo-users.seed';

/** Email of the admin user created in seed.ts — used as a notification recipient below. */
const SUPER_ADMIN_EMAIL = 'admin@dashboard.com';

const PROPERTY_SLUGS = {
  apartment: 'seed-mountain-view-icity-apartment-201',
  villa: 'seed-madinaty-standalone-villa',
  rentApartment: 'seed-new-cairo-rent-apartment',
  chalet: 'seed-north-coast-chalet-daily-rent',
  twinHouse: 'seed-new-cairo-twin-house',
  clinic: 'seed-new-cairo-clinic-yearly-rent',
  office: 'seed-office-rejected',
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);

async function seedFavorites(
  prisma: PrismaClient,
  userIds: Record<DemoUserKey, string>,
  propertyIds: Record<keyof typeof PROPERTY_SLUGS, string>,
): Promise<void> {
  const favorites: Array<{ userId: string; propertyId: string }> = [
    { userId: userIds.buyerOne, propertyId: propertyIds.apartment },
    { userId: userIds.buyerOne, propertyId: propertyIds.villa },
    { userId: userIds.buyerTwo, propertyId: propertyIds.chalet },
  ];

  for (const favorite of favorites) {
    await prisma.favorite.upsert({
      where: { userId_propertyId: favorite },
      update: {},
      create: favorite,
    });
  }
}

type LeadSeed = {
  propertyKey: keyof typeof PROPERTY_SLUGS;
  buyerKey: DemoUserKey;
  type: LeadType;
  status: LeadStatus;
  message: string;
};

const LEADS: LeadSeed[] = [
  {
    propertyKey: 'apartment',
    buyerKey: 'buyerOne',
    type: LeadType.PHONE,
    status: LeadStatus.NEW,
    message: 'Interested in a viewing this weekend.',
  },
  {
    propertyKey: 'villa',
    buyerKey: 'buyerTwo',
    type: LeadType.WHATSAPP,
    status: LeadStatus.CONTACTED,
    message: 'Is the price negotiable?',
  },
  {
    propertyKey: 'rentApartment',
    buyerKey: 'buyerOne',
    type: LeadType.CONTACT_FORM,
    status: LeadStatus.FOLLOW_UP,
    message: 'Can I move in next month?',
  },
  {
    propertyKey: 'chalet',
    buyerKey: 'buyerTwo',
    type: LeadType.PHONE,
    status: LeadStatus.INTERESTED,
    message: 'Looking for a week in August, is it available?',
  },
  {
    propertyKey: 'twinHouse',
    buyerKey: 'buyerOne',
    type: LeadType.WHATSAPP,
    status: LeadStatus.CLOSED,
    message: 'Deal closed after a site visit.',
  },
  {
    propertyKey: 'clinic',
    buyerKey: 'buyerTwo',
    type: LeadType.CONTACT_FORM,
    status: LeadStatus.REJECTED,
    message: 'Location no longer suitable for our clinic.',
  },
];

async function seedLeads(
  prisma: PrismaClient,
  ownerId: string,
  userIds: Record<DemoUserKey, string>,
  propertyIds: Record<keyof typeof PROPERTY_SLUGS, string>,
): Promise<void> {
  for (const lead of LEADS) {
    const propertyId = propertyIds[lead.propertyKey];
    const buyerId = userIds[lead.buyerKey];

    const existing = await prisma.lead.findFirst({
      where: { propertyId, buyerId, type: lead.type },
    });

    const data = {
      propertyId,
      buyerId,
      sellerId: ownerId,
      type: lead.type,
      status: lead.status,
      message: lead.message,
    };

    if (existing) {
      await prisma.lead.update({ where: { id: existing.id }, data });
    } else {
      await prisma.lead.create({ data });
    }
  }
}

async function seedPropertyNotes(
  prisma: PrismaClient,
  ownerId: string,
  adminId: string | null,
  propertyIds: Record<keyof typeof PROPERTY_SLUGS, string>,
): Promise<void> {
  const notes: Array<{ userId: string; propertyId: string; content: string }> = [
    {
      userId: ownerId,
      propertyId: propertyIds.apartment,
      content: 'Remember to update the gallery photos before winter.',
    },
  ];

  if (adminId) {
    notes.push({
      userId: adminId,
      propertyId: propertyIds.office,
      content: 'Waiting on ownership documents before this can be reconsidered.',
    });
  }

  for (const note of notes) {
    const existing = await prisma.propertyNote.findFirst({
      where: { userId: note.userId, propertyId: note.propertyId },
    });

    if (existing) {
      await prisma.propertyNote.update({ where: { id: existing.id }, data: { content: note.content } });
    } else {
      await prisma.propertyNote.create({ data: note });
    }
  }
}

type NotificationSeed = {
  userKey: 'buyerOne' | 'owner';
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
};

const NOTIFICATIONS: NotificationSeed[] = [
  {
    userKey: 'buyerOne',
    type: NotificationType.SYSTEM,
    title: 'Welcome to the platform',
    body: 'Thanks for joining — start by saving your first search.',
    isRead: true,
  },
  {
    userKey: 'owner',
    type: NotificationType.LEAD,
    title: 'New lead on your apartment listing',
    body: 'Ahmed Hassan is interested in Modern 3BR apartment in Mountain View iCity.',
    isRead: false,
  },
  {
    userKey: 'buyerOne',
    type: NotificationType.PROPERTY,
    title: 'Price drop on a saved property',
    body: 'A property in your favorites just lowered its price.',
    isRead: false,
  },
  {
    userKey: 'owner',
    type: NotificationType.SUBSCRIPTION,
    title: 'Your listing subscription is expiring soon',
    body: 'Renew your Premium plan to keep your villa listing boosted.',
    isRead: false,
  },
  {
    userKey: 'owner',
    type: NotificationType.PAYMENT,
    title: 'Payment received',
    body: 'We received your payment for the Featured plan.',
    isRead: true,
  },
];

async function seedNotifications(
  prisma: PrismaClient,
  ownerId: string,
  userIds: Record<DemoUserKey, string>,
): Promise<void> {
  const recipients: Record<'buyerOne' | 'owner', string> = {
    buyerOne: userIds.buyerOne,
    owner: ownerId,
  };

  for (const notification of NOTIFICATIONS) {
    const userId = recipients[notification.userKey];

    const existing = await prisma.notification.findFirst({
      where: { userId, type: notification.type, title: notification.title },
    });

    const data = {
      userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      readAt: notification.isRead ? daysAgo(1) : null,
    };

    if (existing) {
      await prisma.notification.update({ where: { id: existing.id }, data });
    } else {
      await prisma.notification.create({ data });
    }
  }
}

async function seedSavedSearchAlerts(prisma: PrismaClient, userIds: Record<DemoUserKey, string>): Promise<void> {
  const alerts: Array<{ userId: string; name: string; filters: Record<string, unknown> }> = [
    {
      userId: userIds.buyerOne,
      name: '3BR apartments in New Cairo under 5M',
      filters: { propertyType: 'APARTMENT', area: 'new-cairo', bedrooms: 3, maxPrice: 5_000_000 },
    },
    {
      userId: userIds.buyerTwo,
      name: 'Chalets for rent on the North Coast',
      filters: { propertyType: 'CHALET', area: 'north-coast', transactionType: 'RENT' },
    },
  ];

  for (const alert of alerts) {
    const existing = await prisma.savedSearchAlert.findFirst({
      where: { userId: alert.userId, name: alert.name },
    });

    if (existing) {
      await prisma.savedSearchAlert.update({ where: { id: existing.id }, data: { filters: alert.filters } });
    } else {
      await prisma.savedSearchAlert.create({
        data: { userId: alert.userId, name: alert.name, filters: alert.filters },
      });
    }
  }
}

export async function seedEngagement(
  prisma: PrismaClient,
  userIds: Record<DemoUserKey, string>,
): Promise<void> {
  const owner = await prisma.user.findUniqueOrThrow({ where: { email: SEED_OWNER_EMAIL } });
  const admin = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });

  const properties = await prisma.property.findMany({
    where: { slug: { in: Object.values(PROPERTY_SLUGS) } },
    select: { id: true, slug: true },
  });
  const propertyIdBySlug = new Map(properties.map((p) => [p.slug, p.id]));

  const propertyIds = Object.fromEntries(
    Object.entries(PROPERTY_SLUGS).map(([key, slug]) => {
      const id = propertyIdBySlug.get(slug);
      if (!id) {
        throw new Error(`Missing seeded property for slug: ${slug}`);
      }
      return [key, id];
    }),
  ) as Record<keyof typeof PROPERTY_SLUGS, string>;

  await seedFavorites(prisma, userIds, propertyIds);
  await seedLeads(prisma, owner.id, userIds, propertyIds);
  await seedPropertyNotes(prisma, owner.id, admin?.id ?? null, propertyIds);
  await seedNotifications(prisma, owner.id, userIds);
  await seedSavedSearchAlerts(prisma, userIds);

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `  engagement: 3 favorites, ${LEADS.length} leads, notes, ${NOTIFICATIONS.length} notifications, 2 saved search alerts`,
    );
  }
}
