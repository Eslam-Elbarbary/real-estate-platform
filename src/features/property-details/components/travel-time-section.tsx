'use client';

import { useState } from 'react';
import { Car, Footprints, MapPinned } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

type TravelMode = 'car' | 'walk';

export function TravelTimeSection() {
  const [mode, setMode] = useState<TravelMode>('car');
  const [origin, setOrigin] = useState('');

  return (
    <section className="pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.travelTimeTitle}
      </h2>

      <div className="mt-5 rounded-xl border border-border bg-surface-50 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setMode('car')}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold',
              mode === 'car'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-ink-700 ring-1 ring-border',
            )}
          >
            <Car className="size-4" aria-hidden />
            {uiLabels.travelModeCar}
          </button>
          <button
            type="button"
            onClick={() => setMode('walk')}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold',
              mode === 'walk'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-ink-700 ring-1 ring-border',
            )}
          >
            <Footprints className="size-4" aria-hidden />
            {uiLabels.travelModeWalk}
          </button>
        </div>

        <label className="mt-5 block max-w-xl">
          <span className="sr-only">{uiLabels.travelOriginPlaceholder}</span>
          <span className="relative block">
            <MapPinned
              className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-ink-500"
              aria-hidden
            />
            <input
              type="text"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder={uiLabels.travelOriginPlaceholder}
              className="h-11 w-full rounded-md border border-border bg-white pe-3 ps-10 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </span>
        </label>

        <p className="mt-3 text-sm text-ink-600">{uiLabels.travelPlaceholderHint}</p>
      </div>
    </section>
  );
}
