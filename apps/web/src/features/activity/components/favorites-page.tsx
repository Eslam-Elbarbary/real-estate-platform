import { Heart } from 'lucide-react';
import { routes } from '@/config/routes';
import { PropertyCard } from '@/features/property-search-results';
import type { Property } from '@/types';
import { activityCopy } from '../copy';
import { ActivityShell } from './activity-shell';
import { ActivityEmptyState } from './activity-empty-state';

interface FavoritesPageProps {
  properties: Property[];
}

export function FavoritesPage({ properties }: FavoritesPageProps) {
  return (
    <ActivityShell
      sectionTitle={activityCopy.favorites.section}
      navItems={[
        {
          id: 'saved-properties',
          label: activityCopy.favorites.pill,
          href: routes.favorites,
          icon: 'favorites',
          active: true,
        },
      ]}
    >
      {properties.length === 0 ? (
        <ActivityEmptyState
          icon={Heart}
          message={activityCopy.favorites.empty}
          ctaLabel={activityCopy.favorites.cta}
          ctaHref={routes.properties.root('sale')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              initialIsFavorite
            />
          ))}
        </div>
      )}
    </ActivityShell>
  );
}
