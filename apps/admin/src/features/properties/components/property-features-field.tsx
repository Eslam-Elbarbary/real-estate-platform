'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Check,
  Dumbbell,
  Fence,
  Package,
  ParkingCircle,
  Shield,
  Snowflake,
  Sparkles,
  Trees,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import type { CatalogFeature } from '../types';

interface PropertyFeaturesFieldProps {
  features: CatalogFeature[];
  value: string[];
  onChange: (featureIds: string[]) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
  /** Feature codes to highlight/sort first — never auto-selected. */
  recommendedFeatureCodes?: readonly string[];
}

const FEATURE_ICON_BY_CODE: Record<string, LucideIcon> = {
  POOL: Waves,
  PARKING: ParkingCircle,
  ELEVATOR: ArrowUpDown,
  GARDEN: Trees,
  SECURITY: Shield,
  AC: Snowflake,
  BALCONY: Fence,
  GYM: Dumbbell,
  STORAGE: Package,
};

const CATEGORY_LABELS: Record<string, string> = {
  amenities: 'أساسية',
  amenity: 'أساسية',
  indoor: 'داخلية',
  outdoor: 'خارجية',
  أساسية: 'أساسية',
  داخلية: 'داخلية',
  خارجية: 'خارجية',
};

function formatFeatureLabel(feature: CatalogFeature): string {
  return feature.nameAr?.trim() || feature.nameEn;
}

function categoryKey(raw: string | null | undefined): string {
  return (raw?.trim() || 'أخرى').toLowerCase();
}

function categoryLabel(raw: string | null | undefined): string {
  const key = categoryKey(raw);
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  // Title-case leftovers from older admin forms
  const titled = raw?.trim() || 'أخرى';
  const lower = titled.toLowerCase();
  if (CATEGORY_LABELS[lower]) return CATEGORY_LABELS[lower];
  return titled;
}

function matchesSearch(feature: CatalogFeature, query: string): boolean {
  if (!query) return true;
  const haystack = [feature.nameAr ?? '', feature.nameEn, feature.code]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

function featureIcon(feature: CatalogFeature): LucideIcon {
  return FEATURE_ICON_BY_CODE[feature.code.toUpperCase()] ?? Sparkles;
}

export function PropertyFeaturesField({
  features,
  value,
  onChange,
  disabled = false,
  title = 'المميزات',
  description = 'اختر المميزات التي تنطبق على هذا العقار',
  recommendedFeatureCodes = [],
}: PropertyFeaturesFieldProps) {
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const recommendedSet = useMemo(
    () =>
      new Set(
        recommendedFeatureCodes.map((code) => code.trim().toUpperCase()),
      ),
    [recommendedFeatureCodes],
  );

  const selectedCount = value.length;

  const recommendedFeatures = useMemo(() => {
    if (recommendedSet.size === 0) return [];
    return features
      .filter((feature) => recommendedSet.has(feature.code.toUpperCase()))
      .filter((feature) => matchesSearch(feature, normalizedSearch))
      .sort((a, b) =>
        formatFeatureLabel(a).localeCompare(formatFeatureLabel(b), 'ar'),
      );
  }, [features, recommendedSet, normalizedSearch]);

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogFeature[]>();

    for (const feature of features) {
      if (!matchesSearch(feature, normalizedSearch)) continue;
      // Recommended section already shows these when searching empty;
      // keep them in categories too so full catalog remains browsable.
      const label = categoryLabel(feature.category);
      const list = map.get(label) ?? [];
      list.push(feature);
      map.set(label, list);
    }

    for (const [, list] of map) {
      list.sort((a, b) => {
        const aRec = recommendedSet.has(a.code.toUpperCase()) ? 0 : 1;
        const bRec = recommendedSet.has(b.code.toUpperCase()) ? 0 : 1;
        if (aRec !== bRec) return aRec - bRec;
        return formatFeatureLabel(a).localeCompare(
          formatFeatureLabel(b),
          'ar',
        );
      });
    }

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'ar'));
  }, [features, normalizedSearch, recommendedSet]);

  function toggleFeature(featureId: string) {
    if (disabled) return;
    if (value.includes(featureId)) {
      onChange(value.filter((id) => id !== featureId));
      return;
    }
    onChange([...value, featureId]);
  }

  function clearSelection() {
    if (disabled || value.length === 0) return;
    onChange([]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-ink-900">{title}</h3>
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-surface-100 px-2.5 py-1 text-xs font-bold text-ink-700">
            تم اختيار {selectedCount.toLocaleString('ar-EG')} مميزات
          </span>
          {selectedCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="small"
              disabled={disabled}
              onClick={clearSelection}
            >
              مسح الكل
            </Button>
          ) : null}
        </div>
      </div>

      {features.length === 0 ? (
        <p className="text-sm text-ink-500">لا توجد مميزات متاحة حالياً.</p>
      ) : (
        <div className="space-y-5">
          <Input
            name="featureSearch"
            label="بحث في المميزات"
            placeholder="ابحث بالاسم العربي أو الإنجليزي أو الرمز…"
            value={search}
            disabled={disabled}
            onChange={(event) => setSearch(event.target.value)}
          />

          {recommendedFeatures.length > 0 && !normalizedSearch ? (
            <FeatureSection
              title="مميزات مقترحة"
              features={recommendedFeatures}
              value={value}
              disabled={disabled}
              recommendedSet={recommendedSet}
              onToggle={toggleFeature}
            />
          ) : null}

          {grouped.length === 0 ? (
            <p className="text-sm text-ink-500">لا توجد نتائج مطابقة للبحث.</p>
          ) : (
            grouped.map(([category, items]) => (
              <FeatureSection
                key={category}
                title={category}
                features={items}
                value={value}
                disabled={disabled}
                recommendedSet={recommendedSet}
                onToggle={toggleFeature}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FeatureSection({
  title,
  features,
  value,
  disabled,
  recommendedSet,
  onToggle,
}: {
  title: string;
  features: CatalogFeature[];
  value: string[];
  disabled: boolean;
  recommendedSet: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-extrabold text-ink-800">{title}</h4>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature) => {
          const selected = value.includes(feature.id);
          const recommended = recommendedSet.has(feature.code.toUpperCase());
          const Icon = featureIcon(feature);
          return (
            <button
              key={feature.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onToggle(feature.id)}
              className={cn(
                'relative flex min-h-[96px] flex-col items-start gap-2 rounded-xl border p-3 text-start transition-colors',
                selected
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : 'border-border bg-white hover:border-brand-300 hover:bg-surface-50',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              {selected ? (
                <span className="absolute end-2 top-2 inline-flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
              ) : null}
              <Icon
                className={cn(
                  'size-5',
                  selected ? 'text-brand-700' : 'text-ink-500',
                )}
                aria-hidden
              />
              <span className="text-sm font-bold text-ink-900">
                {formatFeatureLabel(feature)}
              </span>
              {feature.nameAr?.trim() && feature.nameEn ? (
                <span className="text-[11px] font-medium text-ink-500" dir="ltr">
                  {feature.nameEn}
                </span>
              ) : null}
              {recommended ? (
                <span className="text-[11px] font-bold text-brand-700">
                  موصى به
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
