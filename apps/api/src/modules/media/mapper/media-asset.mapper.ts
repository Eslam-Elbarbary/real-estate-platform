import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaAsset } from '@/prisma/generated/prisma-client';

export class MediaAssetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  publicId!: string;

  @ApiPropertyOptional({ nullable: true })
  fileName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  mimeType!: string | null;

  @ApiPropertyOptional({ nullable: true })
  size!: number | null;

  @ApiPropertyOptional({ nullable: true })
  width!: number | null;

  @ApiPropertyOptional({ nullable: true })
  height!: number | null;

  @ApiPropertyOptional({ nullable: true })
  folder!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export function toMediaAssetResponse(asset: MediaAsset): MediaAssetResponseDto {
  return {
    id: asset.id,
    url: asset.url,
    publicId: asset.publicId,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    folder: asset.folder,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}
