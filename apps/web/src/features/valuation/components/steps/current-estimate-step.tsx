'use client';

import { Info } from 'lucide-react';
import { valuationCopy } from '../../config';
import type { ValuationStepContext } from '../../wizard/steps';
import { uiLabels } from '@/config/labels';

export function CurrentEstimateStep({ draft, setDraft }: ValuationStepContext) {
  return (
    <div>
      <label
        htmlFor="current-estimate"
        className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800"
      >
        {valuationCopy.currentEstimateLabel}
        <Info size={14} className="text-ink-400" aria-hidden />
      </label>
      <div className="relative">
        <input
          id="current-estimate"
          type="number"
          min={1}
          inputMode="numeric"
          value={draft.currentOwnerEstimate ?? ''}
          onChange={(event) => {
            const next = Number(event.target.value);
            setDraft({
              currentOwnerEstimate:
                Number.isFinite(next) && next > 0 ? next : undefined,
            });
          }}
          placeholder="اكتب السعر التقريبي"
          className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-28 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-xs font-semibold text-ink-500">
          {uiLabels.currencyFull}
        </span>
      </div>
    </div>
  );
}
