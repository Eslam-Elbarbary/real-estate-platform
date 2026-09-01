'use client';

import { useEffect, useMemo, useState } from 'react';
import { Select } from '@/components/ui/select';
import {
  getAdminAreas,
  getAdminCities,
  getAdminCountries,
  getLocationTree,
} from '@/features/locations';
import type { Area, City, Country, LocationTreeNode } from '@/features/locations';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';

export interface CompoundLocationValue {
  countryId: string;
  cityId: string;
  areaId: string;
}

interface CompoundLocationFieldProps {
  value: CompoundLocationValue;
  onChange: (value: CompoundLocationValue) => void;
  disabled?: boolean;
  areaError?: string;
}

function formatLocationLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function findLocationPath(
  tree: LocationTreeNode[],
  areaId: string,
): {
  countryId: string;
  cityId: string;
  areaId: string;
} | null {
  for (const country of tree) {
    for (const city of country.cities) {
      for (const area of city.areas) {
        if (area.id === areaId) {
          return {
            countryId: country.id,
            cityId: city.id,
            areaId: area.id,
          };
        }
      }
    }
  }
  return null;
}

export function CompoundLocationField({
  value,
  onChange,
  disabled = false,
  areaError,
}: CompoundLocationFieldProps) {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      try {
        const countryList = await getAdminCountries();
        if (cancelled) {
          return;
        }
        setCountries(countryList);

        if (value.areaId && !value.countryId) {
          const tree = await getLocationTree();
          if (cancelled) {
            return;
          }
          const path = findLocationPath(tree, value.areaId);
          if (path) {
            const cityList = path.countryId
              ? await getAdminCities(path.countryId)
              : [];
            const areaList = path.cityId ? await getAdminAreas(path.cityId) : [];
            if (!cancelled) {
              setCities(cityList);
              setAreas(areaList);
              onChange(path);
            }
          }
        } else {
          if (value.countryId) {
            const cityList = await getAdminCities(value.countryId);
            if (cancelled) {
              return;
            }
            setCities(cityList);
          }
          if (value.cityId) {
            const areaList = await getAdminAreas(value.cityId);
            if (cancelled) {
              return;
            }
            setAreas(areaList);
          }
        }
      } catch {
        if (!cancelled) {
          toast.error(getAdminErrorMessage('تعذر تحميل بيانات المواقع.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap once on mount
  }, []);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.id,
        label: formatLocationLabel(country),
      })),
    [countries],
  );

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id,
        label: formatLocationLabel(city),
      })),
    [cities],
  );

  const areaOptions = useMemo(
    () =>
      areas.map((area) => ({
        value: area.id,
        label: formatLocationLabel(area),
      })),
    [areas],
  );

  function patchLocation(patch: Partial<CompoundLocationValue>) {
    onChange({ ...value, ...patch });
  }

  async function handleCountryChange(countryId: string) {
    patchLocation({ countryId, cityId: '', areaId: '' });
    setCities([]);
    setAreas([]);

    if (!countryId) {
      return;
    }

    setLoading(true);
    try {
      setCities(await getAdminCities(countryId));
    } catch {
      toast.error(getAdminErrorMessage('تعذر تحميل قائمة المدن.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCityChange(cityId: string) {
    patchLocation({ cityId, areaId: '' });
    setAreas([]);

    if (!cityId) {
      return;
    }

    setLoading(true);
    try {
      setAreas(await getAdminAreas(cityId));
    } catch {
      toast.error(getAdminErrorMessage('تعذر تحميل قائمة المناطق.'));
    } finally {
      setLoading(false);
    }
  }

  const selectsDisabled = disabled || loading;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">الموقع</h3>
        <p className="mt-1 text-xs text-ink-500">اختر المنطقة التي يقع فيها المشروع.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="countryId"
          label="الدولة"
          placeholder="اختر الدولة"
          options={countryOptions}
          value={value.countryId}
          disabled={selectsDisabled || !initialized}
          onChange={(event) => {
            void handleCountryChange(event.target.value);
          }}
        />
        <Select
          name="cityId"
          label="المدينة"
          placeholder="اختر المدينة"
          options={cityOptions}
          value={value.cityId}
          disabled={selectsDisabled || !value.countryId}
          onChange={(event) => {
            void handleCityChange(event.target.value);
          }}
        />
        <Select
          name="areaId"
          label="المنطقة"
          placeholder="اختر المنطقة"
          options={areaOptions}
          value={value.areaId}
          disabled={selectsDisabled || !value.cityId}
          error={areaError}
          onChange={(event) => patchLocation({ areaId: event.target.value })}
        />
      </div>

      {loading ? (
        <p className={cn('text-xs text-ink-500')}>جاري تحميل بيانات المواقع…</p>
      ) : null}
    </div>
  );
}
