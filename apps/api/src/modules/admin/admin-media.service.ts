import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';
import { ListAdminMediaQueryDto } from './dto/list-admin-media-query.dto';
import {
  ADMIN_MEDIA_INCLUDE,
  AdminMediaDto,
  MediaAssetWithUploader,
  toAdminMediaDto,
} from './mapper/admin-media.mapper';

@Injectable()
export class AdminMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async listMedia(query: ListAdminMediaQueryDto): Promise<{
    data: AdminMediaDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MediaAssetWhereInput = {};

    if (query.folder?.trim()) {
      where.folder = query.folder.trim();
    }

    if (query.search?.trim()) {
      where.fileName = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    const [total, rows] = await Promise.all([
      this.prisma.mediaAsset.count({ where }),
      this.prisma.mediaAsset.findMany({
        where,
        include: ADMIN_MEDIA_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) =>
        toAdminMediaDto(row as MediaAssetWithUploader),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async uploadMedia(
    adminUserId: string,
    files: Express.Multer.File[] | undefined,
    folder?: string,
  ): Promise<AdminMediaDto[]> {
    if (!files?.length) {
      throw new BadRequestException('At least one file is required');
    }

    const uploaded: AdminMediaDto[] = [];

    for (const file of files) {
      const asset = await this.mediaService.uploadLibraryAsset(
        adminUserId,
        file,
        folder,
      );

      const row = await this.prisma.mediaAsset.findUnique({
        where: { id: asset.id },
        include: ADMIN_MEDIA_INCLUDE,
      });

      if (row) {
        uploaded.push(toAdminMediaDto(row as MediaAssetWithUploader));
      }
    }

    return uploaded;
  }

  async deleteMedia(assetId: string): Promise<{ message: string }> {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: assetId },
      include: {
        _count: {
          select: { propertyImages: true },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    if (asset._count.propertyImages > 0) {
      throw new BadRequestException(
        'Media asset is linked to one or more properties and cannot be deleted',
      );
    }

    await this.mediaService.deleteAssetById(assetId);

    return { message: 'Media asset deleted successfully' };
  }
}
