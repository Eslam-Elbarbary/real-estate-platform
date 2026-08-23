import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Locations (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  let countryId: string;
  let cityId: string;
  let areaId: string;
  let districtId: string;

  const suffix = Date.now().toString(36);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(createGlobalValidationPipe());

    await app.init();
    prisma = app.get(PrismaService);

    const country = await prisma.country.create({
      data: {
        code: `L${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Testland ${suffix}`,
        nameAr: `أرض اختبار ${suffix}`,
        isActive: true,
      },
    });
    countryId = country.id;

    const city = await prisma.city.create({
      data: {
        countryId,
        slug: `test-city-${suffix}`,
        nameEn: `Test City ${suffix}`,
        nameAr: `مدينة اختبار ${suffix}`,
        isActive: true,
      },
    });
    cityId = city.id;

    const area = await prisma.area.create({
      data: {
        cityId,
        slug: `test-area-${suffix}`,
        nameEn: `Test Area ${suffix}`,
        nameAr: `منطقة اختبار ${suffix}`,
        isActive: true,
      },
    });
    areaId = area.id;

    const district = await prisma.district.create({
      data: {
        areaId,
        slug: `test-district-${suffix}`,
        nameEn: `Test District ${suffix}`,
        nameAr: `حي اختبار ${suffix}`,
        isActive: true,
      },
    });
    districtId = district.id;
  });

  afterAll(async () => {
    if (districtId) {
      await prisma.district.deleteMany({ where: { id: districtId } });
    }
    if (areaId) {
      await prisma.area.deleteMany({ where: { id: areaId } });
    }
    if (cityId) {
      await prisma.city.deleteMany({ where: { id: cityId } });
    }
    if (countryId) {
      await prisma.country.deleteMany({ where: { id: countryId } });
    }
    await app.close();
  });

  it('gets countries', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/locations/countries')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const match = res.body.data.find(
      (item: { id: string }) => item.id === countryId,
    );
    expect(match).toMatchObject({
      id: countryId,
      nameEn: expect.stringContaining('Testland'),
      nameAr: expect.stringContaining('أرض'),
    });
    expect(match.code).toBeDefined();
    expect(match.isActive).toBeUndefined();
    expect(match.createdAt).toBeUndefined();
  });

  it('gets cities for a country', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/locations/countries/${countryId}/cities`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: cityId,
          countryId,
          slug: expect.stringContaining('test-city'),
          nameEn: expect.stringContaining('Test City'),
          nameAr: expect.stringContaining('مدينة'),
        }),
      ]),
    );
  });

  it('gets areas for a city', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/locations/cities/${cityId}/areas`)
      .expect(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: areaId,
          cityId,
          nameEn: expect.stringContaining('Test Area'),
          nameAr: expect.stringContaining('منطقة'),
        }),
      ]),
    );
  });

  it('gets districts for an area', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/locations/areas/${areaId}/districts`)
      .expect(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: districtId,
          areaId,
          nameEn: expect.stringContaining('Test District'),
          nameAr: expect.stringContaining('حي'),
        }),
      ]),
    );
  });

  it('returns full location tree', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/locations/tree')
      .expect(200);

    const country = res.body.data.find(
      (item: { id: string }) => item.id === countryId,
    );
    expect(country).toBeDefined();
    expect(country.cities[0].id).toBe(cityId);
    expect(country.cities[0].areas[0].id).toBe(areaId);
    expect(country.cities[0].areas[0].districts[0].id).toBe(districtId);
  });

  it('handles invalid parent ids with 404', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/locations/countries/nonexistent-country-id/cities')
      .expect(404);

    await request(app.getHttpServer())
      .get('/api/v1/locations/cities/nonexistent-city-id/areas')
      .expect(404);

    await request(app.getHttpServer())
      .get('/api/v1/locations/areas/nonexistent-area-id/districts')
      .expect(404);
  });
});
