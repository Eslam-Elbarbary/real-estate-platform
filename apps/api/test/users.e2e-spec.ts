import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MediaService } from '../src/modules/media/media.service';

describe('Users profile (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const mediaMock = {
    upload: jest.fn().mockResolvedValue({
      url: 'http://res.cloudinary.com/demo/image/upload/v1/aqarmap/avatars/test.jpg',
      secureUrl:
        'https://res.cloudinary.com/demo/image/upload/v1/aqarmap/avatars/test.jpg',
      publicId: 'aqarmap/avatars/test',
      resourceType: 'image',
      provider: 'cloudinary',
    }),
    delete: jest.fn().mockResolvedValue(undefined),
    getProviderName: jest.fn().mockReturnValue('cloudinary'),
  };

  const uniqueEmail = () => {
    emailCounter += 1;
    return `users.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async (email = uniqueEmail()) => {
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

    return {
      email,
      accessToken: login.body.data.accessToken as string,
      refreshToken: login.body.data.refreshToken as string,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MediaService)
      .useValue(mediaMock)
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
  });

  beforeEach(() => {
    mediaMock.upload.mockClear();
    mediaMock.delete.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('gets the current user profile', async () => {
    const { accessToken, email } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      email,
      firstName: 'Eslam',
      lastName: 'Elbarbary',
      phone: '+201000000000',
      isEmailVerified: false,
    });
    expect(res.body.data.roles).toContain('USER');
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.id).toBeDefined();
  });

  it('updates profile fields', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+201111111111',
      })
      .expect(200);

    expect(res.body.data).toMatchObject({
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+201111111111',
    });
  });

  it('cannot update email via profile patch', async () => {
    const { accessToken, email } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: 'hacker@example.com', firstName: 'Still' })
      .expect(400);

    expect(res.body.success).toBe(false);

    const profile = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(profile.body.data.email).toBe(email);
  });

  it('changes password successfully and revokes refresh tokens', async () => {
    const { accessToken, email, refreshToken } = await registerAndLogin();
    const newPassword = 'NewPassword1!';

    const res = await request(app.getHttpServer())
      .post('/api/v1/users/me/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: password, newPassword })
      .expect(200);

    expect(res.body.success).toBe(true);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: newPassword })
      .expect(200);
  });

  it('rejects wrong current password', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/users/me/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'WrongPass1!', newPassword: 'NewPassword1!' })
      .expect(401);
  });

  it('rejects invalid avatar mime type', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('not-an-image'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(mediaMock.upload).not.toHaveBeenCalled();
  });

  it('uploads avatar via media service', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'avatar.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    expect(mediaMock.upload).toHaveBeenCalled();
    expect(res.body.data.avatarUrl).toContain('cloudinary.com');
    expect(res.body.data.passwordHash).toBeUndefined();

    const user = await prisma.user.findFirst({
      where: { email: res.body.data.email },
    });
    expect(user?.avatarPublicId).toBe('aqarmap/avatars/test');
  });

  it('deletes avatar and clears stored fields', async () => {
    const { accessToken, email } = await registerAndLogin();

    await prisma.user.update({
      where: { email },
      data: {
        avatarUrl: 'https://res.cloudinary.com/demo/image/upload/v1/old.jpg',
        avatarPublicId: 'aqarmap/avatars/old',
      },
    });

    const res = await request(app.getHttpServer())
      .delete('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(mediaMock.delete).toHaveBeenCalledWith({
      publicId: 'aqarmap/avatars/old',
      resourceType: 'image',
    });
    expect(res.body.data.avatarUrl).toBeNull();

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user?.avatarUrl).toBeNull();
    expect(user?.avatarPublicId).toBeNull();
  });
});
