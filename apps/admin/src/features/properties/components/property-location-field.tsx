'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  getAdminAreas,
  getAdminCities,
  getAdminCountries,
  getAdminDistricts,
} from '@/features/locations';
import type { Area, City, Country, District } from '@/features/locations';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';

export interface PropertyLocationValue {
  countryId: string;
  cityId: string;
  areaId: string;
  districtId: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface PropertyLocationFieldProps {
  value: PropertyLocationValue;
  onChange: (value: PropertyLocationValue) => void;
  disabled?: boolean;
  areaError?: string;
}

function formatLocationLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

export function PropertyLocationField({
  value,
  onChange,
  disabled = false,
  areaError,
}: PropertyLocationFieldProps) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

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

        if (value.areaId) {
          const districtList = await getAdminDistricts(value.areaId);
          if (cancelled) {
            return;
          }
          setDistricts(districtList);
        }
      } catch {
        if (!cancelled) {
          toast.error(getAdminErrorMessage('تعذر تحميل بيانات المواقع.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap once on mount with initial ids
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

  const districtOptions = useMemo(
    () =>
      districts.map((district) => ({
        value: district.id,
        label: formatLocationLabel(district),
      })),
    [districts],
  );

  function patchLocation(patch: Partial<PropertyLocationValue>) {
    onChange({ ...value, ...patch });
  }

  async function handleCountryChange(countryId: string) {
    patchLocation({
      countryId,
      cityId: '',
      areaId: '',
      districtId: '',
    });
    setCities([]);
    setAreas([]);
    setDistricts([]);

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
    patchLocation({
      cityId,
      areaId: '',
      districtId: '',
    });
    setAreas([]);
    setDistricts([]);

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

  async function handleAreaChange(areaId: string) {
    patchLocation({
      areaId,
      districtId: '',
    });
    setDistricts([]);

    if (!areaId) {
      return;
    }

    setLoading(true);
    try {
      setDistricts(await getAdminDistricts(areaId));
    } catch {
      toast.error(getAdminErrorMessage('تعذر تحميل قائمة الأحياء.'));
    } finally {
      setLoading(false);
    }
  }

  const selectsDisabled = disabled || loading;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-ink-900">الموقع</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="countryId"
          label="الدولة"
          placeholder="اختر الدولة"
          options={countryOptions}
          value={value.countryId}
          disabled={selectsDisabled}
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
          onChange={(event) => {
            void handleAreaChange(event.target.value);
          }}
        />
        <Select
          name="districtId"
          label="الحي"
          placeholder="اختر الحي (اختياري)"
          options={districtOptions}
          value={value.districtId}
          disabled={selectsDisabled || !value.areaId}
          onChange={(event) => patchLocation({ districtId: event.target.value })}
        />
      </div>

      <Input
        name="address"
        label="العنوان"
        placeholder="العنوان التفصيلي"
        value={value.address}
        disabled={disabled}
        onChange={(event) => patchLocation({ address: event.target.value })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="latitude"
          label="خط العرض"
          placeholder="30.0444"
          dir="ltr"
          className="text-start"
          value={value.latitude}
          disabled={disabled}
          onChange={(event) => patchLocation({ latitude: event.target.value })}
        />
        <Input
          name="longitude"
          label="خط الطول"
          placeholder="31.2357"
          dir="ltr"
          className="text-start"
          value={value.longitude}
          disabled={disabled}
          onChange={(event) => patchLocation({ longitude: event.target.value })}
        />
      </div>

      {loading ? (
        <p className={cn('text-xs text-ink-500')}>جاري تحميل بيانات المواقع…</p>
      ) : null}
    </div>
  );
}
