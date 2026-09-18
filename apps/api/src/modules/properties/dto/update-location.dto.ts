import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLocationDto {
  @ApiPropertyOptional({
    description: 'Optional; validated against area hierarchy, not stored',
  })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Optional; validated against area hierarchy, not stored',
  })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  districtId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  compoundId?: string | null;

  @ApiPropertyOptional({ example: '12 Abbas El Akkad St' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @ApiPropertyOptional({ example: 30.0444 })
  @IsOptional()
  @IsNumber()
  latitude?: number | null;

  @ApiPropertyOptional({ example: 31.2357 })
  @IsOptional()
  @IsNumber()
  longitude?: number | null;
}
