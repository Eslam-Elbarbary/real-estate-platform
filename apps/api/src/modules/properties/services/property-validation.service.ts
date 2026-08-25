import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PropertyCompletionDto } from '../dto/submit-property.dto';

export const REQUIRED_SUBMIT_FIELDS = [
  'title',
  'propertyTypeId',
  'transactionTypeId',
  'areaId',
  'price',
  'images',
] as const;

export type RequiredSubmitField = (typeof REQUIRED_SUBMIT_FIELDS)[number];

export type PropertyCompletion = PropertyCompletionDto & {
  missingFields: RequiredSubmitField[];
};

@Injectable()
export class PropertyValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompletion(
    ownerId: string,
    propertyId: string,
  ): Promise<PropertyCompletion> {
    const property = await this.findOwnedOrThrow(ownerId, propertyId);
    const imageCount = await this.prisma.propertyImage.count({
      where: { propertyId: property.id },
    });
    return this.evaluate(property, imageCount);
  }

  evaluate(property: Property, imageCount: number): PropertyCompletion {
    const missingFields: RequiredSubmitField[] = [];

    if (!property.title?.trim()) {
      missingFields.push('title');
    }
    if (!property.propertyTypeId) {
      missingFields.push('propertyTypeId');
    }
    if (!property.transactionTypeId) {
      missingFields.push('transactionTypeId');
    }
    if (!property.areaId) {
      missingFields.push('areaId');
    }
    if (property.price == null) {
      missingFields.push('price');
    }
    if (imageCount < 1) {
      missingFields.push('images');
    }

    const total = REQUIRED_SUBMIT_FIELDS.length;
    const completedCount = total - missingFields.length;
    const progress = Math.round((completedCount / total) * 100);

    return {
      completed: missingFields.length === 0,
      progress,
      missingFields,
    };
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
}
