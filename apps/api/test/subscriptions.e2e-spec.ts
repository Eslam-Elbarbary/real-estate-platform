import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanStatus, RoleCode, SubscriptionStatus } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Subscriptions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const suffix = Date.now().toString(36);
  const activePlanCode = `SUB_ACTIVE_${suffix}`.slice(0, 40);
  const inactivePlanCode = `SUB_INACTIVE_${suffix}`.slice(0, 40);

  let activePlanId: string;
  let inactivePlanId: string;

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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany({
      where: { planId: { in: [activePlanId, inactivePlanId] } },
    });
    await prisma.plan.deleteMany({
      where: { id: { in: [activePlanId, inactivePlanId] } },
    });
    await app.close();
  });

  it('creates a subscription for a property', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

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
      plan: {
        id: activePlanId,
        code: activePlanCode,
        status: PlanStatus.ACTIVE,
      },
    });
    expect(res.body.data.id).toBeTruthy();
    expect(res.body.data.createdAt).toBeTruthy();

    const stored = await prisma.subscription.findUniqueOrThrow({
      where: { id: res.body.data.id },
    });
    expect(Number(stored.priceAtPurchase)).toBe(350);
    expect(stored.durationDaysAtPurchase).toBe(45);
    expect(stored.propertyId).toBe(propertyId);
  });

  it('rejects inactive plan', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

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
