import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';
import { MEDIA_PROVIDER } from '../src/modules/media/interfaces/media-provider.interface';

describe('Property media (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  let uploadCounter = 0;

  const providerMock = {
    name: 'mock-cloudinary',
    upload: jest.fn().mockImplementation(async () => {
      uploadCounter += 1;
      const publicId = `aqarmap/properties/e2e-${Date.now()}-${uploadCounter}`;
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
    return `property.media.e2e.${Date.now()}.${emailCounter}@example.com`;
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

  const uploadImage = async (accessToken: string, propertyId: string) => {
    return request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'listing.jpg',
        contentType: 'image/jpeg',
      })
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
  });

  beforeEach(() => {
    providerMock.upload.mockClear();
    providerMock.delete.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('uploads a property image', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    const res = await uploadImage(accessToken, propertyId);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.url).toContain('cloudinary.com');
    expect(res.body.data.publicId).toBeDefined();
    expect(res.body.data.isPrimary).toBe(true);
    expect(res.body.data.sortOrder).toBe(0);
    expect(providerMock.upload).toHaveBeenCalled();

    const image = await prisma.propertyImage.findUnique({
      where: { id: res.body.data.id },
      include: { mediaAsset: true },
    });
    expect(image).not.toBeNull();
    expect(image?.mediaAssetId).toBeDefined();
  });

  it('lists property images', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    await uploadImage(accessToken, propertyId);
    await uploadImage(accessToken, propertyId);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].isPrimary).toBe(true);
    expect(res.body.data[1].isPrimary).toBe(false);
  });

  it('deletes a property image and media asset', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);
    const uploaded = await uploadImage(accessToken, propertyId);
    const imageId = uploaded.body.data.id as string;

    const before = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    await request(app.getHttpServer())
      .delete(`/api/v1/properties/me/${propertyId}/media/${imageId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(providerMock.delete).toHaveBeenCalled();
    expect(
      await prisma.propertyImage.findUnique({ where: { id: imageId } }),
    ).toBeNull();
    expect(
      await prisma.mediaAsset.findUnique({
        where: { id: before!.mediaAssetId },
      }),
    ).toBeNull();
  });

  it('reorders property images', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    const first = await uploadImage(accessToken, propertyId);
    const second = await uploadImage(accessToken, propertyId);

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${propertyId}/media/reorder`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        images: [
          { id: first.body.data.id, sortOrder: 5 },
          { id: second.body.data.id, sortOrder: 1 },
        ],
      })
      .expect(200);

    const byId = Object.fromEntries(
      res.body.data.map((item: { id: string; sortOrder: number }) => [
        item.id,
        item.sortOrder,
      ]),
    );
    expect(byId[first.body.data.id]).toBe(5);
    expect(byId[second.body.data.id]).toBe(1);
  });

  it('sets primary image', async () => {
    const { accessToken } = await registerAndLogin();
    const propertyId = await createDraft(accessToken);

    const first = await uploadImage(accessToken, propertyId);
    const second = await uploadImage(accessToken, propertyId);

    const res = await request(app.getHttpServer())
      .patch(
        `/api/v1/properties/me/${propertyId}/media/${second.body.data.id}/primary`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.id).toBe(second.body.data.id);
    expect(res.body.data.isPrimary).toBe(true);

    const list = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const primary = list.body.data.filter(
      (item: { isPrimary: boolean }) => item.isPrimary,
    );
    expect(primary).toHaveLength(1);
    expect(primary[0].id).toBe(second.body.data.id);
    expect(
      list.body.data.find(
        (item: { id: string }) => item.id === first.body.data.id,
      ).isPrimary,
    ).toBe(false);
  });

  it('protects ownership on property media endpoints', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();
    const propertyId = await createDraft(owner.accessToken);
    const uploaded = await uploadImage(owner.accessToken, propertyId);

    await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .post(`/api/v1/properties/me/${propertyId}/media`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'hack.jpg',
        contentType: 'image/jpeg',
      })
      .expect(404);

    await request(app.getHttpServer())
      .delete(
        `/api/v1/properties/me/${propertyId}/media/${uploaded.body.data.id}`,
      )
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });
});
