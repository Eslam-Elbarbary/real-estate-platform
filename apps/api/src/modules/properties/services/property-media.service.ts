import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaType, Property, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { MediaService } from '../../media/media.service';
import { ReorderMediaDto } from '../dto/reorder-media.dto';
import {
  PropertyImageResponseDto,
  toPropertyImageResponse,
} from '../mapper/property-image.mapper';

@Injectable()
export class PropertyMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async uploadImage(
    ownerId: string,
    propertyId: string,
    file: Express.Multer.File | undefined,
  ): Promise<PropertyImageResponseDto> {
    const property = await this.findOwnedDraftOrThrow(ownerId, propertyId);

    const asset = await this.mediaService.uploadLibraryAsset(
      ownerId,
      file,
      `aqarmap/properties/${property.id}`,
    );

    const existingCount = await this.prisma.propertyImage.count({
      where: { propertyId: property.id },
    });

    const nextSort =
      (
        await this.prisma.propertyImage.aggregate({
          where: { propertyId: property.id },
          _max: { sortOrder: true },
        })
      )._max.sortOrder ?? -1;

    const image = await this.prisma.propertyImage.create({
      data: {
        propertyId: property.id,
        mediaAssetId: asset.id,
        sortOrder: nextSort + 1,
        isPrimary: existingCount === 0,
        type: MediaType.IMAGE,
      },
      include: { mediaAsset: true },
    });

    return toPropertyImageResponse(image);
  }

  async listImages(
    ownerId: string,
    propertyId: string,
  ): Promise<PropertyImageResponseDto[]> {
    await this.findOwnedOrThrow(ownerId, propertyId);

    const images = await this.prisma.propertyImage.findMany({
      where: { propertyId },
      include: { mediaAsset: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return images.map(toPropertyImageResponse);
  }

  async deleteImage(
    ownerId: string,
    propertyId: string,
    imageId: string,
  ): Promise<{ message: string }> {
    const property = await this.findOwnedDraftOrThrow(ownerId, propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId: property.id },
      include: { mediaAsset: true },
    });

    if (!image) {
      throw new NotFoundException('Property image not found');
    }

    const wasPrimary = image.isPrimary;
    const mediaAssetId = image.mediaAssetId;

    await this.prisma.propertyImage.delete({ where: { id: image.id } });

    const remainingLinks = await this.prisma.propertyImage.count({
      where: { mediaAssetId },
    });

    if (remainingLinks === 0) {
      await this.mediaService.deleteAssetById(mediaAssetId);
    }

    if (wasPrimary) {
      const nextPrimary = await this.prisma.propertyImage.findFirst({
        where: { propertyId: property.id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      if (nextPrimary) {
        await this.prisma.propertyImage.update({
          where: { id: nextPrimary.id },
          data: { isPrimary: true },
        });
      }
    }

    return { message: 'Property image deleted successfully' };
  }

  async reorderImages(
    ownerId: string,
    propertyId: string,
    dto: ReorderMediaDto,
  ): Promise<PropertyImageResponseDto[]> {
    const property = await this.findOwnedDraftOrThrow(ownerId, propertyId);

    const imageIds = dto.images.map((item) => item.id);
    const uniqueIds = new Set(imageIds);
    if (uniqueIds.size !== imageIds.length) {
      throw new BadRequestException('Duplicate image ids in reorder payload');
    }

    const existing = await this.prisma.propertyImage.findMany({
      where: { propertyId: property.id, id: { in: imageIds } },
      select: { id: true },
    });

    if (existing.length !== imageIds.length) {
      throw new BadRequestException(
        'One or more images do not belong to this property',
      );
    }

    await this.prisma.$transaction(
      dto.images.map((item) =>
        this.prisma.propertyImage.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return this.listImages(ownerId, propertyId);
  }

  async setPrimaryImage(
    ownerId: string,
    propertyId: string,
    imageId: string,
  ): Promise<PropertyImageResponseDto> {
    const property = await this.findOwnedDraftOrThrow(ownerId, propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId: property.id },
    });

    if (!image) {
      throw new NotFoundException('Property image not found');
    }

    await this.prisma.$transaction([
      this.prisma.propertyImage.updateMany({
        where: { propertyId: property.id, isPrimary: true },
        data: { isPrimary: false },
      }),
      this.prisma.propertyImage.update({
        where: { id: image.id },
        data: { isPrimary: true },
      }),
    ]);

    const updated = await this.prisma.propertyImage.findUniqueOrThrow({
      where: { id: image.id },
      include: { mediaAsset: true },
    });

    return toPropertyImageResponse(updated);
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

  private async findOwnedDraftOrThrow(
    ownerId: string,
    propertyId: string,
  ): Promise<Property> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);

    if (property.status !== PropertyStatus.DRAFT) {
      throw new ForbiddenException(
        'Only draft properties can manage media',
      );
    }

    return property;
  }
}
