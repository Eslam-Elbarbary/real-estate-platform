'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { formatArea } from '@/lib/formatting/area';
import { formatCurrency } from '@/lib/formatting/currency';
import type { CompoundUnitsView } from '@/types';
import { cn } from '@/lib/utils/cn';
import type {
  CompoundUnitInventory,
  CompoundUnitListingGroup,
} from '@/features/compounds';
import {
  parseCompoundUnitsView,
  pickDefaultCompoundUnitsView,
} from '../lib/units-view';

interface CompoundUnitsSectionProps {
  inventory: CompoundUnitInventory;
  className?: string;
}

const INITIAL_VISIBLE = 5;

const VIEW_LABELS: Record<CompoundUnitsView, string> = {
  'developer-sale': uiLabels.compoundDetailsUnitsDeveloper,
  'advertiser-sale': uiLabels.compoundDetailsUnitsAdvertiserSale,
  'advertiser-rent': uiLabels.compoundDetailsUnitsAdvertiserRent,
};

function UnitGroupBlock({ group }: { group: CompoundUnitListingGroup }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? group.units
    : group.units.slice(0, INITIAL_VISIBLE);
  const hasMore = group.units.length > INITIAL_VISIBLE;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-surface-50 px-3.5 py-2.5 text-[13px] font-bold text-ink-900">
        {group.label}
      </div>
      <ul>
        {visible.map((unit) => (
          <li key={unit.propertyId}>
            <Link
              href={routes.listing(unit.propertyId, unit.slug)}
              className="group flex min-h-[52px] items-center gap-3 border-b border-border px-3.5 py-3 text-[13px] last:border-b-0 hover:bg-surface-50"
            >
              <span className="min-w-0 flex-1 font-medium text-ink-800">
                {formatArea(unit.area)}
              </span>
              <span className="shrink-0 font-semibold text-ink-950">
                {formatCurrency(
                  unit.price,
                  unit.currency,
                  unit.pricingPeriod,
                )}
              </span>
              <ChevronLeft
                className="size-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-[-2px] group-hover:text-brand-600"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full border-t border-border py-2.5 text-[13px] font-semibold text-brand-700 hover:bg-brand-50/40"
        >
          {uiLabels.compoundDetailsUnitsMore}
        </button>
      ) : null}
    </div>
  );
}

export function CompoundUnitsSection({
  inventory,
  className,
}: CompoundUnitsSectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = parseCompoundUnitsView(searchParams.get('units'));
  const available = inventory.availableViews;

  const activeView =
    (requested && available.includes(requested) ? requested : null) ??
    inventory.defaultView ??
    pickDefaultCompoundUnitsView(available);

  const filtered = useMemo(
    () =>
      activeView
        ? inventory.groups.filter((group) => group.view === activeView)
        : [],
    [inventory.groups, activeView],
  );

  function hrefFor(view: CompoundUnitsView) {
    const params = new URLSearchParams(searchParams.toString());
    if (view === inventory.defaultView) {
      params.delete('units');
    } else {
      params.set('units', view);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  if (!available.length || !activeView) {
    return null;
  }

  const showTabs = available.length > 1;

  return (
    <section id="units" className={cn('scroll-mt-24', className)}>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {uiLabels.compoundDetailsUnitsTitle}
      </h2>

      {showTabs ? (
        <div className="mt-3 inline-flex w-full max-w-xl rounded-lg border border-border bg-white p-1 sm:w-auto">
          {available.map((view) => (
            <Link
              key={view}
              href={hrefFor(view)}
              scroll={false}
              className={cn(
                'flex-1 rounded-md px-3 py-2 text-center text-[12px] font-semibold transition sm:flex-none sm:px-3.5 sm:text-[13px]',
                activeView === view
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-white text-ink-600 hover:bg-surface-50',
              )}
            >
              {VIEW_LABELS[view]}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[13px] font-semibold text-ink-600">
          {VIEW_LABELS[activeView]}
        </p>
      )}

      <div className="mt-4 space-y-4">
        {filtered.length ? (
          filtered.map((group) => (
            <UnitGroupBlock key={group.id} group={group} />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-ink-500">
            لا توجد وحدات معروضة في هذا المصدر حاليًا.
          </p>
        )}
      </div>
    </section>
  );
}
