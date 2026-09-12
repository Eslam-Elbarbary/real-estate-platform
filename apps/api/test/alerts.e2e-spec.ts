import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Alerts (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `alerts.e2e.${Date.now()}.${emailCounter}@example.com`;
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

  it('creates an alert', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Nasr City under 3M',
        filters: { areaId: 'area-1', priceMax: 3000000, bedrooms: 3 },
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      name: 'Nasr City under 3M',
      filters: { areaId: 'area-1', priceMax: 3000000, bedrooms: 3 },
      isActive: true,
    });
    expect(res.body.data.id).toBeTruthy();
  });

  it('lists alerts', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'List alert',
        filters: { cityId: 'city-1' },
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toBe('List alert');
  });

  it('deletes an alert', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Delete me',
        filters: { priceMin: 1000000 },
      })
      .expect(201);

    const alertId = created.body.data.id as string;

    await request(app.getHttpServer())
      .delete(`/api/v1/alerts/${alertId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const list = await request(app.getHttpServer())
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      (list.body.data as Array<{ id: string }>).some((a) => a.id === alertId),
    ).toBe(false);
  });
});
