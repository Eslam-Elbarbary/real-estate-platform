import { Container } from '@/components/ui/container';
import type { Property } from '@/types';
import { hasUsableContactPhone } from '../lib/property-contact';
import { AmenitiesSection } from './amenities-section';
import { CompoundRatingSection } from './compound-rating-section';
import { CompoundRecommendation } from './compound-recommendation';
import { DescriptionSection } from './description-section';
import { DetailsSection } from './details-section';
import { InstallmentSection } from './installment-section';
import { ListingBreadcrumb } from './listing-breadcrumb';
import { LocationMap } from './location-map';
import { MobileContactBar } from './mobile-contact-bar';
import { ProBanner } from './pro-banner';
import { PropertyContactCard } from './property-contact-card';
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
  const showContact = hasUsableContactPhone(property.contact);

  return (
    <>
      <Container
        wide
        className={showContact ? 'pb-24 pt-2 lg:pb-12' : 'pb-12 pt-2'}
      >
        <ListingBreadcrumb property={property} />
        <PropertySummary property={property} />
        <PropertySectionNav />

        <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-8">
          <div className="min-w-0">
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
            {showContact ? (
              <div className="pt-10 lg:hidden">
                <PropertyContactCard
                  propertyId={property.id}
                  propertyTitle={property.title}
                  contact={property.contact}
                />
              </div>
            ) : null}
            <SellerSection property={property} />
            <CompoundRecommendation property={property} />
            <StatisticsSection property={property} />
            <CompoundRatingSection property={property} />
            <SimilarProperties
              properties={similarProperties}
              favoritePropertyIds={favoriteIdSet}
            />
          </div>

          {showContact ? (
            <div className="hidden lg:sticky lg:top-[calc(var(--header-height-lg)+1rem)] lg:block">
              <PropertyContactCard
                propertyId={property.id}
                propertyTitle={property.title}
                contact={property.contact}
              />
            </div>
          ) : null}
        </div>
      </Container>

      <MobileContactBar property={property} />
    </>
  );
}
