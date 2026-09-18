import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlatformSetting } from '@/prisma/generated/prisma-client';

/** Full settings payload for admin. */
export class AdminPlatformSettingDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'عقارات مصر' })
  siteName!: string;

  @ApiProperty({ example: 'عقارات' })
  shortName!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  faviconUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsapp!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  facebookUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  instagramUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  twitterUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  linkedinUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaTitle!: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaDescription!: string | null;

  @ApiPropertyOptional({ nullable: true })
  ogImageUrl!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

/** Public-safe settings (no internal-only fields today; subset kept explicit). */
export class PublicPlatformSettingDto {
  @ApiProperty({ example: 'عقارات مصر' })
  siteName!: string;

  @ApiProperty({ example: 'عقارات' })
  shortName!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  faviconUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsapp!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  facebookUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  instagramUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  twitterUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  linkedinUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaTitle!: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaDescription!: string | null;

  @ApiPropertyOptional({ nullable: true })
  ogImageUrl!: string | null;
}

export function toAdminPlatformSettingDto(
  row: PlatformSetting,
): AdminPlatformSettingDto {
  return {
    id: row.id,
    siteName: row.siteName,
    shortName: row.shortName,
    description: row.description,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address,
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    twitterUrl: row.twitterUrl,
    linkedinUrl: row.linkedinUrl,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicPlatformSettingDto(
  row: PlatformSetting,
): PublicPlatformSettingDto {
  return {
    siteName: row.siteName,
    shortName: row.shortName,
    description: row.description,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address,
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    twitterUrl: row.twitterUrl,
    linkedinUrl: row.linkedinUrl,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
  };
}
