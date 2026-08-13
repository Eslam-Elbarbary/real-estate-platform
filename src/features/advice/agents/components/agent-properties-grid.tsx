import { PropertyCard } from '@/features/property-search-results';
import type { Property } from '@/types';

interface AgentPropertiesGridProps {
  properties: Property[];
}

export function AgentPropertiesGrid({ properties }: AgentPropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
