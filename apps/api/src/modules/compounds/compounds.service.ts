import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompoundDto } from './dto/create-compound.dto';
import { ListAdminCompoundsQueryDto } from './dto/list-admin-compounds-query.dto';
import { ListCompoundsQueryDto } from './dto/list-compounds-query.dto';
import { UpdateCompoundDto } from './dto/update-compound.dto';
import {
  AdminCompoundDetailsDto,
  AdminCompoundDto,
  COMPOUND_CARD_INCLUDE,
  COMPOUND_DETAIL_PROPERTY_LIMIT,
  COMPOUND_PROPERTY_CARD_INCLUDE,
  CompoundCardSource,
  PublicCompoundCardDto,
  PublicCompoundDetailsDto,
  buildCompoundAdminWhere,
  buildCompoundPublicWhere,
  toAdminCompound,
  toAdminCompoundDetails,
  toPublicCompoundCard,
  toPublicCompoundDetails,
} from './mapper/compound.mapper';
import { PropertyCardSource } from '../properties/mapper/property-public.mapper';

@Injectable()
export class CompoundsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListCompoundsQueryDto): Promise<{
    data: PublicCompoundCardDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = buildCompoundPublicWhere({
      search: query.search,
      developerId: query.developerId,
      areaId: query.areaId,
      cityId: query.cityId,
    });

