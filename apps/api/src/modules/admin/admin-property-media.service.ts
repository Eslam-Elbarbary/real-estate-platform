import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaType, Property } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';
import { ReorderMediaDto } from '../properties/dto/reorder-media.dto';
import {
  AdminPropertyImageDto,
} from './mapper/admin-property.mapper';
import { AttachAdminPropertyMediaDto } from './dto/attach-admin-property-media.dto';

@Injectable()
export class AdminPropertyMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async list(propertyId: string): Promise<AdminPropertyImageDto[]> {
    await this.findPropertyOrThrow(propertyId);
    return this.listImages(propertyId);
  }

  async attach(
    propertyId: string,
    dto: AttachAdminPropertyMediaDto & { mediaAssetId: string },
  ): Promise<AdminPropertyImageDto> {
    await this.findPropertyOrThrow(propertyId);

    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: dto.mediaAssetId },
      select: { id: true },
    });
    if (!asset) {
      throw new BadRequestException('One or more media assets were not found');
    }

    const duplicate = await this.prisma.propertyImage.findFirst({
      where: { propertyId, mediaAssetId: dto.mediaAssetId },
      select: { id: true },
    });
    if (duplicate) {
      throw new BadRequestException(
        'Duplicate media asset ids are not allowed on a property',
      );
    }

    const existingCount = await this.prisma.propertyImage.count({
      where: { propertyId },
    });

    const nextSort =
      dto.sortOrder ??
      ((
        await this.prisma.propertyImage.aggregate({
          where: { propertyId },
          _max: { sortOrder: true },
        })
      )._max.sortOrder ?? -1) + 1;

    const makePrimary =
      dto.isPrimary === true || (dto.isPrimary !== false && existingCount === 0);

    if (makePrimary) {
      await this.prisma.propertyImage.updateMany({
        where: { propertyId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.propertyImage.create({
      data: {
        propertyId,
        mediaAssetId: dto.mediaAssetId,
        sortOrder: nextSort,
        isPrimary: makePrimary,
        type: dto.type ?? MediaType.IMAGE,
      },
      include: { mediaAsset: true },
    });

    return this.toDto(image);
  }

  async upload(
    adminId: string,
    propertyId: string,
    file: Express.Multer.File | undefined,
  ): Promise<AdminPropertyImageDto> {
    await this.findPropertyOrThrow(propertyId);

    const asset = await this.mediaService.uploadLibraryAsset(
      adminId,
      file,
      `aqarmap/properties/${propertyId}`,
    );

    return this.attach(propertyId, {
      mediaAssetId: asset.id,
      type: MediaType.IMAGE,
    });
  }

  async delete(
    propertyId: string,
    imageId: string,
  ): Promise<{ message: string }> {
    await this.findPropertyOrThrow(propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
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
        where: { propertyId },
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

  async reorder(
    propertyId: string,
    dto: ReorderMediaDto,
  ): Promise<AdminPropertyImageDto[]> {
    await this.findPropertyOrThrow(propertyId);

    const imageIds = dto.images.map((item) => item.id);
    const uniqueIds = new Set(imageIds);
    if (uniqueIds.size !== imageIds.length) {
      throw new BadRequestException('Duplicate image ids in reorder payload');
    }

    const existing = await this.prisma.propertyImage.findMany({
      where: { propertyId, id: { in: imageIds } },
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

    return this.listImages(propertyId);
  }

  async setPrimary(
    propertyId: string,
    imageId: string,
  ): Promise<AdminPropertyImageDto> {
    await this.findPropertyOrThrow(propertyId);

    const image = await this.prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
    });
    if (!image) {
      throw new NotFoundException('Property image not found');
    }

    await this.prisma.$transaction([
      this.prisma.propertyImage.updateMany({
        where: { propertyId, isPrimary: true },
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

    return this.toDto(updated);
  }

  private async listImages(propertyId: string): Promise<AdminPropertyImageDto[]> {
    const images = await this.prisma.propertyImage.findMany({
      where: { propertyId },
      include: { mediaAsset: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return images.map((image) => this.toDto(image));
  }

  private toDto(image: {
    id: string;
    mediaAssetId: string;
    type: MediaType;
    sortOrder: number;
    isPrimary: boolean;
    mediaAsset: { url: string };
  }): AdminPropertyImageDto {
    return {
      id: image.id,
      mediaAssetId: image.mediaAssetId,
      url: image.mediaAsset.url,
      type: image.type,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    };
  }

  private async findPropertyOrThrow(propertyId: string): Promise<Property> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }
}
