import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Developers (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const suffix = Date.now().toString(36);
  const password = 'Password1!';
  let emailCounter = 0;

  let adminToken: string;
  let userToken: string;

  let activeDeveloperId: string;
  let activeDeveloperSlug: string;
  let inactiveDeveloperId: string;
  let inactiveDeveloperSlug: string;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `developers.e2e.${Date.now()}.${emailCounter}@example.com`;
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
        firstName: 'Dev',
        lastName: 'Tester',
        email,
        password,
        phone: '+201000000010',
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

    const active = await prisma.developer.create({
      data: {
        slug: `active-dev-${suffix}`,
        nameEn: `Active Developer ${suffix}`,
        nameAr: 'مطور نشط',
        description: 'Visible on public APIs',
        logoUrl: 'https://cdn.example.com/logo.svg',
        website: 'https://developer.example.com',
        isActive: true,
      },
    });
    activeDeveloperId = active.id;
    activeDeveloperSlug = active.slug;

    const inactive = await prisma.developer.create({
      data: {
        slug: `inactive-dev-${suffix}`,
        nameEn: `Inactive Developer ${suffix}`,
        isActive: false,
      },
    });
    inactiveDeveloperId = inactive.id;
    inactiveDeveloperSlug = inactive.slug;

    const adminUser = await registerUser();
    await assignRole(adminUser.userId, RoleCode.ADMIN);
    adminToken = await loginAs(adminUser.userId);

    const regularUser = await registerUser();
    userToken = regularUser.accessToken;
  });

  afterAll(async () => {
    await prisma.compound.deleteMany({
      where: {
        developerId: { in: [activeDeveloperId, inactiveDeveloperId] },
      },
    });
    await prisma.developer.deleteMany({
      where: { id: { in: [activeDeveloperId, inactiveDeveloperId] } },
    });
    await app.close();
  });

  it('lists active developers publicly with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/developers')
      .query({ page: 1, limit: 10, search: suffix })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 10,
      total: expect.any(Number),
    });

    const slugs = res.body.data.map((item: { slug: string }) => item.slug);
    expect(slugs).toContain(activeDeveloperSlug);
    expect(slugs).not.toContain(inactiveDeveloperSlug);

    for (const item of res.body.data) {
      expect(item).not.toHaveProperty('logoPublicId');
      expect(item).not.toHaveProperty('isActive');
      expect(item).not.toHaveProperty('passwordHash');
      expect(typeof item.compoundCount).toBe('number');
      expect(typeof item.publishedPropertyCount).toBe('number');
    }
  });

  it('returns active developer details by slug', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers/${activeDeveloperSlug}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(activeDeveloperSlug);
    expect(res.body.data.nameEn).toContain('Active Developer');
    expect(Array.isArray(res.body.data.compounds)).toBe(true);
    expect(res.body.data).not.toHaveProperty('logoPublicId');
  });

  it('returns 404 for inactive developer slug on public endpoint', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/developers/${inactiveDeveloperSlug}`)
      .expect(404);
  });

  it('returns 404 for nonexistent developer slug', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/developers/does-not-exist-${suffix}`)
      .expect(404);
  });

  it('rejects unauthenticated admin list', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/developers').expect(401);
  });

  it('rejects USER role on admin list', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/developers')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('allows ADMIN to list, create, update, and deactivate developers', async () => {
    const list = await request(app.getHttpServer())
      .get('/api/v1/admin/developers')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ search: suffix })
      .expect(200);

    expect(list.body.success).toBe(true);
    expect(list.body.data.some((item: { id: string }) => item.id === activeDeveloperId)).toBe(
      true,
    );

    const createSlug = `created-dev-${suffix}`;
    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/developers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: createSlug,
        nameEn: `Created Developer ${suffix}`,
        website: 'https://created.example.com',
      })
      .expect(201);

    expect(created.body.data.slug).toBe(createSlug);
    expect(created.body.data.isActive).toBe(true);

    const duplicate = await request(app.getHttpServer())
      .post('/api/v1/admin/developers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: createSlug,
        nameEn: 'Duplicate Slug Developer',
      })
      .expect(409);

    expect(duplicate.body.success).toBe(false);

    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/admin/developers/${created.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false, nameEn: `Deactivated Developer ${suffix}` })
      .expect(200);

    expect(updated.body.data.isActive).toBe(false);
    expect(updated.body.data.nameEn).toBe(`Deactivated Developer ${suffix}`);

    await request(app.getHttpServer())
      .get(`/api/v1/developers/${createSlug}`)
      .expect(404);

    await prisma.developer.delete({ where: { id: created.body.data.id } });
  });
});
