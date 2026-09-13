import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
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

describe('Property submit lifecycle (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;
  let basicPlanId: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/properties/submit-e2e-${Date.now()}-${uploadCounter}`;
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
    return `property.submit.e2e.${Date.now()}.${emailCounter}@example.com`;
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
        title: 'Ready for Review Flat',
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
        filename: 'ready.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
  };

  const subscribeBasic = async (accessToken: string, propertyId: string) => {
    return request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: basicPlanId })
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
        nameAr: 'شقة',
        sortOrder: 1,
      },
    });
    propertyTypeId = propertyType.id;

    const transactionType = await prisma.transactionType.upsert({
      where: { code: 'SALE' },
      update: { nameEn: 'Sale', isActive: true },
      create: {
        code: 'SALE',
        nameEn: 'Sale',
        nameAr: 'بيع',
      },
    });
    transactionTypeId = transactionType.id;

    const suffix = Date.now().toString(36);
    const country = await prisma.country.create({
      data: {
        code: `S${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Submit Land ${suffix}`,
      },
    });
    const city = await prisma.city.create({
      data: {
        countryId: country.id,
        slug: `submit-city-${suffix}`,
        nameEn: `Submit City ${suffix}`,
      },
    });
    const area = await prisma.area.create({
      data: {
        cityId: city.id,
        slug: `submit-area-${suffix}`,
        nameEn: `Submit Area ${suffix}`,
      },
    });
    areaId = area.id;

    const basicPlan = await prisma.plan.upsert({
      where: { code: 'BASIC' },
      update: {
        price: 0,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
      },
      create: {
        code: 'BASIC',
        name: 'Basic',
        price: 0,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 1 },
      },
    });
    basicPlanId = basicPlan.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects incomplete property submit on rejected property', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.REJECTED },
    });

    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.missingFields).toEqual(
      expect.arrayContaining([
        'title',
        'propertyTypeId',
        'transactionTypeId',
        'areaId',
        'price',
        'images',
      ]),
    );
  });

  it('blocks draft submit without an active subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('submits via Basic plan selection and reaches pending review', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    const res = await subscribeBasic(accessToken, propertyId);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(SubscriptionStatus.ACTIVE);
    expect(res.body.data.nextAction).toBe('await_review');

    const stored = await prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
    expect(stored.status).toBe(PropertyStatus.PENDING_REVIEW);
    expect(stored.submittedAt).toBeTruthy();
  });

  it('creates status history on Basic plan activation', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);

    await subscribeBasic(accessToken, propertyId);

    const history = await prisma.propertyStatusHistory.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
    });

    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].fromStatus).toBe(PropertyStatus.DRAFT);
    expect(history[0].toStatus).toBe(PropertyStatus.PENDING_REVIEW);
  });

  it('resubmits a rejected property with an active subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);
    await subscribeBasic(accessToken, propertyId);

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyStatus.REJECTED,
        rejectedReason: 'Needs clearer photos',
      },
    });

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/basic`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Rejected Flat',
        propertyTypeId,
        transactionTypeId,
      })
      .expect(200);

    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(res.body.data.status).toBe(PropertyStatus.PENDING_REVIEW);

    const history = await prisma.propertyStatusHistory.findFirst({
      where: {
        propertyId,
        fromStatus: PropertyStatus.REJECTED,
        toStatus: PropertyStatus.PENDING_REVIEW,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(history).toBeTruthy();
  });

  it('requires a new plan when resubmitting with an expired subscription', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    await completeDraft(accessToken, propertyId);
    await subscribeBasic(accessToken, propertyId);

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.REJECTED },
    });

    await prisma.subscription.updateMany({
      where: { propertyId },
      data: {
        endsAt: new Date(Date.now() - 86_400_000),
      },
    });

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(409);
  });

  it('returns completion percentage', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    const empty = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/completion`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(empty.body.data.completed).toBe(false);
    expect(empty.body.data.progress).toBe(0);
    expect(empty.body.data.missingFields).toHaveLength(6);

    await completeDraft(accessToken, propertyId);

    const complete = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/completion`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(complete.body.data.completed).toBe(true);
    expect(complete.body.data.progress).toBe(100);
    expect(complete.body.data.missingFields).toEqual([]);
  });

  it('protects ownership on submit endpoints', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();
    const propertyId = await createDraft(owner.accessToken);

    await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/completion`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/submit`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });
});
