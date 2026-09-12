import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanStatus, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Admin Plans (e2e)', () => {
  jest.setTimeout(120_000);

  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;
  const suffix = Date.now().toString(36).toUpperCase();

  let adminToken: string;
  let userToken: string;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/admin-plans-${Date.now()}-${uploadCounter}`;
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
    return `admin.plans.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Plan',
        lastName: 'Admin',
        email,
        password,
        phone: '+201000000000',
      })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    return {
      userId: login.body.data.user?.id ?? login.body.data.accessToken,
      accessToken: login.body.data.accessToken as string,
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

    for (const role of [RoleCode.USER, RoleCode.ADMIN]) {
      await prisma.role.upsert({
        where: { code: role },
        update: { name: role },
        create: { code: role, name: role, description: `${role} role` },
      });
    }

    const propertyType = await prisma.propertyType.findFirst();
    const transactionType = await prisma.transactionType.findFirst();
    const area = await prisma.area.findFirst();
    if (!propertyType || !transactionType || !area) {
      throw new Error('Seed data missing for admin plans e2e');
    }
    propertyTypeId = propertyType.id;
    transactionTypeId = transactionType.id;
    areaId = area.id;

    await prisma.plan.upsert({
      where: { code: 'BASIC' },
      update: { price: 0, durationDays: 30, status: PlanStatus.ACTIVE },
      create: {
        code: 'BASIC',
        name: 'Basic',
        price: 0,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 1 },
      },
    });

    const adminRegister = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'Plans',
        email: uniqueEmail(),
        password,
        phone: '+201000000001',
      })
      .expect(201);

    const adminId = adminRegister.body.data.user.id as string;
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ADMIN } });
    await prisma.userRole.create({
      data: { userId: adminId, roleId: adminRole.id },
    });

    const adminUser = await prisma.user.findUniqueOrThrow({ where: { id: adminId } });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminUser.email, password })
      .expect(200);
    adminToken = adminLogin.body.data.accessToken as string;

    const user = await registerAndLogin();
    userToken = user.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows ADMIN to list all plans including inactive', async () => {
    const inactiveCode = `ADM_INACT_${suffix}`.slice(0, 40);
    const inactive = await prisma.plan.create({
      data: {
        code: inactiveCode,
        name: `Inactive Admin ${suffix}`,
        price: 50,
        durationDays: 7,
        status: PlanStatus.INACTIVE,
        features: { listingLimit: 1 },
      },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/plans')
      .query({ search: inactiveCode, limit: 100 })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.data.some((plan: { id: string }) => plan.id === inactive.id)).toBe(true);
    expect(res.body.meta.total).toBeGreaterThan(0);
  });

  it('rejects USER from admin plans endpoints', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('allows ADMIN to create a plan', async () => {
    const code = `ADM_NEW_${suffix}`.slice(0, 40);

    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code,
        name: `New Plan ${suffix}`,
        price: 299,
        durationDays: 30,
        features: { listingLimit: 3, featuredBoost: false },
      })
      .expect(201);

    expect(res.body.data).toMatchObject({
      code,
      price: 299,
      durationDays: 30,
      status: PlanStatus.ACTIVE,
      subscriptionCount: 0,
    });
  });

  it('rejects duplicate plan code', async () => {
    const code = `ADM_DUP_${suffix}`.slice(0, 40);

    await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code,
        name: 'Duplicate Plan',
        price: 100,
        durationDays: 15,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code,
        name: 'Duplicate Plan 2',
        price: 120,
        durationDays: 20,
      })
      .expect(409);
  });

  it('allows ADMIN to update and deactivate a plan', async () => {
    const code = `ADM_UPD_${suffix}`.slice(0, 40);

    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code,
        name: 'Updatable Plan',
        price: 150,
        durationDays: 20,
      })
      .expect(201);

    const planId = created.body.data.id as string;

    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/admin/plans/${planId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Plan Name', status: PlanStatus.INACTIVE })
      .expect(200);

    expect(updated.body.data).toMatchObject({
      name: 'Updated Plan Name',
      status: PlanStatus.INACTIVE,
    });

    const publicRes = await request(app.getHttpServer()).get('/api/v1/plans').expect(200);
    const publicIds = (publicRes.body.data as Array<{ id: string }>).map((plan) => plan.id);
    expect(publicIds).not.toContain(planId);
  });

  it('keeps existing subscription purchase values when plan is updated', async () => {
    const code = `ADM_FRZ_${suffix}`.slice(0, 40);
    const planRes = await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code,
        name: 'Frozen Snapshot Plan',
        price: 0,
        durationDays: 25,
        features: { listingLimit: 2 },
      })
      .expect(201);
    const testPlanId = planRes.body.data.id as string;

    const ownerRegister = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Frozen',
        lastName: 'Owner',
        email: uniqueEmail(),
        password,
        phone: '+201000000002',
      })
      .expect(201);

    const ownerLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: ownerRegister.body.data.user.email, password })
      .expect(200);
    const ownerToken = ownerLogin.body.data.accessToken as string;

    const draft = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({})
      .expect(201);
    const propertyId = draft.body.data.id as string;

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/basic`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Frozen Sub', propertyTypeId, transactionTypeId })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/location`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ areaId })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ price: 1000000 })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'listing.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ planId: testPlanId })
      .expect(201);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { propertyId },
    });
    const frozenPrice = Number(subscription.priceAtPurchase);
    const frozenDuration = subscription.durationDaysAtPurchase;
    expect(frozenPrice).toBe(0);
    expect(frozenDuration).toBe(25);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/plans/${testPlanId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 999, durationDays: 90 })
      .expect(200);

    const afterUpdate = await prisma.subscription.findUniqueOrThrow({
      where: { id: subscription.id },
    });
    expect(Number(afterUpdate.priceAtPurchase)).toBe(frozenPrice);
    expect(afterUpdate.durationDaysAtPurchase).toBe(frozenDuration);
  });
});
