import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum AdminPropertySort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export class ListAdminPropertiesQueryDto {
  @ApiPropertyOptional({
    enum: PropertyStatus,
    description: 'When omitted, all property statuses are returned',
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description:
      'Case-insensitive search on title, slug, referenceNumber, owner name, or owner email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AdminPropertySort,
    default: AdminPropertySort.NEWEST,
    description: 'List sort order (default: newest)',
  })
  @IsOptional()
  @IsEnum(AdminPropertySort)
  sort?: AdminPropertySort = AdminPropertySort.NEWEST;
}
