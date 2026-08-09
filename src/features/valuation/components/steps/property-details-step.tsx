'use client';

import {
  valuationCopy,
  valuationFinishingOptions,
  valuationPropertyTypeOptions,
  valuationViewOptions,
} from '../../config';
import { NumberStepper } from '../number-stepper';
import type { ValuationStepContext } from '../../wizard/steps';
import { cn } from '@/lib/utils/cn';

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value?: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-800">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                selected
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-border bg-white text-ink-700 hover:border-brand-200',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PropertyDetailsStep({ draft, setDraft }: ValuationStepContext) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.detailsTitle}
      </h2>

      <ChipGroup
        label={valuationCopy.propertyTypeLabel}
        options={valuationPropertyTypeOptions}
        value={draft.propertyType}
        onChange={(propertyType) => setDraft({ propertyType })}
      />

      <ChipGroup
        label={valuationCopy.viewLabel}
        options={valuationViewOptions}
        value={draft.view}
        onChange={(view) => setDraft({ view })}
      />

      <ChipGroup
        label={valuationCopy.finishingLabel}
        options={valuationFinishingOptions}
        value={draft.finishing}
        onChange={(finishing) => setDraft({ finishing })}
      />

      <div>
        <label
          htmlFor="valuation-area"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {valuationCopy.areaLabel}
        </label>
        <div className="relative max-w-xs">
          <input
            id="valuation-area"
            type="number"
            min={10}
            inputMode="decimal"
            value={draft.area ?? ''}
            onChange={(event) => {
              const next = Number(event.target.value);
              setDraft({ area: Number.isFinite(next) && next > 0 ? next : undefined });
            }}
            className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-14 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="مثال: 150"
          />
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-xs font-semibold text-ink-500">
            متر²
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <NumberStepper
          id="valuation-bedrooms"
          label={valuationCopy.bedroomsLabel}
          value={draft.bedrooms ?? 0}
          onChange={(bedrooms) => setDraft({ bedrooms })}
        />
        <NumberStepper
          id="valuation-bathrooms"
          label={valuationCopy.bathroomsLabel}
          value={draft.bathrooms ?? 0}
          onChange={(bathrooms) => setDraft({ bathrooms })}
        />
      </div>
    </div>
  );
}
