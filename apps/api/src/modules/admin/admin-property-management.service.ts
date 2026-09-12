import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MediaType, Prisma, PropertyStatus } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { slugifyTitle } from '../properties/utils/slug.util';
import { AdminPropertiesService } from './admin-properties.service';
import { CreateAdminPropertyDto } from './dto/create-admin-property.dto';
import { AdminPropertyImageInputDto } from './dto/admin-property-image-input.dto';
import { UpdateAdminPropertyDto } from './dto/update-admin-property.dto';
import { AdminPropertyReviewDetailsDto } from './mapper/admin-property.mapper';

@Injectable()
export class AdminPropertyManagementService {
  private readonly logger = new Logger(AdminPropertyManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly adminPropertiesService: AdminPropertiesService,
  ) {}

  async createProperty(
    adminId: string,
    dto: CreateAdminPropertyDto,
  ): Promise<AdminPropertyReviewDetailsDto> {
    await this.assertOwnerExists(dto.ownerId);
    await this.assertActivePropertyType(dto.propertyTypeId);
    await this.assertActiveTransactionType(dto.transactionTypeId);
    await this.validateLocation({
      countryId: dto.countryId,
      cityId: dto.cityId,
      areaId: dto.areaId,
      districtId: dto.districtId ?? null,
    });

    if (dto.compoundId) {
      await this.assertActiveCompound(dto.compoundId, dto.areaId);
    }

    if (dto.referenceNumber?.trim()) {
      await this.assertUniqueReferenceNumber(dto.referenceNumber.trim());
    }

    const featureIds = [...new Set(dto.featureIds ?? [])];
    await this.assertFeatureIds(featureIds);

    const images = dto.images ?? [];
    await this.assertMediaAssets(
      images.map((image) => image.mediaAssetId),
    );
    this.assertPrimaryImageRules(images);

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(
        `Creating admin property ownerId=${dto.ownerId} title="${dto.title.trim()}" areaId=${dto.areaId} images=${images.length}`,
      );
    }

    const title = dto.title.trim();
    const slug = await this.ensureUniqueSlug(slugifyTitle(title));

