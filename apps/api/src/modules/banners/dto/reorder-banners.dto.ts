import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class BannerReorderItemDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  id!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderBannersDto {
  @ApiProperty({ type: [BannerReorderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BannerReorderItemDto)
  items!: BannerReorderItemDto[];
}
