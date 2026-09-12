import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadStatus, LeadType, PropertyStatus, RoleCode } from '@/prisma/generated/prisma-client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { createGlobalValidationPipe } from '../src/common/pipes/validation.pipe';
import { PrismaService } from '../src/database/prisma.service';

describe('Leads (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'Password1!';
  let emailCounter = 0;
  const suffix = Date.now().toString(36);

  let sellerToken: string;
  let sellerId: string;
  let buyerToken: string;
  let buyerId: string;
  let otherToken: string;

  let publishedId: string;
  let publishedSlug: string;
  let draftId: string;
  let mediaAssetId: string;

  const uniqueEmail = () => {
    emailCounter += 1;
    return `leads.e2e.${Date.now()}.${emailCounter}@example.com`;
  };

  const registerAndLogin = async (firstName = 'Eslam') => {
    const email = uniqueEmail();
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        firstName,
        lastName: 'Elbarbary',
        email,
        password,
        phone: '+201111111111',
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

    const seller = await registerAndLogin('Seller');
    sellerToken = seller.accessToken;
    sellerId = seller.userId;

    const buyer = await registerAndLogin('Buyer');
    buyerToken = buyer.accessToken;
    buyerId = buyer.userId;

    const other = await registerAndLogin('Other');
    otherToken = other.accessToken;

    await prisma.user.update({
      where: { id: buyerId },
      data: {
        phone: '+201222222222',
        avatarUrl: 'https://cdn.example.com/avatars/buyer.jpg',
      },
    });

    const media = await prisma.mediaAsset.create({
      data: {
        url: 'https://cdn.example.com/leads/primary.jpg',
        publicId: `aqarmap/leads/${suffix}`,
        uploadedById: sellerId,
      },
    });
    mediaAssetId = media.id;

    const published = await prisma.property.create({
      data: {
        ownerId: sellerId,
        title: `Lead Published ${suffix}`,
        slug: `lead-published-${suffix}`,
        status: PropertyStatus.PUBLISHED,
        price: 2200000,
        publishedAt: new Date(),
        images: {
          create: {
            mediaAssetId,
            isPrimary: true,
            sortOrder: 0,
          },
        },
      },
    });
    publishedId = published.id;
    publishedSlug = published.slug;

    const draft = await prisma.property.create({
      data: {
        ownerId: sellerId,
        title: `Lead Draft ${suffix}`,
        slug: `lead-draft-${suffix}`,
        status: PropertyStatus.DRAFT,
      },
    });
    draftId = draft.id;
  });

  afterAll(async () => {
    await prisma.lead.deleteMany({
      where: { propertyId: { in: [publishedId, draftId] } },
    });
    await prisma.propertyImage.deleteMany({ where: { propertyId: publishedId } });
    await prisma.property.deleteMany({
      where: { id: { in: [publishedId, draftId] } },
    });
    await prisma.mediaAsset.deleteMany({ where: { id: mediaAssetId } });
    await app.close();
  });

  it('creates a lead successfully', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/properties/${publishedId}/leads`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        type: LeadType.WHATSAPP,
        message: 'Is the price negotiable?',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      type: LeadType.WHATSAPP,
      status: LeadStatus.NEW,
      message: 'Is the price negotiable?',
      propertyId: publishedId,
    });

    const stored = await prisma.lead.findUniqueOrThrow({
      where: { id: res.body.data.id },
    });
    expect(stored.buyerId).toBe(buyerId);
    expect(stored.sellerId).toBe(sellerId);
    expect(stored.phone).toBe('+201222222222');
  });

  it('cannot create lead for draft property', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/properties/${draftId}/leads`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ type: LeadType.PHONE })
      .expect(400);
  });

  it('buyer can see own leads', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/leads/me')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    const lead = res.body.data.find(
      (item: { property: { id: string } }) => item.property.id === publishedId,
    );
    expect(lead).toMatchObject({
      type: LeadType.WHATSAPP,
      status: LeadStatus.NEW,
      property: {
        id: publishedId,
        slug: publishedSlug,
        title: `Lead Published ${suffix}`,
      },
    });
    expect(lead.property.primaryImage.url).toContain('primary.jpg');
    expect(JSON.stringify(lead)).not.toContain('passwordHash');
  });

  it('seller can see property leads', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/properties/me/leads')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    const lead = res.body.data.find(
      (item: { property: { id: string } }) => item.property.id === publishedId,
    );
    expect(lead).toMatchObject({
      type: LeadType.WHATSAPP,
      buyer: {
        id: buyerId,
        name: 'Buyer Elbarbary',
        phone: '+201222222222',
        avatarUrl: 'https://cdn.example.com/avatars/buyer.jpg',
      },
      property: {
        id: publishedId,
        slug: publishedSlug,
        title: `Lead Published ${suffix}`,
      },
    });
    expect(lead.buyer).not.toHaveProperty('passwordHash');
    expect(lead.buyer).not.toHaveProperty('email');
  });

  it('other users cannot access leads', async () => {
    const buyerLeads = await request(app.getHttpServer())
      .get('/api/v1/leads/me')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(
      (buyerLeads.body.data as Array<{ property: { id: string } }>).some(
        (l) => l.property.id === publishedId,
      ),
    ).toBe(false);

    const sellerLeads = await request(app.getHttpServer())
      .get('/api/v1/properties/me/leads')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(
      (sellerLeads.body.data as Array<{ property: { id: string } }>).some(
        (l) => l.property.id === publishedId,
      ),
    ).toBe(false);

    const lead = await prisma.lead.findFirstOrThrow({
      where: { propertyId: publishedId, buyerId },
    });

    await request(app.getHttpServer())
      .patch(`/api/v1/leads/${lead.id}/status`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ status: LeadStatus.CONTACTED })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/api/v1/leads/${lead.id}/status`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ status: LeadStatus.CONTACTED })
      .expect(403);
  });

  it('seller can update status', async () => {
    const lead = await prisma.lead.findFirstOrThrow({
      where: { propertyId: publishedId, buyerId },
    });

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/leads/${lead.id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ status: LeadStatus.INTERESTED })
      .expect(200);

    expect(res.body.data.status).toBe(LeadStatus.INTERESTED);

    const stored = await prisma.lead.findUniqueOrThrow({
      where: { id: lead.id },
    });
    expect(stored.status).toBe(LeadStatus.INTERESTED);
  });
});
