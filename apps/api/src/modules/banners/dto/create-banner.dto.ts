import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BannerPosition } from '@/prisma/generated/prisma-client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

function whenNonEmpty() {
  return ValidateIf(
    (_, value) =>
      value !== null &&
      value !== undefined &&
      !(typeof value === 'string' && value.trim() === ''),
  );
}

export class CreateBannerDto {
  @ApiProperty({ example: 'ابحث عن منزل أحلامك' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  imageUrl!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  mobileImageUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(100)
  buttonText?: string | null;

  @ApiPropertyOptional({ nullable: true, example: '/properties/sale' })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  @Matches(/^(https?:\/\/|\/).+/i, {
    message: 'buttonUrl must be an absolute http(s) URL or a site path starting with /',
  })
  buttonUrl?: string | null;

  @ApiProperty({ enum: BannerPosition })
  @IsEnum(BannerPosition)
  position!: BannerPosition;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
