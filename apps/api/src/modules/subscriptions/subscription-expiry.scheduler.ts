import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionExpiryService } from './subscription-expiry.service';

@Injectable()
export class SubscriptionExpiryScheduler {
  private readonly logger = new Logger(SubscriptionExpiryScheduler.name);

  constructor(private readonly expiryService: SubscriptionExpiryService) {}

  /** Runs hourly; delegates to the idempotent expiry service. */
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiryCron(): Promise<void> {
    try {
      const result = await this.expiryService.expireSubscriptions();
      if (result.expiredCount > 0) {
        this.logger.log(
          `Expired ${result.expiredCount} subscription(s); ${result.propertiesExpiredCount} published listing(s) marked EXPIRED`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Subscription expiry cron failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
