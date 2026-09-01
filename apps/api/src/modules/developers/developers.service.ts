import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { ListDevelopersQueryDto } from './dto/list-developers-query.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import {
  AdminDeveloperDetailsDto,
  AdminDeveloperDto,
  PublicDeveloperCardDto,
  PublicDeveloperCompoundSummaryDto,
  PublicDeveloperDetailsDto,
  buildDeveloperSearchWhere,
  toAdminDeveloper,
  toAdminDeveloperDetails,
  toPublicDeveloperCard,
  toPublicDeveloperCompoundSummary,
  toPublicDeveloperDetails,
} from './mapper/developer.mapper';

@Injectable()
export class DevelopersService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListDevelopersQueryDto): Promise<{
    data: PublicDeveloperCardDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = buildDeveloperSearchWhere(query.search, true);

    const [total, rows] = await Promise.all([
      this.prisma.developer.count({ where }),
      this.prisma.developer.findMany({
        where,
        orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    const developerIds = rows.map((row) => row.id);
    const counts = await this.loadDeveloperCounts(developerIds, true);

    return {
      data: rows.map((row) => {
        const stats = counts.get(row.id) ?? { compoundCount: 0, publishedPropertyCount: 0 };
        return toPublicDeveloperCard(row, stats.compoundCount, stats.publishedPropertyCount);
      }),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getPublicBySlug(slug: string): Promise<PublicDeveloperDetailsDto> {
    const developer = await this.prisma.developer.findFirst({
      where: { slug, isActive: true },
    });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    const compounds = await this.prisma.compound.findMany({
      where: { developerId: developer.id, isActive: true },
      orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        nameEn: true,
        nameAr: true,
        coverUrl: true,
      },
    });

    const compoundIds = compounds.map((compound) => compound.id);
    const propertyCountByCompound = await this.loadPublishedPropertyCountsByCompound(
      compoundIds,
    );

    const compoundSummaries: PublicDeveloperCompoundSummaryDto[] = compounds.map(
      (compound) =>
        toPublicDeveloperCompoundSummary({
          ...compound,
          publishedPropertyCount: propertyCountByCompound.get(compound.id) ?? 0,
        }),
    );

    const publishedPropertyCount = compoundSummaries.reduce(
      (sum, compound) => sum + compound.publishedPropertyCount,
      0,
    );

    return toPublicDeveloperDetails(
      developer,
      compoundSummaries.length,
      publishedPropertyCount,
      compoundSummaries,
    );
  }

  async listAdmin(query: ListDevelopersQueryDto): Promise<{
    data: AdminDeveloperDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = buildDeveloperSearchWhere(query.search, false);

    const [total, rows] = await Promise.all([
      this.prisma.developer.count({ where }),
      this.prisma.developer.findMany({
        where,
        include: { _count: { select: { compounds: true } } },
        orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(toAdminDeveloper),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async getAdminById(id: string): Promise<AdminDeveloperDetailsDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: { _count: { select: { compounds: true } } },
    });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    const compounds = await this.prisma.compound.findMany({
      where: { developerId: developer.id },
      orderBy: [{ nameEn: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        nameEn: true,
        nameAr: true,
        coverUrl: true,
      },
    });

    const propertyCountByCompound = await this.loadPublishedPropertyCountsByCompound(
      compounds.map((compound) => compound.id),
    );

    const compoundSummaries = compounds.map((compound) =>
      toPublicDeveloperCompoundSummary({
        ...compound,
        publishedPropertyCount: propertyCountByCompound.get(compound.id) ?? 0,
      }),
    );

    return toAdminDeveloperDetails(developer, compoundSummaries);
  }

  async createAdmin(dto: CreateDeveloperDto): Promise<AdminDeveloperDto> {
    await this.assertSlugAvailable(dto.slug);

    try {
      const created = await this.prisma.developer.create({
        data: {
          slug: dto.slug,
          nameEn: dto.nameEn.trim(),
          nameAr: dto.nameAr?.trim() ?? null,
          description: dto.description?.trim() ?? null,
          logoUrl: dto.logoUrl ?? null,
          logoPublicId: dto.logoPublicId ?? null,
          website: dto.website ?? null,
          isActive: dto.isActive ?? true,
        },
        include: { _count: { select: { compounds: true } } },
      });

      return toAdminDeveloper(created);
    } catch (error) {
      this.rethrowUniqueSlug(error);
      throw error;
    }
  }

  async updateAdmin(id: string, dto: UpdateDeveloperDto): Promise<AdminDeveloperDto> {
    const existing = await this.prisma.developer.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Developer not found');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }

    const data: Prisma.DeveloperUpdateInput = {};

    if (dto.slug !== undefined) {
      data.slug = dto.slug;
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
    if (dto.logoUrl !== undefined) {
      data.logoUrl = dto.logoUrl;
    }
    if (dto.logoPublicId !== undefined) {
      data.logoPublicId = dto.logoPublicId;
    }
    if (dto.website !== undefined) {
      data.website = dto.website;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const updated = await this.prisma.developer.update({
        where: { id },
        data,
        include: { _count: { select: { compounds: true } } },
      });

      return toAdminDeveloper(updated);
    } catch (error) {
      this.rethrowUniqueSlug(error);
      throw error;
    }
  }

  private async assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.developer.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Developer slug already exists');
    }
  }

  private rethrowUniqueSlug(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Developer slug already exists');
    }
  }

  private async loadDeveloperCounts(
    developerIds: string[],
    activeCompoundsOnly: boolean,
  ): Promise<Map<string, { compoundCount: number; publishedPropertyCount: number }>> {
    const result = new Map<string, { compoundCount: number; publishedPropertyCount: number }>();

    if (developerIds.length === 0) {
      return result;
    }

    for (const id of developerIds) {
      result.set(id, { compoundCount: 0, publishedPropertyCount: 0 });
    }

    const compoundWhere: Prisma.CompoundWhereInput = {
      developerId: { in: developerIds },
      ...(activeCompoundsOnly ? { isActive: true } : {}),
    };

    const compounds = await this.prisma.compound.findMany({
      where: compoundWhere,
      select: { id: true, developerId: true },
    });

    const compoundIds = compounds.map((compound) => compound.id);
    const propertyCountByCompound = await this.loadPublishedPropertyCountsByCompound(
      compoundIds,
    );

    for (const compound of compounds) {
      if (!compound.developerId) {
        continue;
      }

      const stats = result.get(compound.developerId);
      if (!stats) {
        continue;
      }

      stats.compoundCount += 1;
      stats.publishedPropertyCount += propertyCountByCompound.get(compound.id) ?? 0;
    }

    return result;
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
