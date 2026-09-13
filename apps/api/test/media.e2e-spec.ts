import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Media library (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/library/e2e-${Date.now()}-${uploadCounter}`;
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
    return `media.e2e.${Date.now()}.${emailCounter}@example.com`;
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

    return {
      email,
      accessToken: login.body.data.accessToken as string,
    };
  };

  const uploadSample = async (accessToken: string, folder?: string) => {
    const req = request(app.getHttpServer())
      .post('/api/v1/media/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'sample.jpg',
        contentType: 'image/jpeg',
      });

    if (folder) {
      req.field('folder', folder);
    }

    return req.expect(201);
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
  });

  beforeEach(() => {
    providerMock.upload.mockClear();
    providerMock.delete.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('uploads media to the library', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await uploadSample(accessToken, 'aqarmap/library');

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.url).toContain('cloudinary.com');
    expect(res.body.data.publicId).toBeDefined();
    expect(res.body.data.folder).toBe('aqarmap/library');
    expect(res.body.data.uploadedById).toBeUndefined();
    expect(providerMock.upload).toHaveBeenCalled();

    const stored = await prisma.mediaAsset.findUnique({
      where: { id: res.body.data.id },
    });
    expect(stored).not.toBeNull();
  });

  it('lists current user media with pagination', async () => {
    const { accessToken } = await registerAndLogin();

    await uploadSample(accessToken);
    await uploadSample(accessToken);

    const res = await request(app.getHttpServer())
      .get('/api/v1/media')
      .query({ page: 1, limit: 10 })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.meta).toMatchObject({
      page: 1,
      limit: 10,
    });
    expect(res.body.data.meta.total).toBeGreaterThanOrEqual(2);
  });

  it('deletes own media asset', async () => {
    const { accessToken } = await registerAndLogin();
    const uploaded = await uploadSample(accessToken);
    const id = uploaded.body.data.id as string;

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/media/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(providerMock.delete).toHaveBeenCalled();

    const stored = await prisma.mediaAsset.findUnique({ where: { id } });
    expect(stored).toBeNull();
  });

  it('prevents deleting another user media', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();

    const uploaded = await uploadSample(owner.accessToken);
    const id = uploaded.body.data.id as string;

    await request(app.getHttpServer())
      .delete(`/api/v1/media/${id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(403);

    const stored = await prisma.mediaAsset.findUnique({ where: { id } });
    expect(stored).not.toBeNull();
    expect(providerMock.delete).not.toHaveBeenCalled();
  });
});
