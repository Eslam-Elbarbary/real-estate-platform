import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReorderMediaItemDto {
  @ApiProperty({ example: 'clximgid' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderMediaDto {
  @ApiProperty({ type: [ReorderMediaItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderMediaItemDto)
  images!: ReorderMediaItemDto[];
}
