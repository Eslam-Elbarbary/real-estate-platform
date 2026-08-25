import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import {
  PropertyResponseDto,
  toPropertyResponse,
} from '../mapper/property.mapper';
import {
  PropertyCompletion,
  PropertyValidationService,
  RequiredSubmitField,
} from './property-validation.service';

export type SubmitPropertyResult =
  | { ok: true; property: PropertyResponseDto }
  | { ok: false; missingFields: RequiredSubmitField[] };

@Injectable()
export class PropertySubmitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: PropertyValidationService,
  ) {}

  async getCompletion(
    ownerId: string,
    propertyId: string,
  ): Promise<PropertyCompletion> {
    return this.validationService.getCompletion(ownerId, propertyId);
  }

  async submit(
    ownerId: string,
    propertyId: string,
  ): Promise<SubmitPropertyResult> {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.DRAFT) {
      throw new ForbiddenException('Only draft properties can be submitted');
    }

    const imageCount = await this.prisma.propertyImage.count({
      where: { propertyId: property.id },
    });
    const completion = this.validationService.evaluate(property, imageCount);

    if (!completion.completed) {
      return {
        ok: false,
        missingFields: completion.missingFields,
      };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.property.update({
        where: { id: property.id },
        data: {
          status: PropertyStatus.PENDING_REVIEW,
          submittedAt: new Date(),
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: PropertyStatus.DRAFT,
          toStatus: PropertyStatus.PENDING_REVIEW,
          changedById: ownerId,
          reason: 'Submitted for review',
        },
      });

      return next;
    });

    return {
      ok: true,
      property: toPropertyResponse(updated),
    };
  }
}
