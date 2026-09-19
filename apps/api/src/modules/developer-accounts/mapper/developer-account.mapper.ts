import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Developer,
  DeveloperMember,
  DeveloperMemberRole,
  User,
} from '@/prisma/generated/prisma-client';

export class DeveloperAccountDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'prime-urban' })
  slug!: string;

  @ApiProperty({ example: 'Prime Urban Developments' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeveloperAccountMembershipDto extends DeveloperAccountDto {
  @ApiProperty({ enum: DeveloperMemberRole })
  myRole!: DeveloperMemberRole;
}

export class DeveloperMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  developerId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: DeveloperMemberRole })
  role!: DeveloperMemberRole;

  @ApiProperty()
  userEmail!: string;

  @ApiPropertyOptional({ nullable: true })
  userFirstName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  userLastName!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export function toDeveloperAccountDto(row: Developer): DeveloperAccountDto {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    description: row.description,
    logoUrl: row.logoUrl,
    website: row.website,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toDeveloperAccountMembershipDto(
  row: Developer,
  myRole: DeveloperMemberRole,
): DeveloperAccountMembershipDto {
  return { ...toDeveloperAccountDto(row), myRole };
}

export function toDeveloperMemberDto(
  row: DeveloperMember & { user: Pick<User, 'email' | 'firstName' | 'lastName'> },
): DeveloperMemberDto {
  return {
    id: row.id,
    developerId: row.developerId,
    userId: row.userId,
    role: row.role,
    userEmail: row.user.email,
    userFirstName: row.user.firstName,
    userLastName: row.user.lastName,
    createdAt: row.createdAt,
  };
}
