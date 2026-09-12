import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyStatus, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Public property discovery (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const suffix = Date.now().toString(36);
  const password = 'Password1!';

  let ownerId: string;
  let propertyTypeId: string;
  let transactionTypeId: string;
  let countryId: string;
  let cityId: string;
  let areaId: string;
  let districtId: string;
  let featureId: string;

  let publishedId: string;
  let publishedSlug: string;
  let publishedExpensiveId: string;
  let draftId: string;
  let draftSlug: string;
  let mediaAssetId: string;

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

    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Eslam',
        lastName: 'Elbarbary',
        email: `public.discovery.${suffix}@example.com`,
        password,
        phone: '+201000000000',
      })
      .expect(201);

    ownerId = register.body.data.user.id as string;

    await prisma.user.update({
      where: { id: ownerId },
      data: {
        avatarUrl: 'https://cdn.example.com/avatars/eslam.jpg',
        passwordHash: 'should-never-leak',
      },
    });

    const propertyType = await prisma.propertyType.upsert({
      where: { code: 'APARTMENT' },
      update: { nameEn: 'Apartment', isActive: true },
      create: {
        code: 'APARTMENT',
        nameEn: 'Apartment',
        nameAr: 'شقة',
        sortOrder: 1,
      },
    });
    propertyTypeId = propertyType.id;

    const transactionType = await prisma.transactionType.upsert({
      where: { code: 'SALE' },
      update: { nameEn: 'Sale', isActive: true },
      create: {
        code: 'SALE',
        nameEn: 'Sale',
        nameAr: 'بيع',
      },
    });
    transactionTypeId = transactionType.id;

    const country = await prisma.country.create({
      data: {
        code: `P${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Public Land ${suffix}`,
      },
    });
    countryId = country.id;

    const city = await prisma.city.create({
      data: {
        countryId,
        slug: `public-city-${suffix}`,
        nameEn: `Public City ${suffix}`,
      },
    });
    cityId = city.id;

    const area = await prisma.area.create({
      data: {
        cityId,
        slug: `public-area-${suffix}`,
        nameEn: `Public Area ${suffix}`,
      },
    });
    areaId = area.id;

    const district = await prisma.district.create({
      data: {
        areaId,
        slug: `public-district-${suffix}`,
        nameEn: `Public District ${suffix}`,
      },
    });
    districtId = district.id;

    const feature = await prisma.feature.upsert({
      where: { code: 'PARKING' },
      update: { nameEn: 'Parking', isActive: true },
      create: {
        code: 'PARKING',
        nameEn: 'Parking',
        nameAr: 'موقف سيارات',
        category: 'amenities',
      },
    });
    featureId = feature.id;

    const media = await prisma.mediaAsset.create({
      data: {
        url: 'https://cdn.example.com/properties/primary.jpg',
        publicId: `aqarmap/public/${suffix}-primary`,
        fileName: 'primary.jpg',
        mimeType: 'image/jpeg',
        folder: 'aqarmap/properties',
        uploadedById: ownerId,
      },
    });
    mediaAssetId = media.id;

    const published = await prisma.property.create({
      data: {
        ownerId,
        title: `Published Flat ${suffix}`,
        slug: `published-flat-${suffix}`,
        description: 'Bright published apartment',
        status: PropertyStatus.PUBLISHED,
        price: 2000000,
        currency: 'EGP',
        bedrooms: 3,
        bathrooms: 2,
        areaSqm: 140,
        propertyTypeId,
        transactionTypeId,
        areaId,
        districtId,
        publishedAt: new Date('2026-01-10T10:00:00.000Z'),
        images: {
          create: {
            mediaAssetId,
            isPrimary: true,
            sortOrder: 0,
          },
        },
        features: {
          create: { featureId },
        },
      },
    });
    publishedId = published.id;
    publishedSlug = published.slug;

    const expensive = await prisma.property.create({
      data: {
        ownerId,
        title: `Published Villa ${suffix}`,
        slug: `published-villa-${suffix}`,
        status: PropertyStatus.PUBLISHED,
        price: 5000000,
        currency: 'EGP',
        bedrooms: 5,
        bathrooms: 4,
        areaSqm: 300,
        propertyTypeId,
        transactionTypeId,
        areaId,
        publishedAt: new Date('2026-02-01T10:00:00.000Z'),
      },
    });
    publishedExpensiveId = expensive.id;

    const draft = await prisma.property.create({
      data: {
        ownerId,
        title: `Draft Hidden ${suffix}`,
        slug: `draft-hidden-${suffix}`,
        status: PropertyStatus.DRAFT,
        price: 1500000,
        propertyTypeId,
        transactionTypeId,
        areaId,
      },
    });
    draftId = draft.id;
    draftSlug = draft.slug;
  });

  afterAll(async () => {
    await prisma.propertyFeature.deleteMany({
      where: { propertyId: { in: [publishedId, publishedExpensiveId, draftId] } },
    });
    await prisma.propertyImage.deleteMany({
      where: { propertyId: { in: [publishedId, publishedExpensiveId, draftId] } },
    });
    await prisma.property.deleteMany({
      where: { id: { in: [publishedId, publishedExpensiveId, draftId] } },
    });
    await prisma.mediaAsset.deleteMany({ where: { id: mediaAssetId } });
    await prisma.district.deleteMany({ where: { id: districtId } });
    await prisma.area.deleteMany({ where: { id: areaId } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await prisma.country.deleteMany({ where: { id: countryId } });
    await app.close();
  });

  it('search returns only published properties', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ areaId })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const ids = (res.body.data as Array<{ id: string }>).map((p) => p.id);
    expect(ids).toContain(publishedId);
    expect(ids).toContain(publishedExpensiveId);
    expect(ids).not.toContain(draftId);

    const card = res.body.data.find((p: { id: string }) => p.id === publishedId);
    expect(card).toMatchObject({
      id: publishedId,
      slug: publishedSlug,
      title: `Published Flat ${suffix}`,
      price: 2000000,
      currency: 'EGP',
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 140,
    });
    expect(card.primaryImage.url).toContain('primary.jpg');
    expect(card.location.summary).toContain(`Public Area ${suffix}`);
    expect(card.propertyType.code).toBe('APARTMENT');
    expect(card.transactionType.code).toBe('SALE');
  });

  it('filters work', async () => {
    const byPrice = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({
        areaId,
        priceMin: 4500000,
        priceMax: 6000000,
      })
      .expect(200);

    const priceIds = (byPrice.body.data as Array<{ id: string }>).map((p) => p.id);
    expect(priceIds).toContain(publishedExpensiveId);
    expect(priceIds).not.toContain(publishedId);

    const byBedrooms = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ areaId, bedrooms: 3 })
      .expect(200);

    const bedroomIds = (byBedrooms.body.data as Array<{ id: string }>).map(
      (p) => p.id,
    );
    expect(bedroomIds).toContain(publishedId);
    expect(bedroomIds).not.toContain(publishedExpensiveId);

    const byFeature = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ areaId, featureIds: [featureId] })
      .expect(200);

    const featureIds = (byFeature.body.data as Array<{ id: string }>).map(
      (p) => p.id,
    );
    expect(featureIds).toContain(publishedId);
    expect(featureIds).not.toContain(publishedExpensiveId);

    const byCountry = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ countryId })
      .expect(200);

    expect(
      (byCountry.body.data as Array<{ id: string }>).some((p) => p.id === publishedId),
    ).toBe(true);
  });

  it('pagination works', async () => {
    const page1 = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ areaId, page: 1, limit: 1, sort: 'price_asc' })
      .expect(200);

    expect(page1.body.meta).toMatchObject({
      page: 1,
      limit: 1,
    });
    expect(page1.body.meta.total).toBeGreaterThanOrEqual(2);
    expect(page1.body.meta.totalPages).toBeGreaterThanOrEqual(2);
    expect(page1.body.data).toHaveLength(1);
    expect(page1.body.data[0].id).toBe(publishedId);

    const page2 = await request(app.getHttpServer())
      .get('/api/v1/properties')
      .query({ areaId, page: 2, limit: 1, sort: 'price_asc' })
      .expect(200);

    expect(page2.body.data).toHaveLength(1);
    expect(page2.body.data[0].id).toBe(publishedExpensiveId);
  });

  it('details returns published property', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/properties/${publishedSlug}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: publishedId,
      slug: publishedSlug,
      title: `Published Flat ${suffix}`,
      description: 'Bright published apartment',
      price: 2000000,
      currency: 'EGP',
    });
    expect(res.body.data.images[0]).toMatchObject({
      url: expect.stringContaining('primary.jpg'),
      isPrimary: true,
      sortOrder: 0,
    });
    expect(res.body.data.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: featureId,
          nameEn: 'Parking',
        }),
      ]),
    );
    expect(res.body.data.area.id).toBe(areaId);
    expect(res.body.data.city.id).toBe(cityId);
    expect(res.body.data.country.id).toBe(countryId);
    expect(res.body.data.similar).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: publishedExpensiveId }),
      ]),
    );
  });

  it('draft property is hidden from public details', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/properties/${draftSlug}`)
      .expect(404);
  });

  it('owner private fields are hidden', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/properties/${publishedSlug}`)
      .expect(200);

    expect(res.body.data.owner).toEqual({
      id: ownerId,
      name: 'Eslam Elbarbary',
      avatarUrl: 'https://cdn.example.com/avatars/eslam.jpg',
    });
    expect(res.body.data.owner).not.toHaveProperty('passwordHash');
    expect(res.body.data.owner).not.toHaveProperty('email');
    expect(res.body.data.owner).not.toHaveProperty('phone');
    expect(res.body.data.owner).not.toHaveProperty('refreshTokens');
    expect(JSON.stringify(res.body.data)).not.toContain('should-never-leak');
    expect(JSON.stringify(res.body.data)).not.toContain('passwordHash');
  });
});
