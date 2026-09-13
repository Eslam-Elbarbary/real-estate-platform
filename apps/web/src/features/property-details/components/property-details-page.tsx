import { Container } from '@/components/ui/container';
import type { Property } from '@/types';
import { AmenitiesSection } from './amenities-section';
import { CompoundRatingSection } from './compound-rating-section';
import { CompoundRecommendation } from './compound-recommendation';
import { DescriptionSection } from './description-section';
import { DetailsSection } from './details-section';
import { InstallmentSection } from './installment-section';
import { ListingBreadcrumb } from './listing-breadcrumb';
import { LocationMap } from './location-map';
import { ProBanner } from './pro-banner';
import { PropertyGallery } from './property-gallery';
import { PropertyMainInfo } from './property-main-info';
import { PropertySummary } from './property-summary';
import { PropertySectionNav } from './section-nav';
import { SellerSection } from './seller-section';
import { SimilarProperties } from './similar-properties';
import { StatisticsSection } from './statistics-section';

interface PropertyDetailsPageProps {
  property: Property;
  similarProperties: Property[];
  initialIsFavorite?: boolean;
  favoritePropertyIds?: string[];
}

export function PropertyDetailsPage({
  property,
  similarProperties,
  initialIsFavorite = false,
  favoritePropertyIds = [],
}: PropertyDetailsPageProps) {
  const favoriteIdSet = new Set(favoritePropertyIds);

  return (
    <Container wide className="pb-12 pt-2">
      <ListingBreadcrumb property={property} />
      <PropertySummary property={property} />
      <PropertySectionNav />

      <div className="mt-5">
        <PropertyGallery images={property.images} title={property.title} />
        <PropertyMainInfo
          property={property}
          initialIsFavorite={initialIsFavorite}
        />
        <DetailsSection property={property} />
        <ProBanner />
        <InstallmentSection property={property} />
        <DescriptionSection description={property.description} />
        <AmenitiesSection amenities={property.amenities} />
        <LocationMap location={property.location} />
        <SellerSection property={property} />
        <CompoundRecommendation property={property} />
        <StatisticsSection property={property} />
        <CompoundRatingSection property={property} />
        <SimilarProperties
          properties={similarProperties}
          favoritePropertyIds={favoriteIdSet}
        />
      </div>
    </Container>
  );
}
