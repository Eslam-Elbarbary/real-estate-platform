import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBasicDto {
  @ApiPropertyOptional({ example: 'Bright apartment in Nasr City' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionTypeId?: string;
}
