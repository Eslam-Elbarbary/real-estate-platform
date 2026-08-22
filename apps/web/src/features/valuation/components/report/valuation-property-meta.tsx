import { Bath, BedDouble, Building2, MapPin, Paintbrush, Ruler } from 'lucide-react';
import { getPropertyTypeLabel } from '@/config/property-types';
import { formatArea } from '@/lib/formatting/area';
import { valuationFinishingOptions } from '../../config';
import type { ValuationRequest } from '../../types';

interface ValuationPropertyMetaProps {
  request: ValuationRequest;
}

export function ValuationPropertyMeta({ request }: ValuationPropertyMetaProps) {
  const finishingLabel = valuationFinishingOptions.find(
    (option) => option.value === request.finishing,
  )?.label;

  const items = [
    {
      key: 'location',
      icon: MapPin,
      label: request.location.name,
    },
    {
      key: 'type',
      icon: Building2,
      label: getPropertyTypeLabel(request.propertyType),
    },
    request.area != null
      ? {
          key: 'area',
          icon: Ruler,
          label: formatArea(request.area),
        }
      : null,
    request.bedrooms != null
      ? {
          key: 'bedrooms',
          icon: BedDouble,
          label: `${request.bedrooms} غرف`,
        }
      : null,
    request.bathrooms != null
      ? {
          key: 'bathrooms',
          icon: Bath,
          label: `${request.bathrooms} حمام`,
        }
      : null,
    finishingLabel
      ? {
          key: 'finishing',
          icon: Paintbrush,
          label: finishingLabel,
        }
      : null,
  ].filter(Boolean) as { key: string; icon: typeof MapPin; label: string }[];

  return (
    <ul
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600"
      data-testid="valuation-property-meta"
    >
      {items.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-1.5">
          <item.icon
            size={15}
            strokeWidth={1.75}
            className="shrink-0 text-ink-400"
            aria-hidden
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
