import { ApiPropertyOptional } from '@nestjs/swagger';
import { BannerPosition } from '@/prisma/generated/prisma-client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListPublicBannersQueryDto {
  @ApiPropertyOptional({ enum: BannerPosition })
  @IsOptional()
  @IsEnum(BannerPosition)
  position?: BannerPosition;
}

export class ListAdminBannersQueryDto {
  @ApiPropertyOptional({ enum: BannerPosition })
  @IsOptional()
  @IsEnum(BannerPosition)
  position?: BannerPosition;
}
