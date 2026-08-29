import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { PropertiesModule } from '../properties/properties.module';
import { SubscriptionExpiryScheduler } from './subscription-expiry.scheduler';
import { SubscriptionExpiryService } from './subscription-expiry.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [forwardRef(() => PropertiesModule), NotificationsModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionExpiryService,
    SubscriptionExpiryScheduler,
  ],
  exports: [SubscriptionsService, SubscriptionExpiryService],
})
export class SubscriptionsModule {}
