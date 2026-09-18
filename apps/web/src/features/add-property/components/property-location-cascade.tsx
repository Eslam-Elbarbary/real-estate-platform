'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import type { LocationTreeCountry } from '@/types/api/public-property';
import { listWebCompoundsByAreaAction } from '../actions';
import type { PropertyLocationInput } from '@repo/types';

export type WebCompoundOption = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  developerName: string | null;
  locationLabel: string | null;
};

export type PropertyLocationCascadeValue = PropertyLocationInput & {
  /** Display label built from hierarchy for previews */
  locationLabel?: string;
};

interface PropertyLocationCascadeProps {
  tree: LocationTreeCountry[];
  value: PropertyLocationCascadeValue;
  onChange: (value: PropertyLocationCascadeValue) => void;
  disabled?: boolean;
}

function labelOf(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr?.trim() || item.nameEn;
}

function buildLabel(
  tree: LocationTreeCountry[],
  value: PropertyLocationCascadeValue,
): string {
  const country = tree.find((c) => c.id === value.countryId);
  const city = country?.cities.find((c) => c.id === value.cityId);
  const area = city?.areas.find((a) => a.id === value.areaId);
  const district = area?.districts.find((d) => d.id === value.districtId);
  return [district, area, city, country]
    .filter(Boolean)
    .map((item) => labelOf(item!))
    .join(' · ');
}

export function PropertyLocationCascade({
  tree,
  value,
  onChange,
  disabled = false,
}: PropertyLocationCascadeProps) {
  const [compounds, setCompounds] = useState<WebCompoundOption[]>([]);
  const [compoundsPending, startCompoundsTransition] = useTransition();
  const [compoundsError, setCompoundsError] = useState<string | null>(null);

  const countries = tree;
  const cities = useMemo(() => {
    return countries.find((c) => c.id === value.countryId)?.cities ?? [];
  }, [countries, value.countryId]);
  const areas = useMemo(() => {
    return cities.find((c) => c.id === value.cityId)?.areas ?? [];
  }, [cities, value.cityId]);
  const districts = useMemo(() => {
    return areas.find((a) => a.id === value.areaId)?.districts ?? [];
  }, [areas, value.areaId]);

  useEffect(() => {
    if (!value.areaId) {
      setCompounds([]);
      setCompoundsError(null);
      return;
    }

    startCompoundsTransition(async () => {
      setCompoundsError(null);
      const result = await listWebCompoundsByAreaAction(value.areaId!);
      if (!result.ok) {
        setCompounds([]);
        setCompoundsError(result.error);
        return;
      }
      setCompounds(result.items);
    });
  }, [value.areaId]);

  function patch(patchValue: Partial<PropertyLocationCascadeValue>) {
    const next = { ...value, ...patchValue };
    next.locationLabel = buildLabel(tree, next);
    onChange(next);
  }

  const selectedCompound = compounds.find((c) => c.id === value.compoundId);

  const selectClass =
    'h-11 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-ink-800">الدولة</span>
          <select
            className={selectClass}
            disabled={disabled}
            value={value.countryId ?? ''}
            onChange={(event) =>
              patch({
                countryId: event.target.value,
                cityId: '',
                areaId: '',
                districtId: null,
                compoundId: null,
              })
            }
          >
            <option value="">اختر الدولة</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {labelOf(country)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-ink-800">المدينة</span>
          <select
            className={selectClass}
            disabled={disabled || !value.countryId}
            value={value.cityId ?? ''}
            onChange={(event) =>
              patch({
                cityId: event.target.value,
                areaId: '',
                districtId: null,
                compoundId: null,
              })
            }
          >
            <option value="">اختر المدينة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {labelOf(city)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-ink-800">المنطقة</span>
          <select
            className={selectClass}
            disabled={disabled || !value.cityId}
            value={value.areaId ?? ''}
            onChange={(event) =>
              patch({
                areaId: event.target.value,
                districtId: null,
                compoundId: null,
              })
            }
          >
            <option value="">اختر المنطقة</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {labelOf(area)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-ink-800">
            الحي <span className="font-normal text-ink-500">(اختياري)</span>
          </span>
          <select
            className={selectClass}
            disabled={disabled || !value.areaId}
            value={value.districtId ?? ''}
            onChange={(event) =>
              patch({
                districtId: event.target.value || null,
              })
            }
          >
            <option value="">بدون حي</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {labelOf(district)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-semibold text-ink-800">
            الكمبوند <span className="font-normal text-ink-500">(اختياري)</span>
          </span>
          <select
            className={selectClass}
            disabled={disabled || !value.areaId || compoundsPending}
            value={value.compoundId ?? ''}
            onChange={(event) =>
              patch({
                compoundId: event.target.value || null,
              })
            }
          >
            <option value="">بدون كمبوند</option>
            {compounds.map((compound) => (
              <option key={compound.id} value={compound.id}>
                {compound.nameAr?.trim() || compound.nameEn}
                {compound.developerName
                  ? ` — ${compound.developerName}`
                  : ''}
              </option>
            ))}
          </select>
          {compoundsPending ? (
            <span className="text-xs text-ink-500">جاري تحميل الكمبوندات…</span>
          ) : null}
          {compoundsError ? (
            <span className="text-xs text-danger-700">{compoundsError}</span>
          ) : null}
          {selectedCompound ? (
            <span className="block text-xs text-ink-600">
              {[
                selectedCompound.nameAr?.trim() || selectedCompound.nameEn,
                selectedCompound.developerName,
                selectedCompound.locationLabel,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-ink-800">
          العنوان <span className="font-normal text-ink-500">(اختياري)</span>
        </span>
        <input
          type="text"
          className={selectClass}
          disabled={disabled}
          value={value.address ?? ''}
          placeholder="العنوان التفصيلي"
          onChange={(event) => patch({ address: event.target.value })}
        />
      </label>
    </div>
  );
}

/** Resolve country/city from areaId using the location tree (resume helper). */
export function resolveHierarchyFromAreaId(
  tree: LocationTreeCountry[],
  areaId: string | null | undefined,
  districtId?: string | null,
): Pick<
  PropertyLocationCascadeValue,
  'countryId' | 'cityId' | 'areaId' | 'districtId' | 'locationLabel'
> {
  if (!areaId) {
    return {
      countryId: '',
      cityId: '',
      areaId: '',
      districtId: districtId ?? null,
      locationLabel: '',
    };
  }

  for (const country of tree) {
    for (const city of country.cities) {
      const area = city.areas.find((item) => item.id === areaId);
      if (!area) continue;
      const value: PropertyLocationCascadeValue = {
        countryId: country.id,
        cityId: city.id,
        areaId: area.id,
        districtId: districtId ?? null,
      };
      return {
        countryId: country.id,
        cityId: city.id,
        areaId: area.id,
        districtId: districtId ?? null,
        locationLabel: buildLabel(tree, value),
      };
    }
  }

  return {
    countryId: '',
    cityId: '',
    areaId,
    districtId: districtId ?? null,
    locationLabel: '',
  };
}
