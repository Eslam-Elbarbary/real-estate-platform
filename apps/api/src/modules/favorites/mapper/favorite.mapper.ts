import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Favorite } from '@prisma/client';
import {
  PublicLocationSummaryDto,
  PublicPrimaryImageDto,
  PublicPropertyCardDto,
  PropertyCardSource,
  toPublicPropertyCard,
} from '../../properties/mapper/property-public.mapper';

export class FavoritePropertyDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: PublicPrimaryImageDto, nullable: true })
  primaryImage!: PublicPrimaryImageDto | null;

  @ApiProperty({ type: PublicLocationSummaryDto })
  location!: PublicLocationSummaryDto;
}

export class FavoriteResponseDto {
  @ApiProperty({
    description: 'Favorite identifier (property id; unique per user)',
  })
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: FavoritePropertyDto })
  property!: FavoritePropertyDto;
}

export class FavoriteCheckDto {
  @ApiProperty()
  isFavorite!: boolean;
}

export type FavoriteWithProperty = Favorite & {
  property: PropertyCardSource;
};

export function toFavoriteResponse(
  favorite: FavoriteWithProperty,
): FavoriteResponseDto {
  const card: PublicPropertyCardDto = toPublicPropertyCard(favorite.property);
  return {
    id: favorite.propertyId,
    createdAt: favorite.createdAt,
    property: {
      id: card.id,
      slug: card.slug,
      title: card.title,
      price: card.price,
      currency: card.currency,
      primaryImage: card.primaryImage,
      location: card.location,
    },
  };
}
