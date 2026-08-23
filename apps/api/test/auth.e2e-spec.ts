import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode, VerificationTokenType } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `auth.e2e.${Date.now()}.${emailCounter}@example.com`;
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

  it('registers a user successfully', async () => {
    const email = uniqueEmail();
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Eslam',
        lastName: 'Elbarbary',
        email,
        password,
        phone: '+201000000000',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.user.roles).toContain('USER');
  });

  it('rejects duplicate email', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(409);

    expect(res.body.success).toBe(false);
  });

  it('logs in successfully', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects wrong password', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPass1' })
      .expect(401);
  });

  it('rejects inactive user login', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    await prisma.user.update({
      where: { email },
      data: { isActive: false },
    });

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(401);
  });

  it('verifies email with valid token', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const tokenRow = await prisma.verificationToken.findFirstOrThrow({
      where: {
        userId: user.id,
        type: VerificationTokenType.EMAIL_VERIFICATION,
      },
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-email')
      .send({ token: tokenRow.token })
      .expect(200);

    expect(res.body.data.message).toMatch(/verified/i);

    const updated = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(updated.isEmailVerified).toBe(true);
  });

  it('rejects invalid verification token', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/verify-email')
      .send({ token: 'invalid-token-value-123456' })
      .expect(401);
  });

  it('rotates refresh tokens', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    const oldRefresh = login.body.data.refreshToken as string;

    const refreshed = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(200);

    expect(refreshed.body.data.accessToken).toBeDefined();
    expect(refreshed.body.data.refreshToken).not.toBe(oldRefresh);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(401);
  });

  it('logs out and revokes refresh token', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ firstName: 'A', lastName: 'B', email, password })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    const refreshToken = login.body.data.refreshToken as string;

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .send({ refreshToken })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });

  it('rejects /me without token', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('returns /me with valid token', async () => {
    const email = uniqueEmail();
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Eslam',
        lastName: 'Elbarbary',
        email,
        password,
      })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .expect(200);

    expect(res.body.data.email).toBe(email);
    expect(res.body.data.name).toBe('Eslam Elbarbary');
    expect(res.body.data.roles).toContain('USER');
    expect(res.body.data.passwordHash).toBeUndefined();
  });
});
