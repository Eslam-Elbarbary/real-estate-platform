import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaAsset, RoleCode } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ListMediaQueryDto } from './dto/list-media-query.dto';
import {
  MEDIA_PROVIDER,
  MediaDeleteInput,
  MediaProvider,
  MediaUploadInput,
  MediaUploadResult,
} from './interfaces/media-provider.interface';
import {
  MediaAssetResponseDto,
  toMediaAssetResponse,
} from './mapper/media-asset.mapper';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const DEFAULT_LIBRARY_FOLDER = 'aqarmap/library';

export type PaginatedMediaAssets = {
  items: MediaAssetResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Application-facing media service.
 * Keeps provider passthrough for avatar uploads; library methods persist MediaAsset rows.
 */
@Injectable()
export class MediaService {
  constructor(
    @Inject(MEDIA_PROVIDER)
    private readonly mediaProvider: MediaProvider,
    private readonly prisma: PrismaService,
  ) {}

  /** Provider passthrough — used by UsersService avatar flow. Do not remove. */
  upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    return this.mediaProvider.upload(input);
  }

  /** Provider passthrough — used by UsersService avatar flow. Do not remove. */
  delete(input: MediaDeleteInput): Promise<void> {
    return this.mediaProvider.delete(input);
  }

  getProviderName(): string {
    return this.mediaProvider.name;
  }

  async uploadLibraryAsset(
    userId: string,
    file: Express.Multer.File | undefined,
    folder?: string,
  ): Promise<MediaAssetResponseDto> {
    this.assertValidImageFile(file);

    const targetFolder = folder?.trim() || DEFAULT_LIBRARY_FOLDER;

    const uploaded = await this.mediaProvider.upload({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      folder: targetFolder,
      resourceType: 'image',
      tags: ['library', userId],
    });

    const asset = await this.prisma.mediaAsset.create({
      data: {
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
        fileName: file.originalname || null,
        mimeType: file.mimetype || null,
        size: file.size ?? uploaded.bytes ?? null,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        folder: targetFolder,
        uploadedById: userId,
      },
    });

    return toMediaAssetResponse(asset);
  }

  async listLibraryAssets(
    userId: string,
    query: ListMediaQueryDto,
  ): Promise<PaginatedMediaAssets> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      uploadedById: userId,
      ...(query.folder ? { folder: query.folder.trim() } : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.mediaAsset.count({ where }),
      this.prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: rows.map(toMediaAssetResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async deleteLibraryAsset(
    userId: string,
    roles: string[] | undefined,
    assetId: string,
  ): Promise<{ message: string }> {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    const isOwner = asset.uploadedById === userId;
    const isAdmin = (roles ?? []).includes(RoleCode.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this media asset');
    }

    await this.mediaProvider.delete({
      publicId: asset.publicId,
      resourceType: 'image',
    });

    await this.prisma.mediaAsset.delete({ where: { id: asset.id } });

    return { message: 'Media asset deleted successfully' };
  }

  async findAssetById(id: string): Promise<MediaAsset | null> {
    return this.prisma.mediaAsset.findUnique({ where: { id } });
  }

  private assertValidImageFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: JPEG, PNG, WebP',
      );
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      throw new BadRequestException('File must be between 1 byte and 5MB');
    }

    if (!file.buffer?.length) {
      throw new BadRequestException('File is empty');
    }
  }
}
