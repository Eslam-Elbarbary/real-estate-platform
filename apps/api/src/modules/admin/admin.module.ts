import { Module } from '@nestjs/common';

import { AlertsModule } from '../alerts/alerts.module';
import { CompoundsModule } from '../compounds/compounds.module';
import { DevelopersModule } from '../developers/developers.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PlansModule } from '../plans/plans.module';

import { AdminPropertiesService } from './admin-properties.service';
import { AdminUsersService } from './admin-users.service';
import { AdminService } from './admin.service';
import { AdminCompoundsController } from './controllers/admin-compounds.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminDevelopersController } from './controllers/admin-developers.controller';
import { AdminPlansController } from './controllers/admin-plans.controller';
import { AdminPropertiesController } from './controllers/admin-properties.controller';
import { AdminUsersController } from './controllers/admin-users.controller';

@Module({
  imports: [
    DevelopersModule,
    CompoundsModule,
    NotificationsModule,
    AlertsModule,
    PlansModule,
  ],
  controllers: [
    AdminDashboardController,
    AdminPropertiesController,
    AdminUsersController,
    AdminDevelopersController,
    AdminCompoundsController,
    AdminPlansController,
  ],
  providers: [AdminService, AdminPropertiesService, AdminUsersService],
})
export class AdminModule {}
