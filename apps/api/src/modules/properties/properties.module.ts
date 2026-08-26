import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { LeadsModule } from '../leads/leads.module';
import { PropertyBasicController } from './controllers/property-basic.controller';
import { PropertyDetailsController } from './controllers/property-details.controller';
import { PropertyFeaturesController } from './controllers/property-features.controller';
import { PropertyLocationController } from './controllers/property-location.controller';
import { PropertyMediaController } from './controllers/property-media.controller';
import { PropertyPublicController } from './controllers/property-public.controller';
import { PropertySubmitController } from './controllers/property-submit.controller';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertyMediaService } from './services/property-media.service';
import { PropertyPublicService } from './services/property-public.service';
import { PropertySubmitService } from './services/property-submit.service';
import { PropertyValidationService } from './services/property-validation.service';

@Module({
  imports: [MediaModule, LeadsModule],
  controllers: [
    // Static routes (me/…) must register before public :slug
    PropertiesController,
    PropertyBasicController,
    PropertyLocationController,
    PropertyDetailsController,
    PropertyFeaturesController,
    PropertyMediaController,
    PropertySubmitController,
    PropertyPublicController,
  ],
  providers: [
    PropertiesService,
    PropertyMediaService,
    PropertyValidationService,
    PropertySubmitService,
    PropertyPublicService,
  ],
  exports: [
    PropertiesService,
    PropertyMediaService,
    PropertyValidationService,
    PropertySubmitService,
    PropertyPublicService,
  ],
})
export class PropertiesModule {}
