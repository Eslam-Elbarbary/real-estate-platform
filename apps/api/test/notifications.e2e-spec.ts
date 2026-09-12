import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationType, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Notifications (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `notifications.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async () => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
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

    return {
      accessToken: login.body.data.accessToken as string,
      userId: register.body.data.user.id as string,
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
      create: {
        code: RoleCode.USER,
        name: 'User',
        description: 'Standard marketplace user',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists notifications', async () => {
    const { accessToken, userId } = await registerAndLogin();

    await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.SYSTEM,
        title: 'Welcome',
        body: 'Thanks for joining Aqarmap',
      },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({
      title: 'Welcome',
      message: 'Thanks for joining Aqarmap',
      type: NotificationType.SYSTEM,
      read: false,
    });
    expect(res.body.data[0]).toHaveProperty('data');
    expect(res.body.data[0]).not.toHaveProperty('isRead');
    expect(res.body.data[0]).not.toHaveProperty('body');
  });

  it('marks a notification as read', async () => {
    const { accessToken, userId } = await registerAndLogin();

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.PROPERTY,
        title: 'New lead',
        body: 'Someone contacted you',
      },
    });

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.read).toBe(true);

    const stored = await prisma.notification.findUniqueOrThrow({
      where: { id: notification.id },
    });
    expect(stored.isRead).toBe(true);
    expect(stored.readAt).toBeTruthy();
  });

  it('marks all notifications as read', async () => {
    const { accessToken, userId } = await registerAndLogin();

    await prisma.notification.createMany({
      data: [
        {
          userId,
          type: NotificationType.SYSTEM,
          title: 'One',
          body: 'First',
        },
        {
          userId,
          type: NotificationType.PAYMENT,
          title: 'Two',
          body: 'Second',
        },
      ],
    });

    const res = await request(app.getHttpServer())
      .patch('/api/v1/notifications/read-all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.count).toBeGreaterThanOrEqual(2);

    const unread = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    expect(unread).toBe(0);
  });
});
