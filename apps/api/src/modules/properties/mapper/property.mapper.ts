import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Feature, Property, PropertyStatus, RentPeriod } from '@prisma/client';
import { FeatureResponseDto, toFeatureResponse } from './feature.mapper';

export class PropertyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiPropertyOptional({ nullable: true })
  propertyTypeId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  transactionTypeId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  areaId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  districtId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  compoundId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true })
  floor!: number | null;

  @ApiPropertyOptional({ nullable: true })
  yearBuilt!: number | null;

  @ApiPropertyOptional({ nullable: true })
  furnished!: boolean | null;

  @ApiPropertyOptional({ enum: RentPeriod, nullable: true })
  rentPeriod!: RentPeriod | null;

  @ApiPropertyOptional({ nullable: true })
  price!: number | null;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: [FeatureResponseDto] })
  features?: FeatureResponseDto[];

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  submittedAt!: string | null;

  @ApiPropertyOptional({ nullable: true })
  archivedAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

function decimalToNumber(
  value: Property['price'] | Property['areaSqm'] | Property['latitude'] | Property['longitude'],
): number | null {
  if (value == null) {
    return null;
  }
  return Number(value);
}

function dateToIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

export function toPropertyResponse(
  property: Property,
  features?: Feature[],
): PropertyResponseDto {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    status: property.status,
    propertyTypeId: property.propertyTypeId,
    transactionTypeId: property.transactionTypeId,
    areaId: property.areaId,
    districtId: property.districtId,
    compoundId: property.compoundId,
    address: property.address,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: decimalToNumber(property.areaSqm),
    floor: property.floor,
    yearBuilt: property.yearBuilt,
    furnished: property.furnished,
    rentPeriod: property.rentPeriod,
    price: decimalToNumber(property.price),
    currency: property.currency,
    ...(features
      ? { features: features.map(toFeatureResponse) }
      : {}),
    publishedAt: dateToIso(property.publishedAt),
    submittedAt: dateToIso(property.submittedAt),
    archivedAt: dateToIso(property.archivedAt),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}
