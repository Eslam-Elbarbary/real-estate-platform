import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PropertyStatus } from '@/prisma/generated/prisma-client';
import { AdminPropertiesService } from './admin-properties.service';

describe('AdminPropertiesService lifecycle', () => {
  const propertyId = 'prop-1';
  const adminId = 'admin-1';

  function baseProperty(status: PropertyStatus) {
    return {
      id: propertyId,
      slug: 'test-property',
      title: 'Test Property',
      status,
      submittedAt: null,
      reviewedAt: null,
      publishedAt: null,
      archivedAt: null,
      rejectedReason: null,
    };
  }

  function createService(
    property: ReturnType<typeof baseProperty> | null,
  ) {
    const tx = {
      property: {
        update: jest.fn(
          async ({ data }: { data: Record<string, unknown> }) => ({
            ...baseProperty(data.status as PropertyStatus),
            archivedAt: (data.archivedAt as Date | null | undefined) ?? null,
            publishedAt: (data.publishedAt as Date | null | undefined) ?? null,
          }),
        ),
        delete: jest.fn(async () => ({ id: propertyId })),
      },
      propertyStatusHistory: {
        create: jest.fn(async () => ({ id: 'hist-1' })),
      },
    };

    const prisma = {
      property: {
        findUnique: jest.fn(async () => property),
      },
      $transaction: jest.fn(
        async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
      ),
    };

    const service = new AdminPropertiesService(
      prisma as never,
      { create: jest.fn() } as never,
      { matchProperty: jest.fn() } as never,
      { ensureDefaultOwnerContact: jest.fn() } as never,
    );

    return { service, tx };
  }

  it('deletes draft successfully', async () => {
    const { service, tx } = createService(baseProperty(PropertyStatus.DRAFT));

    const result = await service.deleteDraftProperty(adminId, propertyId);

    expect(result.message).toContain('deleted');
    expect(tx.property.delete).toHaveBeenCalledWith({
      where: { id: propertyId },
    });
  });

  it('blocks delete of published property', async () => {
    const { service } = createService(baseProperty(PropertyStatus.PUBLISHED));

    await expect(
      service.deleteDraftProperty(adminId, propertyId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('archives published property and writes status history', async () => {
    const { service, tx } = createService(
      baseProperty(PropertyStatus.PUBLISHED),
    );

    const result = await service.archiveProperty(adminId, propertyId);

    expect(result.status).toBe(PropertyStatus.ARCHIVED);
    expect(tx.propertyStatusHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fromStatus: PropertyStatus.PUBLISHED,
          toStatus: PropertyStatus.ARCHIVED,
        }),
      }),
    );
  });

  it('restores archived property to draft with history', async () => {
    const { service, tx } = createService(
      baseProperty(PropertyStatus.ARCHIVED),
    );

    const result = await service.restoreProperty(adminId, propertyId);

    expect(result.status).toBe(PropertyStatus.DRAFT);
    expect(tx.propertyStatusHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fromStatus: PropertyStatus.ARCHIVED,
          toStatus: PropertyStatus.DRAFT,
          reason: expect.stringContaining('RESTORED'),
        }),
      }),
    );
  });

  it('throws when property is missing', async () => {
    const { service } = createService(null);

    await expect(
      service.deleteDraftProperty(adminId, propertyId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
