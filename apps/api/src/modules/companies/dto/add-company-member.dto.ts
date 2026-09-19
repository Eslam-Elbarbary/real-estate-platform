import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyMemberRole } from '@/prisma/generated/prisma-client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class AddCompanyMemberDto {
  @ApiProperty({
    example: 'agent@example.com',
    description: 'Email of an already-registered user to add as a member',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    enum: CompanyMemberRole,
    default: CompanyMemberRole.AGENT,
    description: 'Only an existing OWNER can grant the OWNER role',
  })
  @IsOptional()
  @IsEnum(CompanyMemberRole)
  role?: CompanyMemberRole;
}
