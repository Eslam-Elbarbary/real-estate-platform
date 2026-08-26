import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyStatus, RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Favorites (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  const suffix = Date.now().toString(36);

  let propertyId: string;
  let areaId: string;
  let countryId: string;
  let cityId: string;
  let mediaAssetId: string;
  let ownerId: string;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `favorites.e2e.${Date.now()}.${emailCounter}@example.com`;
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

    const owner = await registerAndLogin();
    ownerId = owner.userId;

    const country = await prisma.country.create({
      data: {
        code: `F${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Fav Land ${suffix}`,
      },
    });
    countryId = country.id;

    const city = await prisma.city.create({
      data: {
        countryId,
        slug: `fav-city-${suffix}`,
        nameEn: `Fav City ${suffix}`,
      },
    });
    cityId = city.id;

    const area = await prisma.area.create({
      data: {
        cityId,
        slug: `fav-area-${suffix}`,
        nameEn: `Fav Area ${suffix}`,
      },
    });
    areaId = area.id;

    const media = await prisma.mediaAsset.create({
      data: {
        url: 'https://cdn.example.com/favorites/primary.jpg',
        publicId: `aqarmap/favorites/${suffix}`,
        uploadedById: ownerId,
      },
    });
    mediaAssetId = media.id;

    const property = await prisma.property.create({
      data: {
        ownerId,
        title: `Favorite Target ${suffix}`,
        slug: `favorite-target-${suffix}`,
        status: PropertyStatus.PUBLISHED,
        price: 1750000,
        currency: 'EGP',
        areaId,
        publishedAt: new Date(),
        images: {
          create: {
            mediaAssetId,
            isPrimary: true,
            sortOrder: 0,
          },
        },
      },
    });
    propertyId = property.id;
  });

  afterAll(async () => {
    await prisma.favorite.deleteMany({ where: { propertyId } });
    await prisma.propertyImage.deleteMany({ where: { propertyId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await prisma.mediaAsset.deleteMany({ where: { id: mediaAssetId } });
    await prisma.area.deleteMany({ where: { id: areaId } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await prisma.country.deleteMany({ where: { id: countryId } });
    await app.close();
  });

  it('adds a favorite', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: propertyId,
      property: {
        id: propertyId,
        title: `Favorite Target ${suffix}`,
        price: 1750000,
        currency: 'EGP',
      },
    });
    expect(res.body.data.property.primaryImage.url).toContain('primary.jpg');
    expect(res.body.data.property.location.summary).toContain(`Fav Area ${suffix}`);
    expect(res.body.data.createdAt).toBeTruthy();

    const check = await request(app.getHttpServer())
      .get(`/api/v1/favorites/${propertyId}/check`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(check.body.data.isFavorite).toBe(true);
  });

  it('blocks duplicate favorites', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(409);
  });

  it('removes a favorite', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const check = await request(app.getHttpServer())
      .get(`/api/v1/favorites/${propertyId}/check`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(check.body.data.isFavorite).toBe(false);
  });

  it('lists favorites', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post(`/api/v1/favorites/${propertyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((f: { id: string }) => f.id === propertyId)).toBe(
      true,
    );
  });
});
