import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus, SubscriptionStatus } from '@/prisma/generated/prisma-client';
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

    if (property.status !== PropertyStatus.REJECTED) {
      throw new ForbiddenException(
        'Only rejected properties can be resubmitted. Select a listing plan to submit a new property.',
      );
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

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        propertyId: property.id,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      throw new ConflictException(
        'A valid active listing plan is required. Select a new plan before resubmitting.',
      );
    }

    const now = new Date();
    if (!subscription.endsAt || subscription.endsAt.getTime() <= now.getTime()) {
      throw new ConflictException(
        'The listing plan has expired. Select a new plan before resubmitting.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const current = await tx.property.findUniqueOrThrow({
        where: { id: property.id },
      });

      if (current.status !== PropertyStatus.REJECTED) {
        throw new ConflictException('Property is no longer rejected');
      }

      const next = await tx.property.update({
        where: { id: property.id },
        data: {
          status: PropertyStatus.PENDING_REVIEW,
          submittedAt: now,
          rejectedReason: null,
        },
      });

      await tx.propertyStatusHistory.create({
        data: {
          propertyId: property.id,
          fromStatus: PropertyStatus.REJECTED,
          toStatus: PropertyStatus.PENDING_REVIEW,
          changedById: ownerId,
          reason: 'Resubmitted for review',
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
