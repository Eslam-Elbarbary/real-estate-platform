import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyStatus, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Compounds (e2e)', () => {
  jest.setTimeout(120_000);

  let app: INestApplication<App>;
  let prisma: PrismaService;

  const suffix = Date.now().toString(36);
  const password = 'Password1!';
  let emailCounter = 0;

  let adminToken: string;
  let userToken: string;

  let countryId: string;
  let cityId: string;
  let areaId: string;
  let otherAreaId: string;

  let activeDeveloperId: string;
  let inactiveDeveloperId: string;

  let activeCompoundId: string;
  let activeCompoundSlug: string;
  let inactiveCompoundId: string;
  let inactiveCompoundSlug: string;

  let ownerId: string;
  let propertyTypeId: string;
  let transactionTypeId: string;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `compounds.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const ensureRole = async (code: RoleCode, name: string) => {
    await prisma.role.upsert({
      where: { code },
      update: { name },
      create: { code, name, description: `${name} role` },
    });
  };

  const registerUser = async () => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName: 'Compound',
        lastName: 'Tester',
        email,
        password,
        phone: '+201000000011',
      })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    return {
      userId: register.body.data.user.id as string,
      accessToken: login.body.data.accessToken as string,
    };
  };

  const assignRole = async (userId: string, roleCode: RoleCode) => {
    const role = await prisma.role.findUniqueOrThrow({ where: { code: roleCode } });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      update: {},
      create: { userId, roleId: role.id },
    });
  };

  const loginAs = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password })
      .expect(200);
    return login.body.data.accessToken as string;
  };

  const createProperty = async (
    status: PropertyStatus,
    compoundId: string,
    slug: string,
  ) => {
    return prisma.property.create({
      data: {
        ownerId,
        compoundId,
        propertyTypeId,
        transactionTypeId,
        areaId,
        slug,
        title: `Listing ${slug}`,
        status,
        price: 2500000,
        publishedAt: status === PropertyStatus.PUBLISHED ? new Date() : null,
      },
    });
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

    await ensureRole(RoleCode.USER, 'User');
    await ensureRole(RoleCode.ADMIN, 'Admin');

    const country = await prisma.country.create({
      data: {
        code: `C${suffix}`.slice(0, 12).toUpperCase(),
        nameEn: `Compound Country ${suffix}`,
        isActive: true,
      },
    });
    countryId = country.id;

    const city = await prisma.city.create({
      data: {
        countryId,
        slug: `compound-city-${suffix}`,
        nameEn: `Compound City ${suffix}`,
        isActive: true,
      },
    });
    cityId = city.id;

    const area = await prisma.area.create({
      data: {
        cityId,
        slug: `compound-area-${suffix}`,
        nameEn: `Compound Area ${suffix}`,
        isActive: true,
      },
    });
    areaId = area.id;

    const otherArea = await prisma.area.create({
      data: {
        cityId,
        slug: `compound-area-other-${suffix}`,
        nameEn: `Other Area ${suffix}`,
        isActive: true,
      },
    });
    otherAreaId = otherArea.id;

    const activeDeveloper = await prisma.developer.create({
      data: {
        slug: `compound-dev-${suffix}`,
        nameEn: `Compound Developer ${suffix}`,
        isActive: true,
      },
    });
    activeDeveloperId = activeDeveloper.id;

    const inactiveDeveloper = await prisma.developer.create({
      data: {
        slug: `compound-inactive-dev-${suffix}`,
        nameEn: `Inactive Compound Developer ${suffix}`,
        isActive: false,
      },
    });
    inactiveDeveloperId = inactiveDeveloper.id;

    const activeCompound = await prisma.compound.create({
      data: {
        slug: `active-compound-${suffix}`,
        nameEn: `Active Compound ${suffix}`,
        description: 'Public compound listing test',
        areaId,
        developerId: activeDeveloperId,
        isActive: true,
        coverUrl: 'https://cdn.example.com/compounds/active.jpg',
      },
    });
    activeCompoundId = activeCompound.id;
    activeCompoundSlug = activeCompound.slug;

    const inactiveCompound = await prisma.compound.create({
      data: {
        slug: `inactive-compound-${suffix}`,
        nameEn: `Inactive Compound ${suffix}`,
        areaId,
        developerId: activeDeveloperId,
        isActive: false,
      },
    });
    inactiveCompoundId = inactiveCompound.id;
    inactiveCompoundSlug = inactiveCompound.slug;

    const owner = await registerUser();
    ownerId = owner.userId;

    const propertyType = await prisma.propertyType.upsert({
      where: { code: 'APARTMENT' },
      update: { nameEn: 'Apartment', isActive: true },
      create: {
        code: 'APARTMENT',
        nameEn: 'Apartment',
        isActive: true,
      },
    });
    propertyTypeId = propertyType.id;

    const transactionType = await prisma.transactionType.upsert({
      where: { code: 'SALE' },
      update: { nameEn: 'Sale', isActive: true },
      create: {
        code: 'SALE',
        nameEn: 'Sale',
        isActive: true,
      },
    });
    transactionTypeId = transactionType.id;

    await createProperty(
      PropertyStatus.PUBLISHED,
      activeCompoundId,
      `published-1-${suffix}`,
    );
    await createProperty(
      PropertyStatus.PUBLISHED,
      activeCompoundId,
      `published-2-${suffix}`,
    );
    await createProperty(
      PropertyStatus.DRAFT,
      activeCompoundId,
      `draft-${suffix}`,
    );
    await createProperty(
      PropertyStatus.PENDING_REVIEW,
      activeCompoundId,
      `pending-${suffix}`,
    );

    const adminUser = await registerUser();
    await assignRole(adminUser.userId, RoleCode.ADMIN);
    adminToken = await loginAs(adminUser.userId);

    const regularUser = await registerUser();
    userToken = regularUser.accessToken;
  });

  afterAll(async () => {
    await prisma.property.deleteMany({
      where: { compoundId: { in: [activeCompoundId, inactiveCompoundId] } },
    });
    await prisma.compound.deleteMany({
      where: { id: { in: [activeCompoundId, inactiveCompoundId] } },
    });
    await prisma.developer.deleteMany({
      where: { id: { in: [activeDeveloperId, inactiveDeveloperId] } },
    });
    await prisma.area.deleteMany({ where: { id: { in: [areaId, otherAreaId] } } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await prisma.country.deleteMany({ where: { id: countryId } });
    await app.close();
  });

  it('lists active compounds publicly with pagination and search', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/compounds')
      .query({ page: 1, limit: 10, search: suffix })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.meta.page).toBe(1);

    const slugs = res.body.data.map((item: { slug: string }) => item.slug);
    expect(slugs).toContain(activeCompoundSlug);
    expect(slugs).not.toContain(inactiveCompoundSlug);

    for (const item of res.body.data) {
      expect(item).not.toHaveProperty('coverPublicId');
      expect(item).not.toHaveProperty('isActive');
      expect(item.location.area).toBeDefined();
      expect(item.location.city).toBeDefined();
      expect(item.location.country).toBeDefined();
    }
  });

  it('filters compounds by developer and area', async () => {
    const byDeveloper = await request(app.getHttpServer())
      .get('/api/v1/compounds')
      .query({ developerId: activeDeveloperId, search: suffix })
      .expect(200);

    expect(
      byDeveloper.body.data.every(
        (item: { developer: { id: string } | null }) => item.developer?.id === activeDeveloperId,
      ),
    ).toBe(true);

    const byArea = await request(app.getHttpServer())
      .get('/api/v1/compounds')
      .query({ areaId, search: suffix })
      .expect(200);

    expect(byArea.body.data.some((item: { slug: string }) => item.slug === activeCompoundSlug)).toBe(
      true,
    );

    const byCity = await request(app.getHttpServer())
      .get('/api/v1/compounds')
      .query({ cityId, search: suffix })
      .expect(200);

    expect(byCity.body.data.some((item: { slug: string }) => item.slug === activeCompoundSlug)).toBe(
      true,
    );
  });

  it('returns compound details with published property count and cards only', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/compounds/${activeCompoundSlug}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(activeCompoundSlug);
    expect(res.body.data.publishedPropertyCount).toBe(2);
    expect(res.body.data.properties).toHaveLength(2);

    for (const property of res.body.data.properties) {
      expect(property).not.toHaveProperty('owner');
      expect(property.slug).toMatch(/^published-/);
    }

    expect(res.body.data.developer.id).toBe(activeDeveloperId);
    expect(res.body.data.location.area.id).toBe(areaId);
  });

  it('returns 404 for inactive and missing compound slugs', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/compounds/${inactiveCompoundSlug}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/api/v1/compounds/missing-compound-${suffix}`)
      .expect(404);
  });

  it('hides compounds tied to inactive developers on public endpoints', async () => {
    const hiddenCompound = await prisma.compound.create({
      data: {
        slug: `hidden-by-dev-${suffix}`,
        nameEn: `Hidden Compound ${suffix}`,
        areaId,
        developerId: inactiveDeveloperId,
        isActive: true,
      },
    });

    const list = await request(app.getHttpServer())
      .get('/api/v1/compounds')
      .query({ search: hiddenCompound.slug })
      .expect(200);

    expect(list.body.data).toHaveLength(0);

    await request(app.getHttpServer())
      .get(`/api/v1/compounds/${hiddenCompound.slug}`)
      .expect(404);

    await prisma.compound.delete({ where: { id: hiddenCompound.id } });
  });

  it('rejects unauthenticated and USER admin access', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/compounds').expect(401);

    await request(app.getHttpServer())
      .get('/api/v1/admin/compounds')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('allows ADMIN to create, update, deactivate, and validate compound references', async () => {
    const createSlug = `created-compound-${suffix}`;
    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/compounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: createSlug,
        nameEn: `Created Compound ${suffix}`,
        areaId,
        developerId: activeDeveloperId,
      })
      .expect(201);

    expect(created.body.data.slug).toBe(createSlug);

    await request(app.getHttpServer())
      .post('/api/v1/admin/compounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: createSlug,
        nameEn: 'Duplicate Compound',
        areaId,
      })
      .expect(409);

    await request(app.getHttpServer())
      .post('/api/v1/admin/compounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: `invalid-area-${suffix}`,
        nameEn: 'Invalid Area Compound',
        areaId: 'nonexistent-area-id',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/admin/compounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: `invalid-dev-${suffix}`,
        nameEn: 'Invalid Developer Compound',
        areaId,
        developerId: inactiveDeveloperId,
      })
      .expect(400);

    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/admin/compounds/${created.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isActive: false,
        areaId: otherAreaId,
        nameEn: `Updated Compound ${suffix}`,
      })
      .expect(200);

    expect(updated.body.data.isActive).toBe(false);
    expect(updated.body.data.areaId).toBe(otherAreaId);

    await request(app.getHttpServer())
      .get(`/api/v1/compounds/${createSlug}`)
      .expect(404);

    await prisma.compound.delete({ where: { id: created.body.data.id } });
  });
});
