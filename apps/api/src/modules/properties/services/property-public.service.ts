import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType, Prisma, PropertyStatus } from '@prisma/client';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { PrismaService } from '../../../database/prisma.service';
import {
  PropertySearchSort,
  SearchPropertiesDto,
} from '../dto/search-properties.dto';
import {
  PropertyCardSource,
  toPublicPropertyCard,
  toPublicPropertyDetails,
} from '../mapper/property-public.mapper';

const cardInclude = {
  propertyType: true,
  transactionType: true,
  area: {
    include: {
      city: {
        include: { country: true },
      },
    },
  },
  district: true,
  images: {
    include: { mediaAsset: true },
    orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }],
  },
} satisfies Prisma.PropertyInclude;

@Injectable()
export class PropertyPublicService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchPropertiesDto, path?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildSearchWhere(query);
    const orderBy = this.buildOrderBy(query.sort);

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: cardInclude,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const data = (rows as PropertyCardSource[]).map(toPublicPropertyCard);
    const meta = {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };

    return buildSuccessResponse(data, 'OK', path, meta);
  }

  async getBySlug(slug: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        slug,
        status: PropertyStatus.PUBLISHED,
      },
      include: {
        ...cardInclude,
        compound: true,
        owner: true,
        features: {
          include: { feature: true },
          orderBy: { feature: { nameEn: 'asc' } },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const similar = await this.findSimilar(property);
    return toPublicPropertyDetails(property, similar);
  }

  private async findSimilar(
    property: {
      id: string;
      areaId: string | null;
      transactionTypeId: string | null;
      propertyTypeId: string | null;
    },
  ): Promise<PropertyCardSource[]> {
    if (!property.areaId || !property.transactionTypeId || !property.propertyTypeId) {
      return [];
    }

    const rows = await this.prisma.property.findMany({
      where: {
        status: PropertyStatus.PUBLISHED,
        id: { not: property.id },
        areaId: property.areaId,
        transactionTypeId: property.transactionTypeId,
        propertyTypeId: property.propertyTypeId,
      },
      include: cardInclude,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
    });

    return rows as PropertyCardSource[];
  }

  private buildSearchWhere(query: SearchPropertiesDto): Prisma.PropertyWhereInput {
    const priceFilter: Prisma.DecimalFilter | undefined =
      query.priceMin != null || query.priceMax != null
        ? {
            ...(query.priceMin != null ? { gte: query.priceMin } : {}),
            ...(query.priceMax != null ? { lte: query.priceMax } : {}),
          }
        : undefined;

    const areaSqmFilter: Prisma.DecimalFilter | undefined =
      query.areaMin != null || query.areaMax != null
        ? {
            ...(query.areaMin != null ? { gte: query.areaMin } : {}),
            ...(query.areaMax != null ? { lte: query.areaMax } : {}),
          }
        : undefined;

    const areaRelation: Prisma.AreaWhereInput | undefined =
      query.cityId || query.countryId
        ? {
            ...(query.cityId ? { cityId: query.cityId } : {}),
            ...(query.countryId
              ? { city: { countryId: query.countryId } }
              : {}),
          }
        : undefined;

    const andConditions: Prisma.PropertyWhereInput[] = [];

    if (query.featureIds && query.featureIds.length > 0) {
      for (const featureId of query.featureIds) {
        andConditions.push({ features: { some: { featureId } } });
      }
    }

    const keyword = query.keyword?.trim();
    if (keyword) {
      andConditions.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { referenceNumber: { contains: keyword, mode: 'insensitive' } },
        ],
      });
    }

    if (query.developerId) {
      andConditions.push({
        compound: {
          is: {
            developerId: query.developerId,
            isActive: true,
            developer: { isActive: true },
          },
        },
      });
    }

    return {
      status: PropertyStatus.PUBLISHED,
      ...(query.transactionTypeId
        ? { transactionTypeId: query.transactionTypeId }
        : {}),
      ...(query.propertyTypeId ? { propertyTypeId: query.propertyTypeId } : {}),
      ...(query.areaId ? { areaId: query.areaId } : {}),
      ...(query.districtId ? { districtId: query.districtId } : {}),
      ...(query.compoundId ? { compoundId: query.compoundId } : {}),
      ...(query.paymentType ? { paymentType: query.paymentType } : {}),
      ...(query.finishingType ? { finishingType: query.finishingType } : {}),
      ...(query.hasVideo === true
        ? { images: { some: { type: MediaType.VIDEO } } }
        : {}),
      ...(areaRelation ? { area: areaRelation } : {}),
      ...(priceFilter ? { price: priceFilter } : {}),
      ...(areaSqmFilter ? { areaSqm: areaSqmFilter } : {}),
      ...(query.bedrooms != null ? { bedrooms: query.bedrooms } : {}),
      ...(query.bathrooms != null ? { bathrooms: query.bathrooms } : {}),
      ...(andConditions.length > 0 ? { AND: andConditions } : {}),
    };
  }

  private buildOrderBy(
    sort: PropertySearchSort | undefined,
  ): Prisma.PropertyOrderByWithRelationInput[] {
    switch (sort) {
      case PropertySearchSort.PRICE_ASC:
        return [{ price: 'asc' }, { publishedAt: 'desc' }];
      case PropertySearchSort.PRICE_DESC:
        return [{ price: 'desc' }, { publishedAt: 'desc' }];
      case PropertySearchSort.NEWEST:
      default:
        return [{ publishedAt: 'desc' }, { createdAt: 'desc' }];
    }
  }
}
