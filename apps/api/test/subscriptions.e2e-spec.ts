import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PlanStatus,
  PropertyStatus,
  RoleCode,
  SubscriptionStatus,
} from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Subscriptions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  const suffix = Date.now().toString(36);
  const activePlanCode = `SUB_ACTIVE_${suffix}`.slice(0, 40);
  const inactivePlanCode = `SUB_INACTIVE_${suffix}`.slice(0, 40);
  const basicPlanCode = `SUB_BASIC_${suffix}`.slice(0, 40);

  let activePlanId: string;
  let inactivePlanId: string;
  let basicPlanId: string;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/subscription-e2e-${Date.now()}-${uploadCounter}`;
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
    return `subscription.e2e.${Date.now()}.${emailCounter}@example.com`;
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
        title: 'Subscription Test Flat',
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
      create: {
        code: 'APARTMENT',
        nameEn: 'Apartment',
        isActive: true,
      },
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
        code: `U${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Sub Land ${suffix}`,
      },
    });
    const city = await prisma.city.create({
      data: {
        countryId: country.id,
        slug: `sub-city-${suffix}`,
        nameEn: `Sub City ${suffix}`,
      },
    });
    const area = await prisma.area.create({
      data: {
        cityId: city.id,
        slug: `sub-area-${suffix}`,
        nameEn: `Sub Area ${suffix}`,
      },
    });
    areaId = area.id;

    const active = await prisma.plan.create({
      data: {
        code: activePlanCode,
        name: `Sub Active ${suffix}`,
        price: 350,
        durationDays: 45,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 3 },
      },
    });
    activePlanId = active.id;

    const inactive = await prisma.plan.create({
      data: {
        code: inactivePlanCode,
        name: `Sub Inactive ${suffix}`,
        price: 100,
        durationDays: 10,
        status: PlanStatus.INACTIVE,
        features: { listingLimit: 1 },
      },
    });
    inactivePlanId = inactive.id;

    const basic = await prisma.plan.create({
      data: {
        code: basicPlanCode,
        name: `Sub Basic ${suffix}`,
        price: 0,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 1 },
      },
    });
    basicPlanId = basic.id;
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany({
      where: { planId: { in: [activePlanId, inactivePlanId, basicPlanId] } },
    });
    await prisma.plan.deleteMany({
      where: { id: { in: [activePlanId, inactivePlanId, basicPlanId] } },
    });
    await app.close();
  });

  it('creates a paid subscription and moves property to pending payment', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: activePlanId })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      status: SubscriptionStatus.PENDING,
      price: 350,
      duration: 45,
      nextAction: 'pay',
      plan: {
        id: activePlanId,
        code: activePlanCode,
        status: PlanStatus.ACTIVE,
      },
    });

    const storedProperty = await prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
    expect(storedProperty.status).toBe(PropertyStatus.PENDING_PAYMENT);

    const stored = await prisma.subscription.findUniqueOrThrow({
      where: { id: res.body.data.id },
    });
    expect(Number(stored.priceAtPurchase)).toBe(350);
    expect(stored.durationDaysAtPurchase).toBe(45);
    expect(stored.propertyId).toBe(propertyId);
  });

  it('activates Basic plan immediately without payment', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: basicPlanId })
      .expect(201);

    expect(res.body.data.status).toBe(SubscriptionStatus.ACTIVE);
    expect(res.body.data.nextAction).toBe('await_review');
    expect(res.body.data.startsAt).toBeTruthy();
    expect(res.body.data.endsAt).toBeTruthy();

    const property = await prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
    expect(property.status).toBe(PropertyStatus.PENDING_REVIEW);
  });

  it('rejects plan selection for incomplete property', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: activePlanId })
      .expect(400);
  });

  it('rejects inactive plan', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: inactivePlanId })
      .expect(400);
  });

  it('rejects invalid property ownership', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ planId: activePlanId })
      .expect(404);

    await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });

  it('prevents duplicate open subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: activePlanId })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: activePlanId })
      .expect(409);
  });

  it('gets the current subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    const created = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: activePlanId })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(created.body.data.id);
    expect(res.body.data).toMatchObject({
      status: SubscriptionStatus.PENDING,
      price: 350,
      duration: 45,
      plan: { id: activePlanId },
    });
  });
});
