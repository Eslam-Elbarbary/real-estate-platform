import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyStatus, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Notes (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  const suffix = Date.now().toString(36);

  let propertyId: string;
  let ownerId: string;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `notes.e2e.${Date.now()}.${emailCounter}@example.com`;
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

    const property = await prisma.property.create({
      data: {
        ownerId,
        title: `Note Target ${suffix}`,
        slug: `note-target-${suffix}`,
        status: PropertyStatus.DRAFT,
      },
    });
    propertyId = property.id;
  });

  afterAll(async () => {
    await prisma.propertyNote.deleteMany({ where: { propertyId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await app.close();
  });

  it('creates a note', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/${propertyId}/notes`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Check finishing quality' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      propertyId,
      content: 'Check finishing quality',
    });
    expect(res.body.data.id).toBeTruthy();
  });

  it('updates a note', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post(`/api/v1/properties/${propertyId}/notes`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Original note' })
      .expect(201);

    const noteId = created.body.data.id as string;

    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Updated note' })
      .expect(200);

    expect(updated.body.data.content).toBe('Updated note');
  });

  it('deletes a note', async () => {
    const { accessToken } = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post(`/api/v1/properties/${propertyId}/notes`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'To delete' })
      .expect(201);

    const noteId = created.body.data.id as string;

    await request(app.getHttpServer())
      .delete(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const list = await request(app.getHttpServer())
      .get('/api/v1/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      (list.body.data as Array<{ id: string }>).some((n) => n.id === noteId),
    ).toBe(false);
  });

  it('protects note ownership', async () => {
    const owner = await registerAndLogin();
    const other = await registerAndLogin();

    const created = await request(app.getHttpServer())
      .post(`/api/v1/properties/${propertyId}/notes`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({ content: 'Private note' })
      .expect(201);

    const noteId = created.body.data.id as string;

    await request(app.getHttpServer())
      .patch(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ content: 'Hijack' })
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });
});
