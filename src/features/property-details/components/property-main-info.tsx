import { Bath, BedDouble, CalendarDays, MapPin, Paintbrush, Ruler } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { formatArea } from '@/lib/formatting/area';
import { formatDate } from '@/lib/formatting/date';
import type { Property } from '@/types';
import { getFinishingLabel } from '../lib/labels';
import { PropertyActions } from './property-actions';

interface PropertyMainInfoProps {
  property: Property;
}

export function PropertyMainInfo({ property }: PropertyMainInfoProps) {
  const locationLine = [property.location.areaName, property.location.cityName]
    .filter(Boolean)
    .join('، ');

  const specs = [
    {
      icon: Ruler,
      label: formatArea(property.area),
    },
    property.bedrooms
      ? {
          icon: BedDouble,
          label: `${property.bedrooms} ${uiLabels.bedroomsShort}`,
        }
      : null,
    property.bathrooms
      ? {
          icon: Bath,
          label: `${property.bathrooms} ${uiLabels.bathroomsShort}`,
        }
      : null,
    {
      icon: Paintbrush,
      label: getFinishingLabel(property.finishingType),
    },
  ].filter(Boolean) as Array<{ icon: typeof Ruler; label: string }>;

  return (
    <section className="mt-6 border-b border-border pb-6">
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {property.title}
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4 text-ink-500" aria-hidden />
          {locationLine}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 text-ink-500" aria-hidden />
          {formatDate(property.createdAt)}
        </span>
        <span className="text-ink-500">{property.referenceNumber}</span>
      </div>

      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5">
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <li
              key={spec.label}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink-800"
            >
              <Icon className="size-[18px] text-ink-500" aria-hidden />
              {spec.label}
            </li>
          );
        })}
      </ul>

      <PropertyActions title={property.title} className="mt-5" />
    </section>
  );
}
