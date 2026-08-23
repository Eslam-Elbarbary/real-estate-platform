import { ApiPropertyOptional } from '@nestjs/swagger';
import { RentPeriod } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class UpdateDetailsDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number | null;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number | null;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  areaSqm?: number | null;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  floor?: number | null;

  @ApiPropertyOptional({ example: 2018 })
  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(2100)
  yearBuilt?: number | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean | null;

  @ApiPropertyOptional({ enum: RentPeriod })
  @IsOptional()
  @IsEnum(RentPeriod)
  rentPeriod?: RentPeriod | null;
}
