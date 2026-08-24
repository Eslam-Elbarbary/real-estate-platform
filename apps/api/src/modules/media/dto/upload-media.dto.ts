import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadMediaDto {
  @ApiPropertyOptional({
    example: 'aqarmap/library',
    description: 'Optional Cloudinary folder override',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  folder?: string;
}
