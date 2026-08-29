import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Property, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { SetFeaturesDto } from './dto/set-features.dto';
import { UpdateBasicDto } from './dto/update-basic.dto';
import { UpdateDetailsDto } from './dto/update-details.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  FeatureResponseDto,
  toFeatureResponse,
} from './mapper/feature.mapper';
import {
  PropertyResponseDto,
  toPropertyResponse,
} from './mapper/property.mapper';
import { createTemporaryDraftSlug, slugifyTitle } from './utils/slug.util';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(
    ownerId: string,
    dto: CreateDraftDto,
  ): Promise<PropertyResponseDto> {
    const title = dto.title?.trim() || null;
    const baseSlug = title
      ? slugifyTitle(title)
      : createTemporaryDraftSlug();
    const slug = await this.ensureUniqueSlug(baseSlug);

    const property = await this.prisma.property.create({
      data: {
        ownerId,
        title,
        slug,
        status: PropertyStatus.DRAFT,
      },
    });

    return toPropertyResponse(property);
  }

  async listMine(
    ownerId: string,
    status?: PropertyStatus,
  ): Promise<PropertyResponseDto[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        ownerId,
        ...(status ? { status } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return properties.map((property) => toPropertyResponse(property));
  }

  async getMine(
    ownerId: string,
    propertyId: string,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    return toPropertyResponse(property);
  }

  async updateDraft(
    ownerId: string,
    propertyId: string,
    dto: UpdatePropertyDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertOwnerEditable(property);

    await this.validateUpdateReferences(property, dto);

    const data: Prisma.PropertyUpdateInput = {};

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      data.title = title;
      data.slug = await this.ensureUniqueSlug(slugifyTitle(title), property.id);
    }

    if (dto.description !== undefined) {
      data.description = dto.description?.trim() || null;
    }

    if (dto.propertyTypeId !== undefined) {
      data.propertyType = { connect: { id: dto.propertyTypeId } };
    }
    if (dto.transactionTypeId !== undefined) {
      data.transactionType = { connect: { id: dto.transactionTypeId } };
    }
    if (dto.areaId !== undefined) {
      data.area = { connect: { id: dto.areaId } };
    }
    if (dto.districtId !== undefined) {
      data.district =
        dto.districtId === null
          ? { disconnect: true }
          : { connect: { id: dto.districtId } };
    }
    if (dto.compoundId !== undefined) {
      data.compound =
        dto.compoundId === null
          ? { disconnect: true }
          : { connect: { id: dto.compoundId } };
    }
    if (dto.address !== undefined) {
      data.address = dto.address?.trim() || null;
    }
    if (dto.latitude !== undefined) {
      data.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      data.longitude = dto.longitude;
    }
    if (dto.bedrooms !== undefined) {
      data.bedrooms = dto.bedrooms;
    }
    if (dto.bathrooms !== undefined) {
      data.bathrooms = dto.bathrooms;
    }
    if (dto.areaSqm !== undefined) {
      data.areaSqm = dto.areaSqm;
    }
    if (dto.floor !== undefined) {
      data.floor = dto.floor;
    }
    if (dto.furnished !== undefined) {
      data.furnished = dto.furnished;
    }
    if (dto.rentPeriod !== undefined) {
      data.rentPeriod = dto.rentPeriod;
    }
    if (dto.price !== undefined) {
      data.price = dto.price;
    }

    const updated = await this.prisma.property.update({
      where: { id: property.id },
      data,
    });

    return toPropertyResponse(updated);
  }

  async deleteDraft(
    ownerId: string,
    propertyId: string,
  ): Promise<{ message: string }> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);

    if (property.status !== PropertyStatus.DRAFT) {
      throw new ForbiddenException('Only draft properties can be deleted');
    }

    await this.prisma.property.delete({ where: { id: property.id } });

    return { message: 'Draft property deleted successfully' };
  }

  async updateBasic(
    ownerId: string,
    propertyId: string,
    dto: UpdateBasicDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertOwnerEditable(property);

    if (dto.propertyTypeId) {
      await this.assertActivePropertyType(dto.propertyTypeId);
    }
    if (dto.transactionTypeId) {
      await this.assertActiveTransactionType(dto.transactionTypeId);
    }

    const data: Prisma.PropertyUpdateInput = {};

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      data.title = title;
      data.slug = await this.ensureUniqueSlug(slugifyTitle(title), property.id);
    }
    if (dto.propertyTypeId !== undefined) {
      data.propertyType = { connect: { id: dto.propertyTypeId } };
    }
    if (dto.transactionTypeId !== undefined) {
      data.transactionType = { connect: { id: dto.transactionTypeId } };
    }

    const updated = await this.prisma.property.update({
      where: { id: property.id },
      data,
    });

    return toPropertyResponse(updated);
  }

  async updateLocation(
    ownerId: string,
    propertyId: string,
    dto: UpdateLocationDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertOwnerEditable(property);

    await this.validateUpdateReferences(property, {
      areaId: dto.areaId,
      districtId: dto.districtId,
      compoundId: dto.compoundId,
    });

    const data: Prisma.PropertyUpdateInput = {};

    if (dto.areaId !== undefined) {
      data.area = { connect: { id: dto.areaId } };
    }
    if (dto.districtId !== undefined) {
      data.district =
        dto.districtId === null
          ? { disconnect: true }
          : { connect: { id: dto.districtId } };
    }
    if (dto.compoundId !== undefined) {
      data.compound =
        dto.compoundId === null
          ? { disconnect: true }
          : { connect: { id: dto.compoundId } };
    }
    if (dto.address !== undefined) {
      data.address = dto.address?.trim() || null;
    }
    if (dto.latitude !== undefined) {
      data.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      data.longitude = dto.longitude;
    }

    const updated = await this.prisma.property.update({
      where: { id: property.id },
      data,
    });

    return toPropertyResponse(updated);
  }

  async updateDetails(
    ownerId: string,
    propertyId: string,
    dto: UpdateDetailsDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertOwnerEditable(property);

    const data: Prisma.PropertyUpdateInput = {};

    if (dto.bedrooms !== undefined) {
      data.bedrooms = dto.bedrooms;
    }
    if (dto.bathrooms !== undefined) {
      data.bathrooms = dto.bathrooms;
    }
    if (dto.areaSqm !== undefined) {
      data.areaSqm = dto.areaSqm;
    }
    if (dto.floor !== undefined) {
      data.floor = dto.floor;
    }
    if (dto.yearBuilt !== undefined) {
      data.yearBuilt = dto.yearBuilt;
    }
    if (dto.furnished !== undefined) {
      data.furnished = dto.furnished;
    }
    if (dto.rentPeriod !== undefined) {
      data.rentPeriod = dto.rentPeriod;
    }

    const updated = await this.prisma.property.update({
      where: { id: property.id },
      data,
    });

    return toPropertyResponse(updated);
  }

  async listFeatures(): Promise<FeatureResponseDto[]> {
    const features = await this.prisma.feature.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return features.map(toFeatureResponse);
  }

  async replaceFeatures(
    ownerId: string,
    propertyId: string,
    dto: SetFeaturesDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    this.assertOwnerEditable(property);

    const uniqueIds = [...new Set(dto.featureIds)];

    if (uniqueIds.length > 0) {
      const features = await this.prisma.feature.findMany({
        where: { id: { in: uniqueIds }, isActive: true },
        select: { id: true },
      });

      if (features.length !== uniqueIds.length) {
        throw new BadRequestException('One or more feature ids are invalid');
      }
    }

    await this.prisma.$transaction([
      this.prisma.propertyFeature.deleteMany({
        where: { propertyId: property.id },
      }),
      ...(uniqueIds.length > 0
        ? [
            this.prisma.propertyFeature.createMany({
              data: uniqueIds.map((featureId) => ({
                propertyId: property.id,
                featureId,
              })),
            }),
          ]
        : []),
    ]);

    const [updated, linked] = await Promise.all([
      this.prisma.property.findUniqueOrThrow({ where: { id: property.id } }),
      this.prisma.propertyFeature.findMany({
        where: { propertyId: property.id },
        include: { feature: true },
        orderBy: { feature: { nameEn: 'asc' } },
      }),
    ]);

    return toPropertyResponse(
      updated,
      linked.map((row) => row.feature),
    );
  }

  private async findOwnedOrThrow(
    ownerId: string,
    propertyId: string,
  ): Promise<Property> {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  private assertOwnerEditable(property: Property): void {
    if (
      property.status !== PropertyStatus.DRAFT &&
      property.status !== PropertyStatus.REJECTED
    ) {
      throw new ForbiddenException(
        'Only draft or rejected properties can be updated',
      );
    }
  }

  private async ensureUniqueSlug(
    base: string,
    excludeId?: string,
  ): Promise<string> {
    let candidate = base;
    let suffix = 0;

    while (true) {
      const existing = await this.prisma.property.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
  }

  private async assertActivePropertyType(propertyTypeId: string): Promise<void> {
    const type = await this.prisma.propertyType.findFirst({
      where: { id: propertyTypeId, isActive: true },
      select: { id: true },
    });
    if (!type) {
      throw new BadRequestException('Invalid property type');
    }
  }

  private async assertActiveTransactionType(
    transactionTypeId: string,
  ): Promise<void> {
    const type = await this.prisma.transactionType.findFirst({
      where: { id: transactionTypeId, isActive: true },
      select: { id: true },
    });
    if (!type) {
      throw new BadRequestException('Invalid transaction type');
    }
  }

  private async validateUpdateReferences(
    property: Property,
    dto: Pick<
      UpdatePropertyDto,
      | 'propertyTypeId'
      | 'transactionTypeId'
      | 'areaId'
      | 'districtId'
      | 'compoundId'
    >,
  ): Promise<void> {
    if (dto.propertyTypeId) {
      await this.assertActivePropertyType(dto.propertyTypeId);
    }

    if (dto.transactionTypeId) {
      await this.assertActiveTransactionType(dto.transactionTypeId);
    }

    if (dto.areaId) {
      const area = await this.prisma.area.findFirst({
        where: { id: dto.areaId, isActive: true },
        select: { id: true },
      });
      if (!area) {
        throw new BadRequestException('Invalid area');
      }
    }

    if (dto.districtId) {
      const district = await this.prisma.district.findFirst({
        where: { id: dto.districtId, isActive: true },
        select: { id: true, areaId: true },
      });
      if (!district) {
        throw new BadRequestException('Invalid district');
      }

      const areaId = dto.areaId ?? property.areaId;
      if (areaId && district.areaId !== areaId) {
        throw new BadRequestException(
          'District does not belong to the selected area',
        );
      }
    }

    if (dto.compoundId) {
      const compound = await this.prisma.compound.findFirst({
        where: { id: dto.compoundId, isActive: true },
        select: { id: true },
      });
      if (!compound) {
        throw new BadRequestException('Invalid compound');
      }
    }
  }
}
