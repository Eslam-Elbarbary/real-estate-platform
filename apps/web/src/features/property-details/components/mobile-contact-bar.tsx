'use client';

import type { Property } from '@/types';
import { hasUsableContactPhone } from '../lib/property-contact';
import { PropertyContactCard } from './property-contact-card';

interface MobileContactBarProps {
  property: Property;
}

export function MobileContactBar({ property }: MobileContactBarProps) {
  if (!hasUsableContactPhone(property.contact)) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-3 py-2.5 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <PropertyContactCard
        propertyId={property.id}
        propertyTitle={property.title}
        contact={property.contact}
        variant="compact"
      />
    </div>
  );
}
