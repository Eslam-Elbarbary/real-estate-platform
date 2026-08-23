import { Module } from '@nestjs/common';
import { PropertyBasicController } from './controllers/property-basic.controller';
import { PropertyDetailsController } from './controllers/property-details.controller';
import { PropertyFeaturesController } from './controllers/property-features.controller';
import { PropertyLocationController } from './controllers/property-location.controller';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  controllers: [
    PropertiesController,
    PropertyBasicController,
    PropertyLocationController,
    PropertyDetailsController,
    PropertyFeaturesController,
  ],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
