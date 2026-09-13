import { Module } from '@nestjs/common';

import { AlertsModule } from '../alerts/alerts.module';
import { CompoundsModule } from '../compounds/compounds.module';
import { DevelopersModule } from '../developers/developers.module';
import { MediaModule } from '../media/media.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PlansModule } from '../plans/plans.module';

import { AdminLeadsService } from './admin-leads.service';
import { AdminMediaService } from './admin-media.service';
import { AdminPaymentsService } from './admin-payments.service';
import { AdminPropertyManagementService } from './admin-property-management.service';
import { AdminPropertiesService } from './admin-properties.service';
import { AdminUsersService } from './admin-users.service';
import { AdminService } from './admin.service';
import { AdminCompoundsController } from './controllers/admin-compounds.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminDevelopersController } from './controllers/admin-developers.controller';
import { AdminLeadsController } from './controllers/admin-leads.controller';
import { AdminMediaController } from './controllers/admin-media.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';
import { AdminPlansController } from './controllers/admin-plans.controller';
import { AdminPropertiesController } from './controllers/admin-properties.controller';
import { AdminPropertyMediaController } from './controllers/admin-property-media.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminPropertyMediaService } from './admin-property-media.service';

@Module({
  imports: [
    AdminAuthModule,
    DevelopersModule,
    CompoundsModule,
    MediaModule,
    NotificationsModule,
    AlertsModule,
    PlansModule,
    PermissionsModule,
  ],
  controllers: [
    AdminDashboardController,
    AdminPropertyMediaController,
    AdminPropertiesController,
    AdminUsersController,
    AdminDevelopersController,
    AdminCompoundsController,
    AdminPlansController,
    AdminPaymentsController,
    AdminLeadsController,
    AdminMediaController,
  ],
  providers: [
    AdminService,
    AdminPropertiesService,
    AdminPropertyManagementService,
    AdminPropertyMediaService,
    AdminUsersService,
    AdminPaymentsService,
    AdminLeadsService,
    AdminMediaService,
  ],
})
export class AdminModule {}
