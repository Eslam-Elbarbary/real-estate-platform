import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminCountryDto {
  @ApiPropertyOptional({ example: 'EG' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  code?: string;

  @ApiPropertyOptional({ example: 'Egypt' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  nameEn?: string;

  @ApiPropertyOptional({ example: 'مصر', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
