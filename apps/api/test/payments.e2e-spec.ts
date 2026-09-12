import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PaymentStatus,
  PlanStatus,
  PropertyStatus,
  RoleCode,
  SubscriptionStatus,
} from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Payments (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  const suffix = Date.now().toString(36);
  const planCode = `PAY_PLAN_${suffix}`.slice(0, 40);
  const basicPlanCode = `PAY_BASIC_${suffix}`.slice(0, 40);
  let planId: string;
  let basicPlanId: string;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/payment-e2e-${Date.now()}-${uploadCounter}`;
      return {
        url: `http://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`,
        secureUrl: `https://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`,
        publicId,
        format: 'jpg',
        resourceType: 'image',
        bytes: 128,
        width: 100,
        height: 80,
        provider: 'mock-cloudinary',
      };
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const uniqueEmail = () => {
    emailCounter += 1;
    return `payment.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Eslam',
        lastName: 'Elbarbary',
        email,
        password,
        phone: '+201000000000',
      })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    return { accessToken: login.body.data.accessToken as string };
  };

  const createDraft = async (accessToken: string) => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);
    return res.body.data.id as string;
  };

  const completeDraft = async (accessToken: string, propertyId: string) => {
    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/basic`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Payment Test Flat',
        propertyTypeId,
        transactionTypeId,
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/location`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ areaId })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ price: 2500000 })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'listing.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
  };

  const createPendingSubscription = async (accessToken: string) => {
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);
    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId })
      .expect(201);
    return {
      propertyId,
      subscriptionId: res.body.data.id as string,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MEDIA_PROVIDER)
      .useValue(providerMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(createGlobalValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.role.upsert({
      where: { code: RoleCode.USER },
      update: { name: 'User' },
      create: {
        code: RoleCode.USER,
        name: 'User',
        description: 'Standard marketplace user',
      },
    });

    const propertyType = await prisma.propertyType.upsert({
      where: { code: 'APARTMENT' },
      update: { nameEn: 'Apartment', isActive: true },
      create: { code: 'APARTMENT', nameEn: 'Apartment', isActive: true },
    });
    propertyTypeId = propertyType.id;

    const transactionType = await prisma.transactionType.upsert({
      where: { code: 'SALE' },
      update: { nameEn: 'Sale', isActive: true },
      create: { code: 'SALE', nameEn: 'Sale', isActive: true },
    });
    transactionTypeId = transactionType.id;

    const country = await prisma.country.create({
      data: {
        code: `P${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Pay Land ${suffix}`,
      },
    });
    const city = await prisma.city.create({
      data: {
        countryId: country.id,
        slug: `pay-city-${suffix}`,
        nameEn: `Pay City ${suffix}`,
      },
    });
    const area = await prisma.area.create({
      data: {
        cityId: city.id,
        slug: `pay-area-${suffix}`,
        nameEn: `Pay Area ${suffix}`,
      },
    });
    areaId = area.id;

    const plan = await prisma.plan.create({
      data: {
        code: planCode,
        name: `Pay Plan ${suffix}`,
        price: 499,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 5 },
      },
    });
    planId = plan.id;

    const basicPlan = await prisma.plan.create({
      data: {
        code: basicPlanCode,
        name: `Pay Basic ${suffix}`,
        price: 0,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 1 },
      },
    });
    basicPlanId = basicPlan.id;
  });

  afterAll(async () => {
    await prisma.payment.deleteMany({
      where: { subscription: { planId: { in: [planId, basicPlanId] } } },
    });
    await prisma.subscription.deleteMany({
      where: { planId: { in: [planId, basicPlanId] } },
    });
    await prisma.plan.deleteMany({ where: { id: { in: [planId, basicPlanId] } } });
    await app.close();
  });

  it('completes a successful payment', async () => {
    const { accessToken } = await registerAndLogin();
    const { propertyId, subscriptionId } =
      await createPendingSubscription(accessToken);

    const res = await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      amount: 499,
      provider: 'MOCK',
      status: PaymentStatus.SUCCESS,
    });
    expect(res.body.data.paidAt).toBeTruthy();

    const subscription = await prisma.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
    });
    expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
    expect(subscription.startsAt).toBeTruthy();
    expect(subscription.endsAt).toBeTruthy();

    const property = await prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
    expect(property.status).toBe(PropertyStatus.PENDING_REVIEW);
    expect(property.submittedAt).toBeTruthy();

    const history = await prisma.propertyStatusHistory.findFirst({
      where: {
        propertyId,
        toStatus: PropertyStatus.PENDING_REVIEW,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(history).toBeTruthy();
    expect(history?.fromStatus).toBe(PropertyStatus.PENDING_PAYMENT);
  });

  it('blocks duplicate payment', async () => {
    const { accessToken } = await registerAndLogin();
    const { subscriptionId } = await createPendingSubscription(accessToken);

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const retry = await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const payments = await prisma.payment.findMany({
      where: { subscriptionId, status: PaymentStatus.SUCCESS },
    });
    expect(payments).toHaveLength(1);
    expect(retry.body.data.id).toBe(payments[0].id);
  });

  it('blocks payment while property is still draft', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    const created = await prisma.subscription.create({
      data: {
        propertyId,
        planId,
        status: SubscriptionStatus.PENDING,
        priceAtPurchase: 499,
        durationDaysAtPurchase: 30,
      },
    });

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${created.id}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(409);
  });

  it('blocks payment for Basic subscriptions', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    const created = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: basicPlanId })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${created.body.data.id}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });

  it('blocks wrong owner', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();
    const { subscriptionId } = await createPendingSubscription(
      owner.accessToken,
    );

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/api/v1/subscriptions/${subscriptionId}/payments`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });

  it('requires pending subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const { subscriptionId } = await createPendingSubscription(accessToken);

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.CANCELLED },
    });

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(409);
  });

  it('returns payment history', async () => {
    const { accessToken } = await registerAndLogin();
    const { subscriptionId } = await createPendingSubscription(accessToken);

    const paid = await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/subscriptions/${subscriptionId}/payments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      id: paid.body.data.id,
      amount: 499,
      provider: 'MOCK',
      status: PaymentStatus.SUCCESS,
    });
    expect(res.body.data[0].paidAt).toBeTruthy();
    expect(res.body.data[0].createdAt).toBeTruthy();
  });
});
