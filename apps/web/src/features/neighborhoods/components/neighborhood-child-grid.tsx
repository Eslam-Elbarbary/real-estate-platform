import Image from 'next/image';
import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { neighborhoodCopy } from '../config';
import { formatPricePerSqm } from '../lib/format';
import type { NeighborhoodChildSummary } from '../types';

interface NeighborhoodChildGridProps {
  items: NeighborhoodChildSummary[];
  className?: string;
}

export function NeighborhoodChildGrid({
  items,
  className,
}: NeighborhoodChildGridProps) {
  if (!items.length) return null;

  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item) => {
        const href = routes.neighborhood.details(...item.pathSegments);
        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-lg border border-[#e8e8e8] bg-white shadow-sm"
          >
            <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <div className="relative aspect-[16/10] bg-surface-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.nameAr}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
              </div>
            </Link>
            <div className="flex items-end justify-between gap-3 p-4">
              <div>
                <h3 className="text-base font-extrabold text-ink-950">{item.nameAr}</h3>
                {item.averageSalePricePerSqm != null ? (
                  <>
                    <p className="mt-1 text-lg font-extrabold text-accent-600">
                      {formatPricePerSqm(item.averageSalePricePerSqm)}
                    </p>
                    <p className="text-xs font-semibold text-ink-500">
                      {neighborhoodCopy.pricePerSqm}
                    </p>
                  </>
                ) : null}
              </div>
              <Link
                href={href}
                className={getButtonClassName({
                  size: 'small',
                  className: 'shrink-0 rounded-md px-4 font-bold',
                })}
              >
                {neighborhoodCopy.detailsCta}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
