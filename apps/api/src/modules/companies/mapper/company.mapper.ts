import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Company,
  CompanyMember,
  CompanyMemberRole,
  User,
} from '@/prisma/generated/prisma-client';

export class CompanyDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'prime-realty-partners' })
  slug!: string;

  @ApiProperty({ example: 'Prime Realty Partners' })
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class CompanyMembershipDto extends CompanyDto {
  @ApiProperty({ enum: CompanyMemberRole })
  myRole!: CompanyMemberRole;
}

export class CompanyMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: CompanyMemberRole })
  role!: CompanyMemberRole;

  @ApiProperty()
  userEmail!: string;

  @ApiPropertyOptional({ nullable: true })
  userFirstName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  userLastName!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export function toCompanyDto(row: Company): CompanyDto {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.nameEn,
    nameAr: row.nameAr,
    description: row.description,
    logoUrl: row.logoUrl,
    phone: row.phone,
    email: row.email,
    website: row.website,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toCompanyMembershipDto(
  row: Company,
  myRole: CompanyMemberRole,
): CompanyMembershipDto {
  return { ...toCompanyDto(row), myRole };
}

export function toCompanyMemberDto(
  row: CompanyMember & { user: Pick<User, 'email' | 'firstName' | 'lastName'> },
): CompanyMemberDto {
  return {
    id: row.id,
    companyId: row.companyId,
    userId: row.userId,
    role: row.role,
    userEmail: row.user.email,
    userFirstName: row.user.firstName,
    userLastName: row.user.lastName,
    createdAt: row.createdAt,
  };
}
