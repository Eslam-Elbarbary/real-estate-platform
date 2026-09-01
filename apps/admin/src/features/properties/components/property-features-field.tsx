'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CatalogFeature } from '../types';

interface PropertyFeaturesFieldProps {
  features: CatalogFeature[];
  value: string[];
  onChange: (featureIds: string[]) => void;
  disabled?: boolean;
}

function formatFeatureLabel(feature: CatalogFeature): string {
  return feature.nameAr ?? feature.nameEn;
}

export function PropertyFeaturesField({
  features,
  value,
  onChange,
  disabled = false,
}: PropertyFeaturesFieldProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogFeature[]>();

    for (const feature of features) {
      const category = feature.category?.trim() || 'أخرى';
      const list = map.get(category) ?? [];
      list.push(feature);
      map.set(category, list);
    }

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'ar'));
  }, [features]);

  function toggleFeature(featureId: string) {
    if (disabled) {
      return;
    }

    if (value.includes(featureId)) {
      onChange(value.filter((id) => id !== featureId));
      return;
    }

    onChange([...value, featureId]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">المميزات</h3>
        <p className="mt-1 text-xs text-ink-500">
          اختر المميزات المتاحة لهذا العقار.
        </p>
      </div>

      {features.length === 0 ? (
        <p className="text-sm text-ink-500">لا توجد مميزات متاحة حالياً.</p>
      ) : (
        <div className="space-y-4">
          {grouped.map(([category, items]) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((feature) => {
                  const selected = value.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        selected
                          ? 'border-accent-500 bg-accent-50 text-accent-800'
                          : 'border-border bg-white text-ink-700 hover:border-accent-300 hover:bg-surface-50',
                        disabled && 'cursor-not-allowed opacity-60',
                      )}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      {formatFeatureLabel(feature)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
