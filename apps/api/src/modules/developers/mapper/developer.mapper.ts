import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Developer, Prisma } from '@prisma/client';

export class PublicDeveloperCardDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiProperty({ example: 3 })
  compoundCount!: number;

  @ApiProperty({ example: 12 })
  publishedPropertyCount!: number;
}

export class PublicDeveloperCompoundSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  coverUrl!: string | null;

  @ApiProperty({ example: 5 })
  publishedPropertyCount!: number;
}

export class PublicDeveloperDetailsDto extends PublicDeveloperCardDto {
  @ApiProperty({ type: [PublicDeveloperCompoundSummaryDto] })
  compounds!: PublicDeveloperCompoundSummaryDto[];
}

export class AdminDeveloperDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoPublicId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty({ example: 2 })
  compoundCount!: number;
}

export class AdminDeveloperDetailsDto extends AdminDeveloperDto {
  @ApiProperty({ type: [PublicDeveloperCompoundSummaryDto] })
  compounds!: PublicDeveloperCompoundSummaryDto[];
}

type DeveloperWithCompoundCount = Developer & {
  _count: { compounds: number };
};

export function toPublicDeveloperCard(
  developer: Developer,
  compoundCount: number,
  publishedPropertyCount: number,
): PublicDeveloperCardDto {
  return {
    id: developer.id,
    slug: developer.slug,
    nameEn: developer.nameEn,
    nameAr: developer.nameAr,
    description: developer.description,
    logoUrl: developer.logoUrl,
    website: developer.website,
    compoundCount,
    publishedPropertyCount,
  };
}

export function toPublicDeveloperCompoundSummary(input: {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  coverUrl: string | null;
  publishedPropertyCount: number;
}): PublicDeveloperCompoundSummaryDto {
  return {
    id: input.id,
    slug: input.slug,
    nameEn: input.nameEn,
    nameAr: input.nameAr,
    coverUrl: input.coverUrl,
    publishedPropertyCount: input.publishedPropertyCount,
  };
}

export function toPublicDeveloperDetails(
  developer: Developer,
  compoundCount: number,
  publishedPropertyCount: number,
  compounds: PublicDeveloperCompoundSummaryDto[],
): PublicDeveloperDetailsDto {
  return {
    ...toPublicDeveloperCard(developer, compoundCount, publishedPropertyCount),
    compounds,
  };
}

export function toAdminDeveloper(
  developer: DeveloperWithCompoundCount,
): AdminDeveloperDto {
  return {
    id: developer.id,
    slug: developer.slug,
    nameEn: developer.nameEn,
    nameAr: developer.nameAr,
    description: developer.description,
    logoUrl: developer.logoUrl,
    logoPublicId: developer.logoPublicId,
    website: developer.website,
    isActive: developer.isActive,
    createdAt: developer.createdAt.toISOString(),
    updatedAt: developer.updatedAt.toISOString(),
    compoundCount: developer._count.compounds,
  };
}

export function toAdminDeveloperDetails(
  developer: DeveloperWithCompoundCount,
  compounds: PublicDeveloperCompoundSummaryDto[],
): AdminDeveloperDetailsDto {
  return {
    ...toAdminDeveloper(developer),
    compounds,
  };
}

export function buildDeveloperSearchWhere(
  search: string | undefined,
  activeOnly: boolean,
): Prisma.DeveloperWhereInput {
  const where: Prisma.DeveloperWhereInput = {};

  if (activeOnly) {
    where.isActive = true;
  }

  if (search?.trim()) {
    const term = search.trim();
    where.OR = [
      { nameEn: { contains: term, mode: 'insensitive' } },
      { nameAr: { contains: term, mode: 'insensitive' } },
      { slug: { contains: term, mode: 'insensitive' } },
    ];
  }

  return where;
}
