import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanStatus } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Plans (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const suffix = Date.now().toString(36);
  const activeCode = `PLAN_ACTIVE_${suffix}`.slice(0, 40);
  const inactiveCode = `PLAN_INACTIVE_${suffix}`.slice(0, 40);

  let activePlanId: string;
  let inactivePlanId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(createGlobalValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);

    const active = await prisma.plan.create({
      data: {
        code: activeCode,
        name: `Active Plan ${suffix}`,
        price: 199,
        durationDays: 30,
        status: PlanStatus.ACTIVE,
        features: { listingLimit: 2, featuredBoost: false },
      },
    });
    activePlanId = active.id;

    const inactive = await prisma.plan.create({
      data: {
        code: inactiveCode,
        name: `Inactive Plan ${suffix}`,
        price: 99,
        durationDays: 15,
        status: PlanStatus.INACTIVE,
        features: { listingLimit: 1, featuredBoost: false },
      },
    });
    inactivePlanId = inactive.id;
  });

  afterAll(async () => {
    await prisma.plan.deleteMany({
      where: { id: { in: [activePlanId, inactivePlanId] } },
    });
    await app.close();
  });

  it('lists active plans', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/plans')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const plan = res.body.data.find(
      (item: { id: string }) => item.id === activePlanId,
    );
    expect(plan).toMatchObject({
      id: activePlanId,
      name: `Active Plan ${suffix}`,
      code: activeCode,
      price: 199,
      durationDays: 30,
      status: PlanStatus.ACTIVE,
    });
    expect(plan.features).toEqual({
      listingLimit: 2,
      featuredBoost: false,
    });
    expect(plan).not.toHaveProperty('createdAt');
    expect(plan).not.toHaveProperty('updatedAt');
  });

  it('hides inactive plans', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/plans')
      .expect(200);

    const ids = (res.body.data as Array<{ id: string }>).map((p) => p.id);
    expect(ids).toContain(activePlanId);
    expect(ids).not.toContain(inactivePlanId);

    const statuses = (res.body.data as Array<{ status: string }>).map(
      (p) => p.status,
    );
    expect(statuses.every((status) => status === PlanStatus.ACTIVE)).toBe(true);
  });
});
