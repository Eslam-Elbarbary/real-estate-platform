import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyStatus } from '@/prisma/generated/prisma-client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListMyPropertiesQueryDto {
  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
