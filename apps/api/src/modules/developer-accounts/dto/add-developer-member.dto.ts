import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeveloperMemberRole } from '@/prisma/generated/prisma-client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class AddDeveloperMemberDto {
  @ApiProperty({
    example: 'staff@example.com',
    description: 'Email of an already-registered user to add as a member',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    enum: DeveloperMemberRole,
    default: DeveloperMemberRole.STAFF,
    description: 'Only an existing OWNER can grant the OWNER role',
  })
  @IsOptional()
  @IsEnum(DeveloperMemberRole)
  role?: DeveloperMemberRole;
}
