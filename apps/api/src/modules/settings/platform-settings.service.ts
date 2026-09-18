import { Injectable } from '@nestjs/common';
import { Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { UpdatePlatformSettingDto } from './dto/update-platform-setting.dto';
import {
  AdminPlatformSettingDto,
  PublicPlatformSettingDto,
  toAdminPlatformSettingDto,
  toPublicPlatformSettingDto,
} from './mapper/platform-setting.mapper';
import { PLATFORM_SETTINGS_DEFAULTS } from './platform-settings.defaults';

function normalizeOptionalText(
  value: string | null | undefined,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

@Injectable()
export class PlatformSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateRow() {
    const existing = await this.prisma.platformSetting.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.platformSetting.create({
      data: { ...PLATFORM_SETTINGS_DEFAULTS },
    });
  }

  async getAdmin(): Promise<AdminPlatformSettingDto> {
    const row = await this.getOrCreateRow();
    return toAdminPlatformSettingDto(row);
  }

  async getPublic(): Promise<PublicPlatformSettingDto> {
    const row = await this.getOrCreateRow();
    return toPublicPlatformSettingDto(row);
  }

  async update(
    dto: UpdatePlatformSettingDto,
  ): Promise<AdminPlatformSettingDto> {
    const row = await this.getOrCreateRow();

    const data: Prisma.PlatformSettingUpdateInput = {};

    if (dto.siteName !== undefined) {
      data.siteName = dto.siteName.trim();
    }
    if (dto.shortName !== undefined) {
      data.shortName = dto.shortName.trim();
    }
    if (dto.description !== undefined) {
      data.description = normalizeOptionalText(dto.description);
    }
    if (dto.logoUrl !== undefined) {
      data.logoUrl = normalizeOptionalText(dto.logoUrl);
    }
    if (dto.faviconUrl !== undefined) {
      data.faviconUrl = normalizeOptionalText(dto.faviconUrl);
    }
    if (dto.email !== undefined) {
      data.email = normalizeOptionalText(dto.email);
    }
    if (dto.phone !== undefined) {
      data.phone = normalizeOptionalText(dto.phone);
    }
    if (dto.whatsapp !== undefined) {
      data.whatsapp = normalizeOptionalText(dto.whatsapp);
    }
    if (dto.address !== undefined) {
      data.address = normalizeOptionalText(dto.address);
    }
    if (dto.facebookUrl !== undefined) {
      data.facebookUrl = normalizeOptionalText(dto.facebookUrl);
    }
    if (dto.instagramUrl !== undefined) {
      data.instagramUrl = normalizeOptionalText(dto.instagramUrl);
    }
    if (dto.twitterUrl !== undefined) {
      data.twitterUrl = normalizeOptionalText(dto.twitterUrl);
    }
    if (dto.linkedinUrl !== undefined) {
      data.linkedinUrl = normalizeOptionalText(dto.linkedinUrl);
    }
    if (dto.metaTitle !== undefined) {
      data.metaTitle = normalizeOptionalText(dto.metaTitle);
    }
    if (dto.metaDescription !== undefined) {
      data.metaDescription = normalizeOptionalText(dto.metaDescription);
    }
    if (dto.ogImageUrl !== undefined) {
      data.ogImageUrl = normalizeOptionalText(dto.ogImageUrl);
    }

    const updated = await this.prisma.platformSetting.update({
      where: { id: row.id },
      data,
    });

    return toAdminPlatformSettingDto(updated);
  }
}
