import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyContactSource,
  PropertyContactType,
} from '@/prisma/generated/prisma-client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpsertPropertyContactDto {
  @ApiProperty({ enum: PropertyContactSource })
  @IsEnum(PropertyContactSource)
  source!: PropertyContactSource;

  @ApiPropertyOptional({ enum: PropertyContactType })
  @IsOptional()
  @IsEnum(PropertyContactType)
  contactType?: PropertyContactType;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((dto: UpsertPropertyContactDto) => dto.source === PropertyContactSource.CUSTOM)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Required when source is CUSTOM',
  })
  @ValidateIf((dto: UpsertPropertyContactDto) => dto.source === PropertyContactSource.CUSTOM)
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  phone?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  whatsapp?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value != null && String(value).trim() !== '')
  @IsEmail()
  @MaxLength(255)
  email?: string | null;
}

export class PropertyContactResponseDto {
  @ApiProperty()
  propertyId!: string;

  @ApiProperty({ enum: PropertyContactSource })
  source!: PropertyContactSource;

  @ApiProperty({ enum: PropertyContactType })
  contactType!: PropertyContactType;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsapp!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;
}

/** Public-safe contact (no email / source internals). */
export class PublicPropertyContactViewDto {
  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiProperty({ enum: PropertyContactType })
  type!: PropertyContactType;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsapp!: string | null;
}
