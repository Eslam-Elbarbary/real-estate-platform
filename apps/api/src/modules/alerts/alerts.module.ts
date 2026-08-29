import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { SavedSearchMatchingService } from './saved-search-matching.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AlertsController],
  providers: [AlertsService, SavedSearchMatchingService],
  exports: [AlertsService, SavedSearchMatchingService],
})
export class AlertsModule {}
