import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaAsset, User } from '@prisma/client';

export class AdminMediaUploaderDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;
}

export class AdminMediaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiPropertyOptional({ nullable: true })
  fileName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  mimeType!: string | null;

  @ApiPropertyOptional({ nullable: true })
  folder!: string | null;

  @ApiPropertyOptional({ nullable: true })
  size!: number | null;

  @ApiPropertyOptional({ nullable: true })
  width!: number | null;

  @ApiPropertyOptional({ nullable: true })
  height!: number | null;

  @ApiPropertyOptional({ type: AdminMediaUploaderDto, nullable: true })
  uploadedBy!: AdminMediaUploaderDto | null;

  @ApiProperty()
  createdAt!: string;
}

export type MediaAssetWithUploader = MediaAsset & {
  uploadedBy: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
};

function toUploaderName(
  user: Pick<User, 'firstName' | 'lastName'> | null,
): string | null {
  if (!user) {
    return null;
  }

  return [user.firstName, user.lastName].filter(Boolean).join(' ') || null;
}

export function toAdminMediaDto(asset: MediaAssetWithUploader): AdminMediaDto {
  return {
    id: asset.id,
    url: asset.url,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
    folder: asset.folder,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    uploadedBy: asset.uploadedBy
      ? {
          id: asset.uploadedBy.id,
          name: toUploaderName(asset.uploadedBy),
        }
      : null,
    createdAt: asset.createdAt.toISOString(),
  };
}

export const ADMIN_MEDIA_INCLUDE = {
  uploadedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;
