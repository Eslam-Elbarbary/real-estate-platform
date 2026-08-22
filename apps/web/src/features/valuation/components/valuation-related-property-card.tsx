import Image from 'next/image';
import Link from 'next/link';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';

interface ValuationRelatedPropertyCardProps {
  property: Property;
}

export function ValuationRelatedPropertyCard({
  property,
}: ValuationRelatedPropertyCardProps) {
  const cover =
    property.images.find((image) => image.isCover)?.url ??
    property.images[0]?.url ??
    '/assets/properties/property-01.webp';

  return (
    <Link
      href={routes.listing(property.id, property.slug)}
      className="flex gap-3 overflow-hidden rounded-xl border border-border bg-white p-3 transition-colors hover:border-brand-200"
    >
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={cover}
          alt=""
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-sm font-extrabold text-ink-950">
          {property.title}
        </p>
        <p className="mt-1 truncate text-xs text-ink-500">
          {property.location.cityName} · {getPropertyTypeLabel(property.propertyType)}
        </p>
        <p className="mt-2 text-sm font-bold text-brand-700">
          {formatCurrency(property.price, property.currency, property.pricingPeriod)}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {property.area} م² · {property.bedrooms} غرف · {property.bathrooms} حمام
        </p>
      </div>
    </Link>
  );
}
