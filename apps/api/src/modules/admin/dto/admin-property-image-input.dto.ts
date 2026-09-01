import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

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
}