    const propertyId = await this.prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          ownerId: dto.ownerId,
          title,
          slug,
          description: dto.description?.trim() || null,
          status: PropertyStatus.DRAFT,
          propertyTypeId: dto.propertyTypeId,
          transactionTypeId: dto.transactionTypeId,
          price: dto.price,
          currency: dto.currency?.trim() || 'EGP',
          referenceNumber: dto.referenceNumber?.trim() || null,
          paymentType: dto.paymentType,
          downPayment: dto.downPayment,
          installmentYears: dto.installmentYears,
          monthlyInstallment: dto.monthlyInstallment,
          finishingType: dto.finishingType,
          furnished: dto.furnished,
          bedrooms: dto.bedrooms,
          bathrooms: dto.bathrooms,
          areaSqm: dto.areaSqm,
          floor: dto.floor,
          yearBuilt: dto.yearBuilt,
          areaId: dto.areaId,
          districtId: dto.districtId ?? null,
          compoundId: dto.compoundId ?? null,
          address: dto.address?.trim() || null,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      });

      if (featureIds.length > 0) {
        await tx.propertyFeature.createMany({
          data: featureIds.map((featureId) => ({
            propertyId: property.id,
            featureId,
          })),
        });
      }

      if (images.length > 0) {
        await tx.propertyImage.createMany({
          data: images.map((image) => ({
            propertyId: property.id,
            mediaAssetId: image.mediaAssetId,
            sortOrder: image.sortOrder,
            isPrimary: image.isPrimary,
            type: MediaType.IMAGE,
          })),
        });
      }

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: null,
          toStatus: PropertyStatus.DRAFT,
          changedById: adminId,
          reason: 'Created by administrator',
        },
      });

      return property.id;
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`Created admin property id=${propertyId} status=DRAFT`);
    }

    return this.adminPropertiesService.getPropertyDetails(propertyId);
  }

  async updateProperty(
    _adminId: string,
    propertyId: string,
    dto: UpdateAdminPropertyDto,
  ): Promise<AdminPropertyReviewDetailsDto> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (dto.propertyTypeId) {
      await this.assertActivePropertyType(dto.propertyTypeId);
    }

    if (dto.transactionTypeId) {
      await this.assertActiveTransactionType(dto.transactionTypeId);
    }

    const nextAreaId = dto.areaId ?? property.areaId ?? undefined;
    if (dto.areaId || dto.districtId !== undefined || dto.cityId || dto.countryId) {
      await this.validateLocation({
        countryId: dto.countryId,
        cityId: dto.cityId,
        areaId: nextAreaId,
        districtId:
          dto.districtId !== undefined ? dto.districtId : property.districtId,
      });
    }

    if (dto.compoundId) {
      await this.assertActiveCompound(dto.compoundId, nextAreaId);
    }

    if (dto.referenceNumber !== undefined && dto.referenceNumber?.trim()) {
      await this.assertUniqueReferenceNumber(
        dto.referenceNumber.trim(),
        property.id,
      );
    }

    if (dto.featureIds !== undefined) {
      const featureIds = [...new Set(dto.featureIds)];
      await this.assertFeatureIds(featureIds);
    }

    if (dto.images !== undefined) {
      await this.assertMediaAssets(
        dto.images.map((image) => image.mediaAssetId),
      );
      this.assertPrimaryImageRules(dto.images);
    }

    await this.prisma.$transaction(async (tx) => {
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

      if (dto.price !== undefined) {
        data.price = dto.price;
      }

      if (dto.currency !== undefined) {
        data.currency = dto.currency.trim() || 'EGP';
      }

      if (dto.referenceNumber !== undefined) {
        data.referenceNumber = dto.referenceNumber?.trim() || null;
      }

      if (dto.paymentType !== undefined) {
        data.paymentType = dto.paymentType;
      }

      if (dto.downPayment !== undefined) {
        data.downPayment = dto.downPayment;
      }

      if (dto.installmentYears !== undefined) {
        data.installmentYears = dto.installmentYears;
      }

      if (dto.monthlyInstallment !== undefined) {
        data.monthlyInstallment = dto.monthlyInstallment;
      }

      if (dto.finishingType !== undefined) {
        data.finishingType = dto.finishingType;
      }

      if (dto.furnished !== undefined) {
        data.furnished = dto.furnished;
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

      if (dto.yearBuilt !== undefined) {
        data.yearBuilt = dto.yearBuilt;
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

      if (Object.keys(data).length > 0) {
        await tx.property.update({
          where: { id: propertyId },
          data,
        });
      }

      if (dto.featureIds !== undefined) {
        const featureIds = [...new Set(dto.featureIds)];
        await tx.propertyFeature.deleteMany({ where: { propertyId } });
        if (featureIds.length > 0) {
          await tx.propertyFeature.createMany({
            data: featureIds.map((featureId) => ({
              propertyId,
              featureId,
            })),
          });
        }
      }

      if (dto.images !== undefined) {
        await tx.propertyImage.deleteMany({ where: { propertyId } });
        if (dto.images.length > 0) {
          await tx.propertyImage.createMany({
            data: dto.images.map((image) => ({
              propertyId,
              mediaAssetId: image.mediaAssetId,
              sortOrder: image.sortOrder,
              isPrimary: image.isPrimary,
              type: MediaType.IMAGE,
            })),
          });
        }
      }
    });

    return this.adminPropertiesService.getPropertyDetails(propertyId);
  }

  private async assertOwnerExists(ownerId: string): Promise<void> {
    const owner = await this.prisma.user.findFirst({
      where: { id: ownerId, isActive: true },
      select: { id: true },
    });

    if (!owner) {
      throw new BadRequestException('Invalid property owner');
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

  private async validateLocation(input: {
    countryId?: string;
    cityId?: string;
    areaId?: string;
    districtId?: string | null;
  }): Promise<void> {
    if (!input.areaId) {
      if (input.districtId) {
        throw new BadRequestException(
          'District requires a valid area to be selected',
        );
      }
      return;
    }

    const area = await this.prisma.area.findFirst({
      where: { id: input.areaId, isActive: true },
      include: { city: true },
    });

    if (!area) {
      throw new BadRequestException('Invalid area');
    }

    if (input.cityId && area.cityId !== input.cityId) {
      throw new BadRequestException('Area does not belong to the selected city');
    }

    if (input.countryId && area.city.countryId !== input.countryId) {
      throw new BadRequestException(
        'Area does not belong to the selected country',
      );
    }

    if (input.districtId) {
      const district = await this.prisma.district.findFirst({
        where: { id: input.districtId, isActive: true },
        select: { id: true, areaId: true },
      });

      if (!district) {
        throw new BadRequestException('Invalid district');
      }

      if (district.areaId !== input.areaId) {
        throw new BadRequestException(
          'District does not belong to the selected area',
        );
      }
    }
  }

  private async assertActiveCompound(
    compoundId: string,
    areaId?: string | null,
  ): Promise<void> {
    const compound = await this.prisma.compound.findFirst({
      where: { id: compoundId, isActive: true },
      select: { id: true, areaId: true },
    });

    if (!compound) {
      throw new BadRequestException('Invalid compound');
    }

    if (areaId && compound.areaId !== areaId) {
      throw new BadRequestException(
        'Compound does not belong to the selected area',
      );
    }
  }

  private async assertUniqueReferenceNumber(
    referenceNumber: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.property.findUnique({
      where: { referenceNumber },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Reference number is already in use');
    }
  }

  private async assertFeatureIds(featureIds: string[]): Promise<void> {
    if (featureIds.length === 0) {
      return;
    }

    const features = await this.prisma.feature.findMany({
      where: { id: { in: featureIds }, isActive: true },
      select: { id: true },
    });

    if (features.length !== featureIds.length) {
      throw new BadRequestException('One or more feature ids are invalid');
    }
  }

  private async assertMediaAssets(mediaAssetIds: string[]): Promise<void> {
    const uniqueIds = [...new Set(mediaAssetIds)];

    if (uniqueIds.length === 0) {
      return;
    }

    if (uniqueIds.length !== mediaAssetIds.length) {
      throw new BadRequestException('Duplicate media asset ids are not allowed');
    }

    const assets = await this.prisma.mediaAsset.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true },
    });

    if (assets.length !== uniqueIds.length) {
      throw new BadRequestException('One or more media assets were not found');
    }
  }

  private assertPrimaryImageRules(images: AdminPropertyImageInputDto[]): void {
    const primaryCount = images.filter((image) => image.isPrimary).length;

    if (primaryCount > 1) {
      throw new BadRequestException('Only one image can be marked as primary');
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
}
