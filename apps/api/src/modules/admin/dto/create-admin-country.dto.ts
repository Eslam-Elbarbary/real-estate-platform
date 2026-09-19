import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAdminCountryDto {
  @ApiProperty({ example: 'EG' })
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  code!: string;

  @ApiProperty({ example: 'Egypt' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  nameEn!: string;

  @ApiPropertyOptional({ example: 'مصر' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameAr?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
