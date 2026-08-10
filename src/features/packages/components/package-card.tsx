'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import type { CreditPackage } from '@/features/credits/types';
import { commercialRoleLabels, packagePageCopy } from '../config/catalog';
import { cn } from '@/lib/utils/cn';
import { PackagePurchaseModal } from './package-purchase-modal';

interface PackageCardProps {
  pkg: CreditPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const [open, setOpen] = useState(false);
  const highlighted = Boolean(pkg.highlighted);

  return (
    <>
      <article
        className={cn(
          'relative flex h-full flex-col rounded-2xl border bg-white p-6 pt-8 shadow-sm sm:p-7 sm:pt-9',
          highlighted
            ? 'border-accent-500 border-2 shadow-md'
            : 'border-[#e5e5e5]',
        )}
      >
        {pkg.badge ? (
          <span
            className={cn(
              'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold',
              highlighted
                ? 'bg-accent-500 text-ink-950'
                : 'bg-brand-600 text-white',
            )}
          >
            {pkg.badge}
          </span>
        ) : null}

        <p className="mt-2 text-center text-3xl font-extrabold text-ink-950">
          {pkg.priceEgp.toLocaleString('en-US')}{' '}
          <span className="text-lg font-bold">{packagePageCopy.priceSuffix}</span>
        </p>

        <ul className="mt-6 flex-1 space-y-3">
          {pkg.features.map((feature) => {
            const included = feature.included === true;
            const excluded = feature.included === false;
            return (
              <li
                key={feature.key}
                className="flex items-start gap-2 text-sm leading-6 text-ink-800"
              >
                <span
                  className={cn(
                    'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full',
                    included
                      ? 'bg-brand-50 text-brand-700'
                      : excluded
                        ? 'bg-danger-50 text-danger-600'
                        : 'bg-surface-100 text-ink-400',
                  )}
                  aria-hidden
                >
                  {included ? (
                    <Check size={12} strokeWidth={3} />
                  ) : (
                    <X size={12} strokeWidth={3} />
                  )}
                </span>
                <span>
                  {feature.label}
                  {feature.value != null ? (
                    <span className="font-semibold"> : {feature.value}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={getButtonClassName({
            variant: highlighted ? 'accent' : 'primary',
            className: 'mt-6 h-11 w-full rounded-lg font-bold',
          })}
          data-testid={`subscribe-${pkg.id}`}
        >
          {packagePageCopy.subscribe}
        </button>
      </article>

      <PackagePurchaseModal
        open={open}
        onClose={() => setOpen(false)}
        pkg={pkg}
        audienceLabel={commercialRoleLabels[pkg.audience]}
      />
    </>
  );
}

interface PackageGridProps {
  packages: CreditPackage[];
}

export function PackageGrid({ packages }: PackageGridProps) {
  if (packages.length === 0) return null;

  const columns =
    packages.length === 1
      ? 'mx-auto max-w-md grid-cols-1'
      : packages.length === 2
        ? 'mx-auto max-w-3xl grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={cn('grid gap-6', columns)}>
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
