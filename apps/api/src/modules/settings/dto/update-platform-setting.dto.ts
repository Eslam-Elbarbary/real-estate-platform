import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

/** Skip validators when value is null/undefined/blank (cleared optional fields). */
function whenNonEmpty() {
  return ValidateIf(
    (_, value) =>
      value !== null &&
      value !== undefined &&
      !(typeof value === 'string' && value.trim() === ''),
  );
}

export class UpdatePlatformSettingDto {
  @ApiPropertyOptional({ example: 'عقارات مصر' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  siteName?: string;

  @ApiPropertyOptional({ example: 'عقارات' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  shortName?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  logoUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  faviconUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(50)
  phone?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(50)
  whatsapp?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  facebookUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  instagramUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  twitterUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  linkedinUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(200)
  metaTitle?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(500)
  metaDescription?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @whenNonEmpty()
  @IsString()
  @MaxLength(2000)
  ogImageUrl?: string | null;
}
