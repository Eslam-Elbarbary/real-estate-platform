import {
  InvoiceStatus,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  SubscriptionStatus,
} from '../generated/prisma-client';

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);

type BillingSeed = {
  propertySlug: string;
  planCode: string;
  invoiceNumber: string;
  subscriptionStatus: SubscriptionStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  paymentProvider: PaymentProvider;
  paymentStatus: PaymentStatus;
  paidAt: Date | null;
  invoiceStatus: InvoiceStatus;
  issuedAt: Date | null;
};

/** One entry per SubscriptionStatus / PaymentStatus / InvoiceStatus so every enum value is exercised. */
const BILLING_SEEDS: BillingSeed[] = [
  {
    propertySlug: 'seed-mountain-view-icity-apartment-201',
    planCode: 'FEATURED',
    invoiceNumber: 'INV-SEED-0001',
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    startsAt: daysAgo(29),
    endsAt: daysFromNow(1),
    paymentProvider: PaymentProvider.PAYMOB,
    paymentStatus: PaymentStatus.SUCCESS,
    paidAt: daysAgo(29),
    invoiceStatus: InvoiceStatus.PAID,
    issuedAt: daysAgo(29),
  },
  {
    propertySlug: 'seed-madinaty-standalone-villa',
    planCode: 'PREMIUM',
    invoiceNumber: 'INV-SEED-0002',
    subscriptionStatus: SubscriptionStatus.EXPIRED,
    startsAt: daysAgo(90),
    endsAt: daysAgo(60),
    paymentProvider: PaymentProvider.STRIPE,
    paymentStatus: PaymentStatus.REFUNDED,
    paidAt: daysAgo(90),
    invoiceStatus: InvoiceStatus.VOID,
    issuedAt: daysAgo(90),
  },
  {
    propertySlug: 'seed-duplex-pending-payment',
    planCode: 'BASIC',
    invoiceNumber: 'INV-SEED-0003',
    subscriptionStatus: SubscriptionStatus.PENDING,
    startsAt: null,
    endsAt: null,
    paymentProvider: PaymentProvider.MOCK,
    paymentStatus: PaymentStatus.PENDING,
    paidAt: null,
    invoiceStatus: InvoiceStatus.DRAFT,
    issuedAt: null,
  },
  {
    propertySlug: 'seed-shop-archived',
    planCode: 'PREMIUM',
    invoiceNumber: 'INV-SEED-0004',
    subscriptionStatus: SubscriptionStatus.CANCELLED,
    startsAt: daysAgo(120),
    endsAt: daysAgo(90),
    paymentProvider: PaymentProvider.PAYMOB,
    paymentStatus: PaymentStatus.FAILED,
    paidAt: null,
    invoiceStatus: InvoiceStatus.ISSUED,
    issuedAt: daysAgo(120),
  },
];

export async function seedBilling(prisma: PrismaClient): Promise<void> {
  for (const seed of BILLING_SEEDS) {
    const property = await prisma.property.findUnique({ where: { slug: seed.propertySlug } });
    if (!property) {
      throw new Error(`Missing seeded property for slug: ${seed.propertySlug}`);
    }

    const plan = await prisma.plan.findUniqueOrThrow({ where: { code: seed.planCode } });

    const existingSubscription = await prisma.subscription.findFirst({
      where: { propertyId: property.id, planId: plan.id },
    });

    const subscriptionData = {
      propertyId: property.id,
      planId: plan.id,
      status: seed.subscriptionStatus,
      priceAtPurchase: plan.price,
      durationDaysAtPurchase: plan.durationDays,
      startsAt: seed.startsAt,
      endsAt: seed.endsAt,
    };

    const subscription = existingSubscription
      ? await prisma.subscription.update({ where: { id: existingSubscription.id }, data: subscriptionData })
      : await prisma.subscription.create({ data: subscriptionData });

    const existingPayment = await prisma.payment.findFirst({ where: { subscriptionId: subscription.id } });

    const paymentData = {
      subscriptionId: subscription.id,
      provider: seed.paymentProvider,
      providerRef: `seed-${seed.invoiceNumber.toLowerCase()}`,
      amount: plan.price,
      status: seed.paymentStatus,
      paidAt: seed.paidAt,
    };

    const payment = existingPayment
      ? await prisma.payment.update({ where: { id: existingPayment.id }, data: paymentData })
      : await prisma.payment.create({ data: paymentData });

    await prisma.invoice.upsert({
      where: { subscriptionId: subscription.id },
      update: {
        number: seed.invoiceNumber,
        paymentId: payment.id,
        amount: plan.price,
        status: seed.invoiceStatus,
        issuedAt: seed.issuedAt,
      },
      create: {
        number: seed.invoiceNumber,
        subscriptionId: subscription.id,
        paymentId: payment.id,
        amount: plan.price,
        status: seed.invoiceStatus,
        issuedAt: seed.issuedAt,
      },
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  billing: ${BILLING_SEEDS.length} subscriptions + payments + invoices upserted`);
  }
}
