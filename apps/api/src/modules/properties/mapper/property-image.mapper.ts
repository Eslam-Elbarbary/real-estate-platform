import { ApiProperty } from '@nestjs/swagger';
import { MediaAsset, PropertyImage } from '@/prisma/generated/prisma-client';

export class PropertyImageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  publicId!: string;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiProperty()
  sortOrder!: number;
}

type PropertyImageWithAsset = PropertyImage & { mediaAsset: MediaAsset };

export function toPropertyImageResponse(
  image: PropertyImageWithAsset,
): PropertyImageResponseDto {
  return {
    id: image.id,
    url: image.mediaAsset.url,
    publicId: image.mediaAsset.publicId,
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  };
}
