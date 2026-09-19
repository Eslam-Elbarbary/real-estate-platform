import { ApiProperty } from '@nestjs/swagger';
import { CompanyMemberRole } from '@/prisma/generated/prisma-client';
import { IsEnum } from 'class-validator';

export class UpdateCompanyMemberDto {
  @ApiProperty({ enum: CompanyMemberRole })
  @IsEnum(CompanyMemberRole)
  role!: CompanyMemberRole;
}
