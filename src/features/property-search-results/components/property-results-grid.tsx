import type { Property } from '@/types';
import { PropertyCard } from './property-card';
import { SearchPromoCard } from './search-promo-card';

interface PropertyResultsGridProps {
  properties: Property[];
  showPromo?: boolean;
}

export function PropertyResultsGrid({
  properties,
  showPromo = true,
}: PropertyResultsGridProps) {
  const insertAt = Math.min(4, properties.length);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {properties.slice(0, insertAt).map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showContactActions
        />
      ))}

      {showPromo && properties.length >= 4 ? <SearchPromoCard /> : null}

      {properties.slice(insertAt).map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showContactActions
        />
      ))}
    </div>
  );
}
