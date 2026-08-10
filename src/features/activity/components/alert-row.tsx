'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPropertyTypeLabel } from '@/config/property-types';
import { uiLabels } from '@/config/labels';
import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import { setAlertEnabledAction } from '../actions';
import { activityCopy } from '../copy';
import type { PropertyAlert } from '../types';

interface AlertRowProps {
  alert: PropertyAlert;
  zebra: boolean;
}

export function AlertRow({ alert, zebra }: AlertRowProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(alert.enabled);
  const [pending, startTransition] = useTransition();
  const href = buildPropertySearchPath({
    transactionType: alert.transaction,
    propertyType: alert.propertyType,
    locationSlugs: alert.locations[0] ? [alert.locations[0].slug] : undefined,
    minPrice: alert.minPrice,
    maxPrice: alert.maxPrice,
    minArea: alert.minArea,
    maxArea: alert.maxArea,
  });

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      await setAlertEnabledAction(alert.id, next);
      router.refresh();
    });
  }

  return (
    <tr className={cn(zebra ? 'bg-[#fafafa]' : 'bg-white')}>
      <td className="px-3 py-3 font-semibold text-ink-900">
        <Link
          href={href}
          className="hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {alert.locations.map((location) => location.label).join('، ')}
        </Link>
      </td>
      <td className="px-3 py-3 text-ink-700">
        {getPropertyTypeLabel(alert.propertyType)}
      </td>
      <td className="px-3 py-3 text-ink-700">
        {alert.transaction === 'sale' ? uiLabels.buy : uiLabels.rent}
      </td>
      <td className="px-3 py-3 text-ink-700">
        {alert.minPrice != null ? formatCurrency(alert.minPrice) : '—'}
      </td>
      <td className="px-3 py-3 text-ink-700">
        {alert.maxPrice != null ? formatCurrency(alert.maxPrice) : '—'}
      </td>
      <td className="px-3 py-3 text-center">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={
            enabled ? activityCopy.alerts.enabled : activityCopy.alerts.disabled
          }
          disabled={pending}
          onClick={toggle}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            enabled ? 'bg-brand-600' : 'bg-[#cfcfcf]',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start]',
              enabled ? 'inset-inline-start-[1.35rem]' : 'inset-inline-start-0.5',
            )}
          />
        </button>
      </td>
    </tr>
  );
}
