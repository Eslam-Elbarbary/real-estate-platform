import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { getPropertyTypeLabel } from '@/config/property-types';
import { cn } from '@/lib/utils/cn';
import { neighborhoodCopy } from '../config';
import {
  annualChangeDirection,
  annualChangeLabel,
  formatAnnualChangePercent,
} from '../lib/format';
import type { NeighborhoodAnnualChange } from '../types';

interface NeighborhoodAnnualChangeProps {
  name: string;
  change: NeighborhoodAnnualChange;
}

export function NeighborhoodAnnualChangeCard({
  name,
  change,
}: NeighborhoodAnnualChangeProps) {
  const direction = annualChangeDirection(change.valuePercent);
  const typeLabel = change.propertyType
    ? getPropertyTypeLabel(change.propertyType)
    : null;

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.statsPrefix} {name}
        {typeLabel ? ` - ${typeLabel}` : ''}
      </h2>
      <div className="mt-4 max-w-md rounded-lg border border-[#e8e8e8] bg-white px-6 py-5 shadow-sm">
        <p
          className={cn(
            'flex items-center gap-2 text-3xl font-extrabold',
            direction === 'up' && 'text-brand-700',
            direction === 'down' && 'text-danger-700',
            direction === 'flat' && 'text-ink-700',
          )}
        >
          {direction === 'up' ? (
            <ArrowUpRight className="size-7" aria-hidden />
          ) : direction === 'down' ? (
            <ArrowDownRight className="size-7" aria-hidden />
          ) : (
            <Minus className="size-7" aria-hidden />
          )}
          <span>{formatAnnualChangePercent(change.valuePercent)}</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-ink-600">
          {annualChangeLabel(change)}
          <span className="sr-only">
            {direction === 'up'
              ? ' ارتفاع'
              : direction === 'down'
                ? ' انخفاض'
                : ' استقرار'}
          </span>
        </p>
      </div>
    </section>
  );
}
