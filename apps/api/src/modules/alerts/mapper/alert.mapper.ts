import { ApiProperty } from '@nestjs/swagger';
import { Prisma, SavedSearchAlert } from '@/prisma/generated/prisma-client';

export class AlertResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    description: 'Opaque saved search filters JSON',
    example: { cityId: 'clxcity', priceMax: 3000000 },
  })
  filters!: Prisma.JsonValue;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export function toAlertResponse(alert: SavedSearchAlert): AlertResponseDto {
  return {
    id: alert.id,
    name: alert.name,
    filters: alert.filters,
    isActive: alert.isActive,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
  };
}
