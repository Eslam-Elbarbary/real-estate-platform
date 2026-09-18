import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListAdminCatalogsQueryDto {
  @ApiPropertyOptional({ description: 'Search by code or name' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}

export class ListAdminFeaturesQueryDto extends ListAdminCatalogsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by feature category' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
