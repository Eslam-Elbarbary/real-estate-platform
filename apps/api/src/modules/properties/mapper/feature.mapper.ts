import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Feature } from '@prisma/client';

export class FeatureResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  category!: string | null;
}

export function toFeatureResponse(feature: Feature): FeatureResponseDto {
  return {
    id: feature.id,
    code: feature.code,
    nameEn: feature.nameEn,
    nameAr: feature.nameAr,
    category: feature.category,
  };
}
