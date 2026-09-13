import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import {
  FavoriteCheckDto,
  FavoriteResponseDto,
  FavoriteWithProperty,
  toFavoriteResponse,
} from './mapper/favorite.mapper';

const favoritePropertyInclude = {
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
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, propertyId: string): Promise<FavoriteResponseDto> {
    await this.assertPropertyExists(propertyId);

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existing) {
      throw new ConflictException('Property is already in favorites');
    }

    const favorite = await this.prisma.favorite.create({
      data: { userId, propertyId },
      include: {
        property: { include: favoritePropertyInclude },
      },
    });

    return toFavoriteResponse(favorite as FavoriteWithProperty);
  }

  async remove(userId: string, propertyId: string): Promise<{ message: string }> {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    return { message: 'Favorite removed' };
  }

  async list(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: { include: favoritePropertyInclude },
      },
      orderBy: { createdAt: 'desc' },
    });

    return (favorites as FavoriteWithProperty[]).map(toFavoriteResponse);
  }

  async check(userId: string, propertyId: string): Promise<FavoriteCheckDto> {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
      select: { userId: true },
    });

    return { isFavorite: Boolean(existing) };
  }

  private async assertPropertyExists(propertyId: string): Promise<void> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }
  }
}
