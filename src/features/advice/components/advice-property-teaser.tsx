import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import { adviceCopy } from '../config';
import { AdviceSectionHeading } from './advice-breadcrumb';

interface AdvicePropertyTeaserProps {
  properties: Property[];
}

export function AdvicePropertyTeaser({ properties }: AdvicePropertyTeaserProps) {
  if (!properties.length) return null;

  return (
    <section className="mt-8" aria-labelledby="advice-related-properties">
      <AdviceSectionHeading as="h2" className="text-base sm:text-lg">
        <span id="advice-related-properties">{adviceCopy.relatedProperties}</span>
      </AdviceSectionHeading>
      <ul className="mt-4 space-y-3">
        {properties.map((property) => {
          const cover =
            property.images.find((image) => image.isCover)?.url ??
            property.images[0]?.url ??
            '/assets/properties/property-01.webp';
          return (
            <li key={property.id}>
              <Link
                href={routes.listing(property.id, property.slug)}
                className="flex gap-3 rounded-md p-1 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-surface-100">
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 py-0.5">
                  <p className="truncate text-sm font-bold text-ink-950">
                    {property.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink-500">
                    {property.location.areaName || property.location.cityName}
                  </p>
                  <p className="mt-1 text-sm font-bold text-brand-700">
                    {formatCurrency(
                      property.price,
                      property.currency,
                      property.pricingPeriod,
                    )}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
