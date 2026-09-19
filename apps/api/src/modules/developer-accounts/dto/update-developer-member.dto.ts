import { ApiProperty } from '@nestjs/swagger';
import { DeveloperMemberRole } from '@/prisma/generated/prisma-client';
import { IsEnum } from 'class-validator';

export class UpdateDeveloperMemberDto {
  @ApiProperty({ enum: DeveloperMemberRole })
  @IsEnum(DeveloperMemberRole)
  role!: DeveloperMemberRole;
}
