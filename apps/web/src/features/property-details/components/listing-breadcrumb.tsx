import { ResultsBreadcrumb } from '@/features/property-search-results/components/results-breadcrumb';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import type { Property } from '@/types';

interface ListingBreadcrumbProps {
  property: Property;
}

export function ListingBreadcrumb({ property }: ListingBreadcrumbProps) {
  const typeLabel = getPropertyTypeLabel(property.propertyType);
  const transactionLabel =
    property.transactionType === 'sale' ? uiLabels.forSale : uiLabels.forRent;
  const typePath = routes.properties.byType(
    property.transactionType,
    property.propertyType,
  );
  const areaPath = routes.properties.byLocation(
    property.transactionType,
    property.propertyType,
    [property.location.governorateSlug, property.location.citySlug, property.location.areaSlug],
  );

  return (
    <ResultsBreadcrumb
      className="py-3"
      items={[
        {
          label: property.location.governorateName,
          href: routes.properties.byLocation(
            property.transactionType,
            property.propertyType,
            [property.location.governorateSlug],
          ),
        },
        {
          label: property.location.cityName,
          href: routes.properties.byLocation(
            property.transactionType,
            property.propertyType,
            [property.location.governorateSlug, property.location.citySlug],
          ),
        },
        {
          label: property.location.areaName,
          href: areaPath,
        },
        {
          label: `${typeLabel} ${transactionLabel} في ${property.location.areaName}`,
          href: typePath,
        },
        {
          label: property.title,
        },
      ]}
    />
  );
}
