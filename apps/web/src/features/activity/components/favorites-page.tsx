import { Heart } from 'lucide-react';
import { routes } from '@/config/routes';
import { activityCopy } from '../copy';
import { ActivityShell } from './activity-shell';
import { ActivityEmptyState } from './activity-empty-state';

export function FavoritesPage() {
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
      <ActivityEmptyState
        icon={Heart}
        message={activityCopy.favorites.empty}
        ctaLabel={activityCopy.favorites.cta}
        ctaHref={routes.properties.root('sale')}
      />
    </ActivityShell>
  );
}