    const [total, rows] = await Promise.all([
      this.prisma.compound.count({ where }),
      this.prisma.compound.findMany({
        where,
        include: COMPOUND_CARD_INCLUDE,
        orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    const propertyCounts = await this.loadPublishedPropertyCountsByCompound(
      rows.map((row) => row.id),
    );

    return {
      data: rows.map((row) =>
        toPublicCompoundCard(
          row as CompoundCardSource,
          propertyCounts.get(row.id) ?? 0,
        ),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getPublicBySlug(slug: string): Promise<PublicCompoundDetailsDto> {
    const compound = await this.prisma.compound.findFirst({
      where: {
        slug,
        isActive: true,
        OR: [{ developerId: null }, { developer: { isActive: true } }],
      },
      include: COMPOUND_CARD_INCLUDE,
    });

    if (!compound) {
      throw new NotFoundException('Compound not found');
    }

    const [publishedPropertyCount, properties] = await Promise.all([
      this.prisma.property.count({
        where: {
          compoundId: compound.id,
          status: PropertyStatus.PUBLISHED,
        },
      }),
      this.prisma.property.findMany({
        where: {
          compoundId: compound.id,
          status: PropertyStatus.PUBLISHED,
        },
        include: COMPOUND_PROPERTY_CARD_INCLUDE,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: COMPOUND_DETAIL_PROPERTY_LIMIT,
      }),
    ]);

    return toPublicCompoundDetails(
      compound as CompoundCardSource,
      publishedPropertyCount,
      properties as PropertyCardSource[],
    );
  }

  async listAdmin(query: ListAdminCompoundsQueryDto): Promise<{
    data: AdminCompoundDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = buildCompoundAdminWhere({
      search: query.search,
      developerId: query.developerId,
      areaId: query.areaId,
      isActive: query.isActive,
    });

    const [total, rows] = await Promise.all([
      this.prisma.compound.count({ where }),
      this.prisma.compound.findMany({
        where,
        orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    const propertyCounts = await this.loadPublishedPropertyCountsByCompound(
      rows.map((row) => row.id),
    );

    return {
      data: rows.map((row) =>
        toAdminCompound(row, propertyCounts.get(row.id) ?? 0),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getAdminById(id: string): Promise<AdminCompoundDetailsDto> {
    const compound = await this.prisma.compound.findUnique({
      where: { id },
      include: COMPOUND_CARD_INCLUDE,
    });

    if (!compound) {
      throw new NotFoundException('Compound not found');
    }

    const publishedPropertyCount = await this.prisma.property.count({
      where: {
        compoundId: compound.id,
        status: PropertyStatus.PUBLISHED,
      },
    });

    return toAdminCompoundDetails(
      compound as CompoundCardSource,
      publishedPropertyCount,
    );
  }

  async createAdmin(dto: CreateCompoundDto): Promise<AdminCompoundDto> {
    await this.assertSlugAvailable(dto.slug);
    await this.assertActiveArea(dto.areaId);

    if (dto.developerId) {
      await this.assertActiveDeveloper(dto.developerId);
    }

    try {
      const created = await this.prisma.compound.create({
        data: {
          slug: dto.slug,
          areaId: dto.areaId,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() ?? null,
          description: dto.description?.trim() ?? null,
          developerId: dto.developerId ?? null,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          coverUrl: dto.coverUrl ?? null,
          coverPublicId: dto.coverPublicId ?? null,
          isActive: dto.isActive ?? true,
        },
      });

      return toAdminCompound(created, 0);
    } catch (error) {
      this.rethrowUniqueSlug(error);
      this.rethrowForeignKey(error);
      throw error;
    }
  }

  async updateAdmin(id: string, dto: UpdateCompoundDto): Promise<AdminCompoundDto> {
    const existing = await this.prisma.compound.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Compound not found');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }

    if (dto.areaId) {
      await this.assertActiveArea(dto.areaId);
    }

    if (dto.developerId) {
      await this.assertActiveDeveloper(dto.developerId);
    }

    const data: Prisma.CompoundUpdateInput = {};

    if (dto.slug !== undefined) {
      data.slug = dto.slug;
    }
    if (dto.areaId !== undefined) {
      data.area = { connect: { id: dto.areaId } };
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.trim();
    }
    if (dto.nameAr !== undefined) {
      data.nameAr = dto.nameAr?.trim() ?? null;
    }
    if (dto.description !== undefined) {
      data.description = dto.description?.trim() ?? null;
    }
    if (dto.developerId !== undefined) {
      data.developer =
        dto.developerId === null
          ? { disconnect: true }
          : { connect: { id: dto.developerId } };
    }
    if (dto.latitude !== undefined) {
      data.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      data.longitude = dto.longitude;
    }
    if (dto.coverUrl !== undefined) {
      data.coverUrl = dto.coverUrl;
    }
    if (dto.coverPublicId !== undefined) {
      data.coverPublicId = dto.coverPublicId;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.compound.update({
        where: { id },
        data,
      });

      const publishedPropertyCount = await this.prisma.property.count({
        where: {
          compoundId: updated.id,
          status: PropertyStatus.PUBLISHED,
        },
      });

      return toAdminCompound(updated, publishedPropertyCount);
    } catch (error) {
      this.rethrowUniqueSlug(error);
      this.rethrowForeignKey(error);
      throw error;
    }
  }

  private async assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.compound.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Compound slug already exists');
    }
  }

  private async assertActiveArea(areaId: string): Promise<void> {
    const area = await this.prisma.area.findFirst({
      where: { id: areaId, isActive: true },
      select: { id: true },
    });

    if (!area) {
      throw new BadRequestException('Area not found or inactive');
    }
  }

  private async assertActiveDeveloper(developerId: string): Promise<void> {
    const developer = await this.prisma.developer.findFirst({
      where: { id: developerId, isActive: true },
      select: { id: true },
    });

    if (!developer) {
      throw new BadRequestException('Developer not found or inactive');
    }
  }

  private rethrowUniqueSlug(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Compound slug already exists');
    }
  }

  private rethrowForeignKey(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new BadRequestException('Invalid area or developer reference');
    }
  }

  private async loadPublishedPropertyCountsByCompound(
    compoundIds: string[],
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    if (compoundIds.length === 0) {
      return counts;
    }

    const grouped = await this.prisma.property.groupBy({
      by: ['compoundId'],
      where: {
        compoundId: { in: compoundIds },
        status: PropertyStatus.PUBLISHED,
      },
      _count: { _all: true },
    });

    for (const row of grouped) {
      if (row.compoundId) {
        counts.set(row.compoundId, row._count._all);
      }
    }

    return counts;
  }
}
