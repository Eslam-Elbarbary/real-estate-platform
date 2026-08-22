import { Container } from '@/components/ui/container';
import type { Property } from '@/types';
import { AgentsStrip } from './agents-strip';
import { AmenitiesSection } from './amenities-section';
import { CompoundRatingSection } from './compound-rating-section';
import { CompoundRecommendation } from './compound-recommendation';
import { DescriptionSection } from './description-section';
import { DetailsSection } from './details-section';
import { InstallmentSection } from './installment-section';
import { ListingBreadcrumb } from './listing-breadcrumb';
import { LocationMap } from './location-map';
import { PriceInsightStrip } from './price-insight-strip';
import { ProBanner } from './pro-banner';
import { PropertyGallery } from './property-gallery';
import { PropertyMainInfo } from './property-main-info';
import { PropertySummary } from './property-summary';
import { PropertySectionNav } from './section-nav';
import { SellerSection } from './seller-section';
import { SimilarProperties } from './similar-properties';
import { StatisticsSection } from './statistics-section';
import { TravelTimeSection } from './travel-time-section';

interface PropertyDetailsPageProps {
  property: Property;
  similarProperties: Property[];
}

export function PropertyDetailsPage({
  property,
  similarProperties,
}: PropertyDetailsPageProps) {
  return (
    <Container wide className="pb-12 pt-2">
      <ListingBreadcrumb property={property} />
      <PropertySummary property={property} />
      <PropertySectionNav />

      <div className="mt-5">
        <PriceInsightStrip />
        <PropertyGallery images={property.images} title={property.title} />
        <PropertyMainInfo property={property} />
        <DetailsSection property={property} />
        <ProBanner />
        <InstallmentSection property={property} />
        <DescriptionSection description={property.description} />
        <AmenitiesSection amenities={property.amenities} />
        <TravelTimeSection />
        <LocationMap location={property.location} />
        <SellerSection property={property} />
        <CompoundRecommendation property={property} />
        <StatisticsSection property={property} />
        <CompoundRatingSection property={property} />
        <SimilarProperties properties={similarProperties} />
        <AgentsStrip />
      </div>
    </Container>
  );
}
