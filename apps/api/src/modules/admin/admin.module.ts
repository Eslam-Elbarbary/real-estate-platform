import { Module } from '@nestjs/common';

import { AlertsModule } from '../alerts/alerts.module';
import { CompoundsModule } from '../compounds/compounds.module';
import { DevelopersModule } from '../developers/developers.module';
import { MediaModule } from '../media/media.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PlansModule } from '../plans/plans.module';
import { PropertiesModule } from '../properties/properties.module';

import { AdminLeadsService } from './admin-leads.service';
import { AdminMediaService } from './admin-media.service';
import { AdminPaymentsService } from './admin-payments.service';
import { AdminCatalogsService } from './admin-catalogs.service';
import { AdminLocationsService } from './admin-locations.service';
import { AdminPropertyManagementService } from './admin-property-management.service';
import { AdminPropertiesService } from './admin-properties.service';
import { AdminUsersService } from './admin-users.service';
import { AdminService } from './admin.service';
import { AdminCatalogsController } from './controllers/admin-catalogs.controller';
import { AdminLocationsController } from './controllers/admin-locations.controller';
import { AdminFeaturesController } from './controllers/admin-features.controller';
import { AdminCompoundsController } from './controllers/admin-compounds.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminDevelopersController } from './controllers/admin-developers.controller';
import { AdminLeadsController } from './controllers/admin-leads.controller';
import { AdminMediaController } from './controllers/admin-media.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';
import { AdminPlansController } from './controllers/admin-plans.controller';
import { AdminPropertiesController } from './controllers/admin-properties.controller';
import { AdminPropertyMediaController } from './controllers/admin-property-media.controller';
import { AdminPropertyContactController } from './controllers/admin-property-contact.controller';
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
    PropertiesModule,
  ],
  controllers: [
    AdminDashboardController,
    AdminPropertyMediaController,
    AdminPropertyContactController,
    AdminPropertiesController,
    AdminUsersController,
    AdminDevelopersController,
    AdminCompoundsController,
    AdminPlansController,
    AdminPaymentsController,
    AdminLeadsController,
    AdminMediaController,
    AdminCatalogsController,
    AdminFeaturesController,
    AdminLocationsController,
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
    AdminCatalogsService,
    AdminLocationsService,
  ],
})
export class AdminModule {}
