import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyStatus, RoleCode } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Properties draft (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `properties.e2e.${Date.now()}.${emailCounter}@example.com`;
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a draft property', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(PropertyStatus.DRAFT);
    expect(res.body.data.slug).toMatch(/^draft-/);
    expect(res.body.data.ownerId).toBeUndefined();
    expect(res.body.data.id).toBeDefined();
  });

  it('lists my properties', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'My listing one' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/properties/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(
      res.body.data.every(
        (item: { status: string }) => item.status === PropertyStatus.DRAFT,
      ),
    ).toBe(true);
  });

  it('gets property details for owner', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Detail listing' })
      .expect(201);

    const id = created.body.data.id as string;

    const res = await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.id).toBe(id);
    expect(res.body.data.title).toBe('Detail listing');
    expect(res.body.data.slug).toContain('detail-listing');
  });

  it('updates a draft property and regenerates slug from title', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);

    const id = created.body.data.id as string;

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Nasr City Flat',
        bedrooms: 3,
        bathrooms: 2,
        areaSqm: 140,
        price: 2500000,
        furnished: true,
      })
      .expect(200);

    expect(res.body.data.title).toBe('Updated Nasr City Flat');
    expect(res.body.data.slug).toContain('updated-nasr-city-flat');
    expect(res.body.data.bedrooms).toBe(3);
    expect(res.body.data.price).toBe(2500000);
    expect(res.body.data.areaSqm).toBe(140);
  });

  it('cannot access another user property', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({ title: 'Private draft' })
      .expect(201);

    const id = created.body.data.id as string;

    await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ title: 'Hacked' })
      .expect(404);
  });

  it('cannot update a published property', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Soon published' })
      .expect(201);

    const id = created.body.data.id as string;

    await prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .patch(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Should fail' })
      .expect(403);
  });

  it('deletes a draft property', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/properties/drafts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201);

    const id = created.body.data.id as string;

    await request(app.getHttpServer())
      .delete(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/v1/properties/me/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
