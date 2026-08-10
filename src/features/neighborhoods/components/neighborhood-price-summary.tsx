import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { neighborhoodCopy } from '../config';
import { formatPricePerSqm } from '../lib/format';
import type { NeighborhoodPropertyPrice } from '../types';

interface NeighborhoodPriceSummaryProps {
  name: string;
  pathSegments: string[];
  priceStats: NeighborhoodPropertyPrice[];
}

export function NeighborhoodPriceSummary({
  name,
  pathSegments,
  priceStats,
}: NeighborhoodPriceSummaryProps) {
  if (!priceStats.length) return null;

  const searchHref = routes.properties.byLocation(
    'sale',
    priceStats[0]?.propertyType ?? 'apartment',
    pathSegments,
  );

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950 sm:text-2xl">
        {neighborhoodCopy.priceOverviewPrefix} {name}
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {priceStats.map((stat) =>
          stat.salePricePerSqm != null ? (
            <div
              key={stat.propertyType}
              className="rounded-lg border border-[#e8e8e8] bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-sm font-bold text-ink-700">
                {getPropertyTypeLabel(stat.propertyType)}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-ink-950">
                {formatPricePerSqm(stat.salePricePerSqm)}
              </p>
              <p className="mt-1 text-xs font-semibold text-ink-500">
                {neighborhoodCopy.pricePerSqm}
              </p>
            </div>
          ) : null,
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={routes.valuation.root}
          className={getButtonClassName({
            className: 'rounded-md px-5 font-bold',
          })}
        >
          {neighborhoodCopy.valuationCta}
        </Link>
        <Link
          href={searchHref}
          className={getButtonClassName({
            className: 'rounded-md px-5 font-bold',
          })}
        >
          {neighborhoodCopy.searchCta}
        </Link>
        <Link
          href={routes.addListing}
          className={getButtonClassName({
            className: 'rounded-md px-5 font-bold',
          })}
        >
          {neighborhoodCopy.listCta}
        </Link>
      </div>
    </section>
  );
}
