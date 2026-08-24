import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { PropertyBasicController } from './controllers/property-basic.controller';
import { PropertyDetailsController } from './controllers/property-details.controller';
import { PropertyFeaturesController } from './controllers/property-features.controller';
import { PropertyLocationController } from './controllers/property-location.controller';
import { PropertyMediaController } from './controllers/property-media.controller';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertyMediaService } from './services/property-media.service';

@Module({
  imports: [MediaModule],
  controllers: [
    PropertiesController,
    PropertyBasicController,
    PropertyLocationController,
    PropertyDetailsController,
    PropertyFeaturesController,
    PropertyMediaController,
  ],
  providers: [PropertiesService, PropertyMediaService],
  exports: [PropertiesService, PropertyMediaService],
})
export class PropertiesModule {}
