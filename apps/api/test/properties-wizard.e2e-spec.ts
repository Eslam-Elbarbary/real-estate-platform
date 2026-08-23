import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RentPeriod, RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Properties wizard steps (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  let propertyTypeId: string;
  let transactionTypeId: string;
  let areaId: string;
  let districtId: string;
  const featureIds: string[] = [];

  const uniqueEmail = () => {
    emailCounter += 1;
    return `properties.wizard.e2e.${Date.now()}.${emailCounter}@example.com`;
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

    const suffix = Date.now().toString(36);
    const country = await prisma.country.create({
      data: {
        code: `W${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Wizard Land ${suffix}`,
        nameAr: `أرض المعالج ${suffix}`,
      },
    });
    const city = await prisma.city.create({
      data: {
        countryId: country.id,
        slug: `wizard-city-${suffix}`,
        nameEn: `Wizard City ${suffix}`,
      },
    });
    const area = await prisma.area.create({
      data: {
        cityId: city.id,
        slug: `wizard-area-${suffix}`,
        nameEn: `Wizard Area ${suffix}`,
      },
    });
    areaId = area.id;
    const district = await prisma.district.create({
      data: {
        areaId: area.id,
        slug: `wizard-district-${suffix}`,
        nameEn: `Wizard District ${suffix}`,
      },
    });
    districtId = district.id;

    const seeded = [
      { code: 'PARKING', nameEn: 'Parking', nameAr: 'موقف سيارات' },
      { code: 'ELEVATOR', nameEn: 'Elevator', nameAr: 'مصعد' },
      { code: 'BALCONY', nameEn: 'Balcony', nameAr: 'شرفة' },
    ];
    for (const item of seeded) {
      const feature = await prisma.feature.upsert({
        where: { code: item.code },
        update: {
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          isActive: true,
        },
        create: item,
      });
      featureIds.push(feature.id);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('updates basic step and regenerates slug', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}/basic`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Nasr City Apartment',
        propertyTypeId,
        transactionTypeId,
      })
      .expect(200);

    expect(res.body.data.title).toBe('Nasr City Apartment');
    expect(res.body.data.slug).toContain('nasr-city-apartment');
    expect(res.body.data.propertyTypeId).toBe(propertyTypeId);
    expect(res.body.data.transactionTypeId).toBe(transactionTypeId);
  });

  it('updates location step', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}/location`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        areaId,
        districtId,
        address: '12 Test Street',
        latitude: 30.0444,
        longitude: 31.2357,
      })
      .expect(200);

    expect(res.body.data.areaId).toBe(areaId);
    expect(res.body.data.districtId).toBe(districtId);
    expect(res.body.data.address).toBe('12 Test Street');
    expect(res.body.data.latitude).toBe(30.0444);
  });

  it('updates details step', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bedrooms: 3,
        bathrooms: 2,
        areaSqm: 160,
        floor: 4,
        yearBuilt: 2019,
        furnished: true,
        rentPeriod: RentPeriod.MONTHLY,
      })
      .expect(200);

    expect(res.body.data.bedrooms).toBe(3);
    expect(res.body.data.bathrooms).toBe(2);
    expect(res.body.data.areaSqm).toBe(160);
    expect(res.body.data.yearBuilt).toBe(2019);
    expect(res.body.data.furnished).toBe(true);
    expect(res.body.data.rentPeriod).toBe(RentPeriod.MONTHLY);
  });

  it('rejects invalid location references', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}/location`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ areaId: 'nonexistent-area-id' })
      .expect(400);
  });

  it('retrieves public features catalog', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/features')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    expect(res.body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nameEn: expect.any(String),
      }),
    );
    expect(res.body.data[0].isActive).toBeUndefined();
    expect(res.body.data[0].code).toBeUndefined();
  });

  it('attaches features to a draft', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    const res = await request(app.getHttpServer())
      .put(`/api/v1/properties/me/${id}/features`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ featureIds: [featureIds[0], featureIds[1]] })
      .expect(200);

    expect(res.body.data.features).toHaveLength(2);
    expect(res.body.data.features.map((f: { id: string }) => f.id).sort()).toEqual(
      [featureIds[0], featureIds[1]].sort(),
    );
  });

  it('replaces features safely', async () => {
    const { accessToken } = await registerAndLogin();
    const id = await createDraft(accessToken);

    await request(app.getHttpServer())
      .put(`/api/v1/properties/me/${id}/features`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ featureIds: [featureIds[0], featureIds[1]] })
      .expect(200);

    const res = await request(app.getHttpServer())
      .put(`/api/v1/properties/me/${id}/features`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ featureIds: [featureIds[2]] })
      .expect(200);

    expect(res.body.data.features).toHaveLength(1);
    expect(res.body.data.features[0].id).toBe(featureIds[2]);
  });

  it('protects ownership on wizard endpoints', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();
    const id = await createDraft(owner.accessToken);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}/basic`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ title: 'Hacked title' })
      .expect(404);

    await request(app.getHttpServer())
      .put(`/api/v1/properties/me/${id}/features`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ featureIds: [featureIds[0]] })
      .expect(404);
  });
});
