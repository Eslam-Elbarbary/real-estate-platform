import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerPosition, Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { ListAdminBannersQueryDto } from './dto/list-banners-query.dto';
import { ReorderBannersDto } from './dto/reorder-banners.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import {
  AdminBannerDto,
  PublicBannerDto,
  toAdminBannerDto,
  toPublicBannerDto,
} from './mapper/banner.mapper';

function normalizeOptionalText(
  value: string | null | undefined,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async listAdmin(query: ListAdminBannersQueryDto): Promise<AdminBannerDto[]> {
    const rows = await this.prisma.banner.findMany({
      where: query.position ? { position: query.position } : undefined,
      orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map(toAdminBannerDto);
  }

  async listPublic(position?: BannerPosition): Promise<PublicBannerDto[]> {
    const rows = await this.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position ? { position } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map(toPublicBannerDto);
  }

  async create(dto: CreateBannerDto): Promise<AdminBannerDto> {
    const row = await this.prisma.banner.create({
      data: {
        title: dto.title.trim(),
        description: normalizeOptionalText(dto.description) ?? null,
        imageUrl: dto.imageUrl.trim(),
        mobileImageUrl: normalizeOptionalText(dto.mobileImageUrl) ?? null,
        buttonText: normalizeOptionalText(dto.buttonText) ?? null,
        buttonUrl: normalizeOptionalText(dto.buttonUrl) ?? null,
        position: dto.position,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
    return toAdminBannerDto(row);
  }

  async update(id: string, dto: UpdateBannerDto): Promise<AdminBannerDto> {
    await this.assertExists(id);

    const data: Prisma.BannerUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) {
      data.description = normalizeOptionalText(dto.description);
    }
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl.trim();
    if (dto.mobileImageUrl !== undefined) {
      data.mobileImageUrl = normalizeOptionalText(dto.mobileImageUrl);
    }
    if (dto.buttonText !== undefined) {
      data.buttonText = normalizeOptionalText(dto.buttonText);
    }
    if (dto.buttonUrl !== undefined) {
      data.buttonUrl = normalizeOptionalText(dto.buttonUrl);
    }
    if (dto.position !== undefined) data.position = dto.position;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const row = await this.prisma.banner.update({ where: { id }, data });
    return toAdminBannerDto(row);
  }

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.prisma.banner.delete({ where: { id } });
  }

  async reorder(dto: ReorderBannersDto): Promise<AdminBannerDto[]> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.banner.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return this.listAdmin({});
  }

  private async assertExists(id: string): Promise<void> {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Banner not found');
    }
  }
}
