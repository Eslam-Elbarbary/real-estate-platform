import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Lead,
  LeadStatus,
  LeadType,
  MediaAsset,
  Property,
  PropertyImage,
  User,
} from '@prisma/client';
import { PublicPrimaryImageDto } from '../../properties/mapper/property-public.mapper';

export class LeadBuyerCardDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl!: string | null;
}

export class LeadPropertySummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ type: PublicPrimaryImageDto, nullable: true })
  primaryImage?: PublicPrimaryImageDto | null;
}

export class BuyerLeadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeadType })
  type!: LeadType;

  @ApiProperty({ enum: LeadStatus })
  status!: LeadStatus;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: LeadPropertySummaryDto })
  property!: LeadPropertySummaryDto;
}

export class SellerLeadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeadType })
  type!: LeadType;

  @ApiProperty({ enum: LeadStatus })
  status!: LeadStatus;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: LeadBuyerCardDto })
  buyer!: LeadBuyerCardDto;

  @ApiProperty({ type: LeadPropertySummaryDto })
  property!: LeadPropertySummaryDto;
}

export class LeadCreatedResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeadType })
  type!: LeadType;

  @ApiProperty({ enum: LeadStatus })
  status!: LeadStatus;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiProperty()
  propertyId!: string;

  @ApiProperty()
  createdAt!: Date;
}

type PropertyWithImages = Property & {
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>;
};

type LeadWithProperty = Lead & { property: PropertyWithImages };
type LeadWithBuyerAndProperty = Lead & {
  buyer: User;
  property: Property;
};

function pickPrimaryImage(
  images: Array<PropertyImage & { mediaAsset: MediaAsset }>,
): PublicPrimaryImageDto | null {
  if (images.length === 0) {
    return null;
  }
  const primary = images.find((img) => img.isPrimary) ?? images[0];
  return {
    url: primary.mediaAsset.url,
    isPrimary: primary.isPrimary,
    sortOrder: primary.sortOrder,
  };
}

function toBuyerCard(buyer: User): LeadBuyerCardDto {
  const name = [buyer.firstName, buyer.lastName].filter(Boolean).join(' ').trim();
  return {
    id: buyer.id,
    name: name || null,
    phone: buyer.phone,
    avatarUrl: buyer.avatarUrl,
  };
}

export function toLeadCreatedResponse(lead: Lead): LeadCreatedResponseDto {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    message: lead.message,
    propertyId: lead.propertyId,
    createdAt: lead.createdAt,
  };
}

export function toBuyerLeadResponse(lead: LeadWithProperty): BuyerLeadResponseDto {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    message: lead.message,
    createdAt: lead.createdAt,
    property: {
      id: lead.property.id,
      slug: lead.property.slug,
      title: lead.property.title,
      primaryImage: pickPrimaryImage(lead.property.images),
    },
  };
}

export function toSellerLeadResponse(
  lead: LeadWithBuyerAndProperty,
): SellerLeadResponseDto {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    message: lead.message,
    createdAt: lead.createdAt,
    buyer: toBuyerCard(lead.buyer),
    property: {
      id: lead.property.id,
      slug: lead.property.slug,
      title: lead.property.title,
    },
  };
}
