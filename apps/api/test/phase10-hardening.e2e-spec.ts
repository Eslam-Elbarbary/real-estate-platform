import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationType, RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { SubscriptionExpiryScheduler } from '../src/modules/subscriptions/subscription-expiry.scheduler';
import { SubscriptionExpiryService } from '../src/modules/subscriptions/subscription-expiry.service';

describe('Phase 10 hardening (e2e)', () => {
  jest.setTimeout(120_000);

  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `phase10.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async () => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Phase10',
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
      create: { code: RoleCode.USER, name: 'User', description: 'User role' },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers subscription expiry scheduler on startup', () => {
    const scheduler = app.get(SubscriptionExpiryScheduler);
    const expiryService = app.get(SubscriptionExpiryService);
    expect(scheduler).toBeDefined();
    expect(expiryService).toBeDefined();
  });

  it('exposes notification type and safe data in API response', async () => {
    const { accessToken, userId } = await registerAndLogin();

    await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.PROPERTY,
        title: 'Test Property Event',
        body: 'Property update message',
        data: {
          eventKey: `test:property:${userId}`,
          propertyId: 'prop-test-id',
          propertySlug: 'test-slug',
          actionUrl: '/properties/test-slug',
        },
      },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const item = res.body.data.find(
      (notification: { title: string }) => notification.title === 'Test Property Event',
    );
    expect(item).toMatchObject({
      type: NotificationType.PROPERTY,
      title: 'Test Property Event',
      message: 'Property update message',
      read: false,
    });
    expect(item.data).toMatchObject({
      propertyId: 'prop-test-id',
      propertySlug: 'test-slug',
      actionUrl: '/properties/test-slug',
    });
    expect(item).not.toHaveProperty('body');
    expect(item).not.toHaveProperty('isRead');
    expect(item).not.toHaveProperty('userId');
  });

  it('prevents user from marking another user notification as read', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();

    const notification = await prisma.notification.create({
      data: {
        userId: owner.userId,
        type: NotificationType.SYSTEM,
        title: 'Private Notice',
        body: 'Owner only',
      },
    });

    await request(app.getHttpServer())
      .patch(`/api/v1/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });

  it('rejects invalid plan payload on admin create', async () => {
    const adminRegister = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'Validation',
        email: uniqueEmail(),
        password,
        phone: '+201000000003',
      })
      .expect(201);

    const adminId = adminRegister.body.data.user.id as string;
    await prisma.role.upsert({
      where: { code: RoleCode.ADMIN },
      update: { name: 'Admin' },
      create: { code: RoleCode.ADMIN, name: 'Admin', description: 'Admin role' },
    });
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ADMIN } });
    await prisma.userRole.create({ data: { userId: adminId, roleId: adminRole.id } });

    const adminUser = await prisma.user.findUniqueOrThrow({ where: { id: adminId } });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminUser.email, password })
      .expect(200);
    const adminToken = adminLogin.body.data.accessToken as string;

    await request(app.getHttpServer())
      .post('/api/v1/admin/plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'bad code',
        name: 'Invalid',
        price: -1,
        durationDays: 0,
      })
      .expect(400);
  });

  it('prevents user from listing another user alerts', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({ name: 'Owner alert', filters: { priceMin: 1000000 } })
      .expect(201);

    const ownerAlerts = await request(app.getHttpServer())
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200);

    const otherAlerts = await request(app.getHttpServer())
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(200);

    expect(ownerAlerts.body.data.length).toBeGreaterThan(0);
    expect(otherAlerts.body.data.length).toBe(0);
  });
});
