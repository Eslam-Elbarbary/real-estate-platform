import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '@/prisma/generated/prisma-client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AdminPropertyImageInputDto {
  @ApiProperty()
  @IsString()
  mediaAssetId!: string;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPrimary!: boolean;

  @ApiPropertyOptional({
    enum: MediaType,
    default: MediaType.IMAGE,
    description: 'Defaults to IMAGE when omitted',
  })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;
}
