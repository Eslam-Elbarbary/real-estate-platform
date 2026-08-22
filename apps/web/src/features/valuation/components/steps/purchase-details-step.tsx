'use client';

import { valuationCopy } from '../../config';
import type { ValuationStepContext } from '../../wizard/steps';
import { uiLabels } from '@/config/labels';

export function PurchaseDetailsStep({ draft, setDraft }: ValuationStepContext) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-ink-950">تفاصيل الشراء</h2>

      <div>
        <label
          htmlFor="purchase-price"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {valuationCopy.purchasePriceLabel}
        </label>
        <div className="relative">
          <input
            id="purchase-price"
            type="number"
            min={1}
            inputMode="numeric"
            value={draft.purchasePrice ?? ''}
            onChange={(event) => {
              const next = Number(event.target.value);
              setDraft({
                purchasePrice: Number.isFinite(next) && next > 0 ? next : undefined,
              });
            }}
            placeholder="اكتب سعر الشراء"
            className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-28 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-xs font-semibold text-ink-500">
            {uiLabels.currencyFull}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="purchase-date"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {valuationCopy.purchaseDateLabel}
        </label>
        <input
          id="purchase-date"
          type="month"
          value={draft.purchaseDate ?? ''}
          onChange={(event) =>
            setDraft({ purchaseDate: event.target.value || undefined })
          }
          className="h-12 w-full max-w-xs rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
    </div>
  );
}
