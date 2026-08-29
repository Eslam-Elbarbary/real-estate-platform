import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanStatus, PropertyStatus, RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Admin (e2e)', () => {
  jest.setTimeout(120_000);

  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;
  let basicPlanId: string;

  let adminToken: string;
  let adminId: string;
  let moderatorToken: string;
  let userToken: string;
  let brokerToken: string;
  let developerToken: string;
  let ownerToken: string;
  let ownerId: string;

  let pendingPropertyId: string;
  let pendingPropertySlug: string;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/admin-e2e-${Date.now()}-${uploadCounter}`;
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
    return `admin.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const ensureRole = async (code: RoleCode, name: string) => {
    await prisma.role.upsert({
      where: { code },
      update: { name },
      create: { code, name, description: `${name} role` },
    });
  };

  const registerUser = async (firstName = 'Test') => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName,
        lastName: 'User',
        email,
        password,
        phone: '+201000000001',
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

  const completeAndSubscribeBasic = async (
    accessToken: string,
    propertyId: string,
    title: string,
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
      .send({ price: 1800000 })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'listing.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    await request(app.getHttpServer())
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

    for (const role of [
      RoleCode.USER,
      RoleCode.BROKER,
      RoleCode.DEVELOPER,
      RoleCode.ADMIN,
      RoleCode.MODERATOR,
    ]) {
      await ensureRole(role, role);
    }

    const propertyType = await prisma.propertyType.findFirst();
    const transactionType = await prisma.transactionType.findFirst();
    const area = await prisma.area.findFirst({ include: { city: true } });
    if (!propertyType || !transactionType || !area) {
      throw new Error('Seed data missing for admin e2e');
    }
    propertyTypeId = propertyType.id;
    transactionTypeId = transactionType.id;
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

    const admin = await registerUser('Admin');
    adminId = admin.userId;
    await assignRole(adminId, RoleCode.ADMIN);
    adminToken = await loginAs(adminId);

    const moderator = await registerUser('Moderator');
    await assignRole(moderator.userId, RoleCode.MODERATOR);
    moderatorToken = await loginAs(moderator.userId);

    const plainUser = await registerUser('Plain');
    userToken = plainUser.accessToken;

    const broker = await registerUser('Broker');
    await assignRole(broker.userId, RoleCode.BROKER);
    brokerToken = await loginAs(broker.userId);

    const developer = await registerUser('Developer');
    await assignRole(developer.userId, RoleCode.DEVELOPER);
    developerToken = await loginAs(developer.userId);

    const owner = await registerUser('Owner');
    ownerId = owner.userId;
    ownerToken = owner.accessToken;

    const pendingId = await createDraft(ownerToken);
    await completeAndSubscribeBasic(ownerToken, pendingId, 'Admin Review Villa');
    pendingPropertyId = pendingId;

    const pending = await prisma.property.findUniqueOrThrow({ where: { id: pendingId } });
    pendingPropertySlug = pending.slug;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('authorization', () => {
    it('rejects normal USER from admin dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('rejects BROKER from admin dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${brokerToken}`)
        .expect(403);
    });

    it('rejects DEVELOPER from admin dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${developerToken}`)
        .expect(403);
    });

    it('allows ADMIN on dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('allows MODERATOR on property review list', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/properties')
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(200);
    });

    it('rejects MODERATOR from user management', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(403);
    });

    it('rejects MODERATOR from archive', async () => {
      const draftId = await createDraft(ownerToken);
      await completeAndSubscribeBasic(ownerToken, draftId, 'Moderator Archive Block');
      await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/archive`)
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(403);
    });
  });

  describe('dashboard', () => {
    it('returns aggregated statistics', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const stats = res.body.data;
      expect(stats.users.total).toBeGreaterThan(0);
      expect(stats.users.active).toBeGreaterThan(0);
      expect(stats.properties.total).toBeGreaterThan(0);
      expect(stats.properties.pendingReview).toBeGreaterThan(0);
      expect(stats.subscriptions).toMatchObject({
        total: expect.any(Number),
        pending: expect.any(Number),
        active: expect.any(Number),
      });
      expect(stats.payments).toMatchObject({
        total: expect.any(Number),
        successful: expect.any(Number),
        pending: expect.any(Number),
        failed: expect.any(Number),
        totalRevenue: expect.any(Number),
      });
      expect(stats.leads).toMatchObject({
        total: expect.any(Number),
        new: expect.any(Number),
        contacted: expect.any(Number),
        interested: expect.any(Number),
        closed: expect.any(Number),
      });
    });
  });

  describe('property moderation', () => {
    it('lists pending review properties by default', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta).toMatchObject({
        page: 1,
        limit: 20,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
      expect(res.body.data.some((item: { id: string }) => item.id === pendingPropertyId)).toBe(
        true,
      );
      const card = res.body.data.find((item: { id: string }) => item.id === pendingPropertyId);
      expect(card).toMatchObject({
        slug: pendingPropertySlug,
        status: PropertyStatus.PENDING_REVIEW,
        owner: {
          id: ownerId,
          email: expect.any(String),
        },
      });
      expect(card.owner.passwordHash).toBeUndefined();
    });

    it('supports pagination and search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/properties')
        .query({ page: 1, limit: 1, search: 'Admin Review' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.meta.limit).toBe(1);
      expect(res.body.data.length).toBeLessThanOrEqual(1);
      if (res.body.data.length === 1) {
        expect(res.body.data[0].title).toContain('Admin Review');
      }
    });

    it('returns property review details without secrets', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/admin/properties/${pendingPropertyId}`)
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(200);

      expect(res.body.data).toMatchObject({
        id: pendingPropertyId,
        status: PropertyStatus.PENDING_REVIEW,
        owner: { id: ownerId },
        location: { summary: expect.any(String) },
        statusHistory: expect.any(Array),
        paymentSummary: expect.objectContaining({ total: expect.any(Number) }),
      });
      expect(res.body.data.owner.passwordHash).toBeUndefined();
      expect(res.body.data.owner.refreshTokens).toBeUndefined();
    });

    it('rejects approval without a valid active subscription', async () => {
      const draftId = await createDraft(ownerToken);
      await prisma.property.update({
        where: { id: draftId },
        data: { status: PropertyStatus.PENDING_REVIEW },
      });

      await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('approves a pending review property', async () => {
      const draftId = await createDraft(ownerToken);
      await completeAndSubscribeBasic(ownerToken, draftId, 'Approve Me Home');

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/approve`)
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(201);

      expect(res.body.data.status).toBe(PropertyStatus.PUBLISHED);
      expect(res.body.data.reviewedAt).toBeTruthy();
      expect(res.body.data.publishedAt).toBeTruthy();

      const history = await prisma.propertyStatusHistory.findMany({
        where: { propertyId: draftId },
        orderBy: { createdAt: 'desc' },
      });
      expect(history[0]?.toStatus).toBe(PropertyStatus.PUBLISHED);
    });

    it('rejects a pending review property with reason', async () => {
      const draftId = await createDraft(ownerToken);
      await completeAndSubscribeBasic(ownerToken, draftId, 'Reject Me Home');

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Photos are unclear and incomplete.' })
        .expect(201);

      expect(res.body.data.status).toBe(PropertyStatus.REJECTED);
      expect(res.body.data.rejectedReason).toBe('Photos are unclear and incomplete.');

      await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Already rejected' })
        .expect(400);
    });

    it('archives a property as admin', async () => {
      const draftId = await createDraft(ownerToken);
      await completeAndSubscribeBasic(ownerToken, draftId, 'Archive Me Home');
      await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      const res = await request(app.getHttpServer())
        .post(`/api/v1/admin/properties/${draftId}/archive`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      expect(res.body.data.status).toBe(PropertyStatus.ARCHIVED);
      expect(res.body.data.archivedAt).toBeTruthy();
    });

    it('rejects USER from property moderation endpoints', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/properties')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('user management', () => {
    let targetUserId: string;

    beforeAll(async () => {
      const target = await registerUser('Target');
      targetUserId = target.userId;
    });

    it('lists users without secrets', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta.total).toBeGreaterThan(0);
      for (const user of res.body.data) {
        expect(user.passwordHash).toBeUndefined();
        expect(user.refreshTokens).toBeUndefined();
        expect(user.verificationTokens).toBeUndefined();
        expect(user.roles).toEqual(expect.any(Array));
      }
    });

    it('supports search and status filter', async () => {
      const target = await prisma.user.findUniqueOrThrow({ where: { id: targetUserId } });

      const searchRes = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .query({ search: target.email })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(searchRes.body.data.some((user: { id: string }) => user.id === targetUserId)).toBe(
        true,
      );

      const activeRes = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .query({ status: true })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(activeRes.body.data.every((user: { isActive: boolean }) => user.isActive)).toBe(true);
    });

    it('returns user details', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/admin/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data).toMatchObject({
        id: targetUserId,
        email: expect.any(String),
        isActive: true,
        roles: expect.arrayContaining([RoleCode.USER]),
      });
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('activates and deactivates a user', async () => {
      const deactivate = await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${targetUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(200);

      expect(deactivate.body.data.isActive).toBe(false);

      const activate = await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${targetUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: true })
        .expect(200);

      expect(activate.body.data.isActive).toBe(true);
    });

    it('prevents admin from changing own status', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${adminId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(400);
    });
  });
});
