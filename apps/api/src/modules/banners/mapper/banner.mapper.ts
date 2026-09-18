import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Banner, BannerPosition } from '@/prisma/generated/prisma-client';

export class AdminBannerDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  imageUrl!: string;

  @ApiPropertyOptional({ nullable: true })
  mobileImageUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  buttonText!: string | null;

  @ApiPropertyOptional({ nullable: true })
  buttonUrl!: string | null;

  @ApiProperty({ enum: BannerPosition })
  position!: BannerPosition;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PublicBannerDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  imageUrl!: string;

  @ApiPropertyOptional({ nullable: true })
  mobileImageUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  buttonText!: string | null;

  @ApiPropertyOptional({ nullable: true })
  buttonUrl!: string | null;

  @ApiProperty()
  sortOrder!: number;
}

export function toAdminBannerDto(row: Banner): AdminBannerDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    mobileImageUrl: row.mobileImageUrl,
    buttonText: row.buttonText,
    buttonUrl: row.buttonUrl,
    position: row.position,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicBannerDto(row: Banner): PublicBannerDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    mobileImageUrl: row.mobileImageUrl,
    buttonText: row.buttonText,
    buttonUrl: row.buttonUrl,
    sortOrder: row.sortOrder,
  };
}
