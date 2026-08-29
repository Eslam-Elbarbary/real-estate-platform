import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Catalogs (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const suffix = Date.now().toString(36).toUpperCase();

  let activePropertyTypeId: string;
  let inactivePropertyTypeId: string;
  let activeTransactionTypeId: string;
  let inactiveTransactionTypeId: string;
  let activeFeatureId: string;
  let inactiveFeatureId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(createGlobalValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);

    const activePropertyType = await prisma.propertyType.create({
      data: {
        code: `CAT_PT_A_${suffix}`.slice(0, 40),
        nameEn: `Catalog Active Type ${suffix}`,
        nameAr: 'نوع نشط',
        sortOrder: 1,
        isActive: true,
      },
    });
    activePropertyTypeId = activePropertyType.id;

    const inactivePropertyType = await prisma.propertyType.create({
      data: {
        code: `CAT_PT_I_${suffix}`.slice(0, 40),
        nameEn: `Catalog Inactive Type ${suffix}`,
        isActive: false,
      },
    });
    inactivePropertyTypeId = inactivePropertyType.id;

    const activeTransactionType = await prisma.transactionType.create({
      data: {
        code: `CAT_TT_A_${suffix}`.slice(0, 40),
        nameEn: `Catalog Active Transaction ${suffix}`,
        nameAr: 'بيع',
        isActive: true,
      },
    });
    activeTransactionTypeId = activeTransactionType.id;

    const inactiveTransactionType = await prisma.transactionType.create({
      data: {
        code: `CAT_TT_I_${suffix}`.slice(0, 40),
        nameEn: `Catalog Inactive Transaction ${suffix}`,
        isActive: false,
      },
    });
    inactiveTransactionTypeId = inactiveTransactionType.id;

    const activeFeature = await prisma.feature.create({
      data: {
        code: `CAT_FEAT_A_${suffix}`.slice(0, 40),
        nameEn: `Catalog Active Feature ${suffix}`,
        nameAr: 'ميزة',
        category: 'amenities',
        isActive: true,
      },
    });
    activeFeatureId = activeFeature.id;

    const inactiveFeature = await prisma.feature.create({
      data: {
        code: `CAT_FEAT_I_${suffix}`.slice(0, 40),
        nameEn: `Catalog Inactive Feature ${suffix}`,
        category: 'amenities',
        isActive: false,
      },
    });
    inactiveFeatureId = inactiveFeature.id;
  });

  afterAll(async () => {
    await prisma.feature.deleteMany({
      where: { id: { in: [activeFeatureId, inactiveFeatureId] } },
    });
    await prisma.transactionType.deleteMany({
      where: { id: { in: [activeTransactionTypeId, inactiveTransactionTypeId] } },
    });
    await prisma.propertyType.deleteMany({
      where: { id: { in: [activePropertyTypeId, inactivePropertyTypeId] } },
    });
    await app.close();
  });

  it('GET property-types returns active types only', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/catalogs/property-types')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const ids = (res.body.data as Array<{ id: string }>).map((item) => item.id);
    expect(ids).toContain(activePropertyTypeId);
    expect(ids).not.toContain(inactivePropertyTypeId);

    const item = res.body.data.find(
      (row: { id: string }) => row.id === activePropertyTypeId,
    );
    expect(item).toMatchObject({
      id: activePropertyTypeId,
      code: expect.any(String),
      nameEn: expect.any(String),
      nameAr: 'نوع نشط',
    });
    expect(item).not.toHaveProperty('sortOrder');
    expect(item).not.toHaveProperty('isActive');
    expect(item).not.toHaveProperty('createdAt');
  });

  it('GET transaction-types returns active types only', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/catalogs/transaction-types')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const ids = (res.body.data as Array<{ id: string }>).map((item) => item.id);
    expect(ids).toContain(activeTransactionTypeId);
    expect(ids).not.toContain(inactiveTransactionTypeId);

    const item = res.body.data.find(
      (row: { id: string }) => row.id === activeTransactionTypeId,
    );
    expect(item).toMatchObject({
      code: expect.any(String),
      nameEn: expect.any(String),
      nameAr: 'بيع',
    });
    expect(item).not.toHaveProperty('isActive');
  });

  it('GET features returns active features only', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/catalogs/features')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const ids = (res.body.data as Array<{ id: string }>).map((item) => item.id);
    expect(ids).toContain(activeFeatureId);
    expect(ids).not.toContain(inactiveFeatureId);

    const item = res.body.data.find((row: { id: string }) => row.id === activeFeatureId);
    expect(item).toMatchObject({
      code: expect.any(String),
      nameEn: expect.any(String),
      nameAr: 'ميزة',
      category: 'amenities',
    });
    expect(item).not.toHaveProperty('isActive');
  });

  it('works without authentication', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/catalogs/property-types')
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/catalogs/transaction-types')
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/catalogs/features')
      .expect(200);
  });
});
