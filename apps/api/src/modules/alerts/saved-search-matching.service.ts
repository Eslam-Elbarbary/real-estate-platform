import { Injectable, Logger } from '@nestjs/common';
import { PropertyStatus } from '@/prisma/generated/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  propertyMatchesAlertFilters,
  type PropertyForAlertMatching,
} from './utils/alert-filter-match.util';

const ALERT_BATCH_SIZE = 100;

@Injectable()
export class SavedSearchMatchingService {
  private readonly logger = new Logger(SavedSearchMatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Notifies owners of active saved searches that match a newly published property. */
  async notifyMatchingAlerts(propertyId: string): Promise<void> {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          features: { select: { featureId: true } },
          area: { select: { cityId: true, city: { select: { countryId: true } } } },
        },
      });

      if (!property || property.status !== PropertyStatus.PUBLISHED) {
        return;
      }

      const matchable: PropertyForAlertMatching = {
        transactionTypeId: property.transactionTypeId,
        propertyTypeId: property.propertyTypeId,
        areaId: property.areaId,
        districtId: property.districtId,
        compoundId: property.compoundId,
        price: property.price,
        areaSqm: property.areaSqm,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        featureIds: property.features.map((feature) => feature.featureId),
        cityId: property.area?.cityId ?? null,
        countryId: property.area?.city?.countryId ?? null,
      };

      let cursor: string | undefined;

      while (true) {
        const alerts = await this.prisma.savedSearchAlert.findMany({
          where: { isActive: true },
          select: { id: true, userId: true, filters: true },
          orderBy: { id: 'asc' },
          take: ALERT_BATCH_SIZE,
          ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        });

        if (alerts.length === 0) {
          break;
        }

        for (const alert of alerts) {
          if (!propertyMatchesAlertFilters(matchable, alert.filters)) {
            continue;
          }

          await this.notificationsService.notifySavedSearchMatch({
            userId: alert.userId,
            propertyId: property.id,
            propertySlug: property.slug,
            alertId: alert.id,
          });
        }

        cursor = alerts[alerts.length - 1].id;
        if (alerts.length < ALERT_BATCH_SIZE) {
          break;
        }
      }
    } catch (error) {
      this.logger.warn(
        `Saved search matching failed for property ${propertyId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
