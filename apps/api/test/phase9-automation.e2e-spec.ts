import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LeadType,
  NotificationType,
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
import { SubscriptionExpiryService } from '../src/modules/subscriptions/subscription-expiry.service';

describe('Phase 9 automation (e2e)', () => {
  jest.setTimeout(120_000);

  let app: INestApplication<App>;
  let prisma: PrismaService;
  let expiryService: SubscriptionExpiryService;

  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;
  const suffix = Date.now().toString(36);

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;
  let basicPlanId: string;
  let premiumPlanId: string;

  let adminToken: string;
  let adminId: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/phase9-${Date.now()}-${uploadCounter}`;
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
    return `phase9.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async (firstName = 'Phase9') => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName,
        lastName: 'User',
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
      userId: register.body.data.user.id as string,
      accessToken: login.body.data.accessToken as string,
    };
  };

  const assignRole = async (userId: string, roleCode: RoleCode) => {
    const role = await prisma.role.findUniqueOrThrow({ where: { code: roleCode } });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      update: {},
      create: { userId, roleId: role.id },
    });
  };

  const loginAs = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password })
      .expect(200);
    return login.body.data.accessToken as string;
  };

  const createDraft = async (accessToken: string) => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);
    return res.body.data.id as string;
  };

  const completeDraft = async (
    accessToken: string,
    propertyId: string,
    title: string,
    price = 1800000,
  ) => {
    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/basic`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title, propertyTypeId, transactionTypeId })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/location`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ areaId })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ price })
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

  const subscribeBasic = async (accessToken: string, propertyId: string) => {
    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: basicPlanId })
      .expect(201);
  };

  const subscribePremium = async (accessToken: string, propertyId: string) => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/subscription`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ planId: premiumPlanId })
      .expect(201);
    return res.body.data.id as string;
  };

  const listNotifications = async (accessToken: string) => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return res.body.data as Array<{ title: string; message: string | null }>;
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
    expiryService = app.get(SubscriptionExpiryService);

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
      throw new Error('Seed data missing for phase 9 e2e');
    }
    propertyTypeId = propertyType.id;
    transactionTypeId = transactionType.id;
    areaId = area.id;

    const basicPlan = await prisma.plan.upsert({
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
    basicPlanId = basicPlan.id;

    const premiumPlan = await prisma.plan.upsert({
      where: { code: `PHASE9_PREMIUM_${suffix}`.slice(0, 40) },
      update: { status: PlanStatus.ACTIVE },
      create: {
        code: `PHASE9_PREMIUM_${suffix}`.slice(0, 40),
        name: 'Phase 9 Premium',
        price: 499,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { featured: true },
      },
    });
    premiumPlanId = premiumPlan.id;

    const admin = await registerAndLogin('Admin');
    adminId = admin.userId;
    await assignRole(adminId, RoleCode.ADMIN);
    adminToken = await loginAs(adminId);
  });

  afterAll(async () => {
    await app.close();
  });

  it('A. property approval creates owner notification', async () => {
    const owner = await registerAndLogin('OwnerApprove');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Approve Notify ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const notifications = await listNotifications(owner.accessToken);
    expect(
      notifications.some((item) => item.title === 'تم قبول عقارك'),
    ).toBe(true);

    const stored = await prisma.notification.findFirst({
      where: {
        userId: owner.userId,
        type: NotificationType.PROPERTY,
        title: 'تم قبول عقارك',
      },
    });
    expect(stored).toBeTruthy();
    expect(stored?.data).toMatchObject({
      propertyId,
      eventKey: `property:approved:${propertyId}`,
    });
  });

  it('B. property rejection creates owner notification', async () => {
    const owner = await registerAndLogin('OwnerReject');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Reject Notify ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Incomplete documentation.' })
      .expect(201);

    const notifications = await listNotifications(owner.accessToken);
    expect(
      notifications.some((item) => item.title === 'تم رفض عقارك'),
    ).toBe(true);

    const stored = await prisma.notification.findFirst({
      where: {
        userId: owner.userId,
        type: NotificationType.PROPERTY,
        title: 'تم رفض عقارك',
      },
    });
    expect(stored?.data).toMatchObject({
      propertyId,
      rejectionReason: 'Incomplete documentation.',
    });
  });

  it('C. successful paid payment creates notification', async () => {
    const owner = await registerAndLogin('OwnerPay');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Pay Notify ${suffix}`);
    const subscriptionId = await subscribePremium(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(201);

    const stored = await prisma.notification.findFirst({
      where: {
        userId: owner.userId,
        type: NotificationType.PAYMENT,
        title: 'تم الدفع بنجاح',
      },
    });
    expect(stored).toBeTruthy();
    expect(stored?.data).toMatchObject({ propertyId });
  });

  it('D. payment retry does not create duplicate notification', async () => {
    const owner = await registerAndLogin('OwnerPayRetry');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Pay Retry ${suffix}`);
    const subscriptionId = await subscribePremium(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/subscriptions/${subscriptionId}/pay`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(201);

    const count = await prisma.notification.count({
      where: {
        userId: owner.userId,
        type: NotificationType.PAYMENT,
        title: 'تم الدفع بنجاح',
        data: { path: ['propertyId'], equals: propertyId },
      },
    });
    expect(count).toBe(1);
  });

  it('E. new lead creates owner notification', async () => {
    const seller = await registerAndLogin('SellerLead');
    const buyer = await registerAndLogin('BuyerLead');

    const propertyId = await createDraft(seller.accessToken);
    await completeDraft(seller.accessToken, propertyId, `Lead Notify ${suffix}`);
    await subscribeBasic(seller.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const leadRes = await request(app.getHttpServer())
      .post(`/api/v1/properties/${propertyId}/leads`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .send({ type: LeadType.WHATSAPP, message: 'Interested' })
      .expect(201);

    const stored = await prisma.notification.findFirst({
      where: {
        userId: seller.userId,
        type: NotificationType.LEAD,
        title: 'استفسار جديد على عقارك',
      },
    });
    expect(stored?.data).toMatchObject({
      propertyId,
      leadId: leadRes.body.data.id,
    });
  });

  it('F. expired ACTIVE subscription becomes EXPIRED', async () => {
    const owner = await registerAndLogin('OwnerSubExp');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Sub Expire ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { propertyId, status: SubscriptionStatus.ACTIVE },
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { endsAt: new Date(Date.now() - 60_000) },
    });

    const result = await expiryService.expireSubscriptions();
    expect(result.expiredCount).toBeGreaterThanOrEqual(1);

    const updated = await prisma.subscription.findUniqueOrThrow({
      where: { id: subscription.id },
    });
    expect(updated.status).toBe(SubscriptionStatus.EXPIRED);
  });

  it('G. published property becomes EXPIRED when subscription expires', async () => {
    const owner = await registerAndLogin('OwnerPropExp');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Prop Expire ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { propertyId, status: SubscriptionStatus.ACTIVE },
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { endsAt: new Date(Date.now() - 60_000) },
    });

    await expiryService.expireSubscriptions();

    const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } });
    expect(property.status).toBe(PropertyStatus.EXPIRED);

    const history = await prisma.propertyStatusHistory.findFirst({
      where: {
        propertyId,
        fromStatus: PropertyStatus.PUBLISHED,
        toStatus: PropertyStatus.EXPIRED,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(history).toBeTruthy();
    expect(history?.changedById).toBeNull();
  });

  it('H. non-published property is not automatically expired', async () => {
    const owner = await registerAndLogin('OwnerNonPub');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Non Pub Expire ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { propertyId, status: SubscriptionStatus.ACTIVE },
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { endsAt: new Date(Date.now() - 60_000) },
    });

    await expiryService.expireSubscriptions();

    const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } });
    expect(property.status).toBe(PropertyStatus.PENDING_REVIEW);
  });

  it('I. saved search matching creates notification', async () => {
    const owner = await registerAndLogin('OwnerMatch');
    const watcher = await registerAndLogin('WatcherMatch');

    await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${watcher.accessToken}`)
      .send({
        name: 'Matching alert',
        filters: {
          transactionTypeId,
          propertyTypeId,
          areaId,
          priceMin: 1500000,
          priceMax: 2000000,
        },
      })
      .expect(201);

    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Match Notify ${suffix}`, 1800000);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const stored = await prisma.notification.findFirst({
      where: {
        userId: watcher.userId,
        type: NotificationType.PROPERTY,
        title: 'عقار جديد يناسب بحثك',
      },
    });
    expect(stored).toBeTruthy();
    expect(stored?.data).toMatchObject({ propertyId });
  });

  it('J. non-matching saved search creates no notification', async () => {
    const owner = await registerAndLogin('OwnerNoMatch');
    const watcher = await registerAndLogin('WatcherNoMatch');

    await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${watcher.accessToken}`)
      .send({
        name: 'Non matching alert',
        filters: {
          transactionTypeId,
          propertyTypeId,
          areaId,
          priceMin: 5000000,
          priceMax: 6000000,
        },
      })
      .expect(201);

    const beforeCount = await prisma.notification.count({
      where: { userId: watcher.userId, title: 'عقار جديد يناسب بحثك' },
    });

    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `No Match ${suffix}`, 1800000);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const afterCount = await prisma.notification.count({
      where: { userId: watcher.userId, title: 'عقار جديد يناسب بحثك' },
    });
    expect(afterCount).toBe(beforeCount);
  });

  it('K. running expiry processing twice is safe/idempotent', async () => {
    const owner = await registerAndLogin('OwnerIdempotent');
    const propertyId = await createDraft(owner.accessToken);
    await completeDraft(owner.accessToken, propertyId, `Idempotent Exp ${suffix}`);
    await subscribeBasic(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { propertyId, status: SubscriptionStatus.ACTIVE },
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { endsAt: new Date(Date.now() - 60_000) },
    });

    const first = await expiryService.expireSubscriptions();
    const second = await expiryService.expireSubscriptions();

    expect(first.expiredCount).toBeGreaterThanOrEqual(1);
    expect(second.expiredCount).toBe(0);

    const historyCount = await prisma.propertyStatusHistory.count({
      where: {
        propertyId,
        fromStatus: PropertyStatus.PUBLISHED,
        toStatus: PropertyStatus.EXPIRED,
      },
    });
    expect(historyCount).toBe(1);

    const notificationCount = await prisma.notification.count({
      where: {
        userId: owner.userId,
        type: NotificationType.SUBSCRIPTION,
        data: { path: ['subscriptionId'], equals: subscription.id },
      },
    });
    expect(notificationCount).toBe(1);
  });
});
