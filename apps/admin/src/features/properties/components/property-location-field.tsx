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
import {
  listPropertyCompoundsAction,
  type CompoundSelectOption,
} from '../actions';
import { PropertyLocationMapPicker } from './property-location-map-picker';

export interface PropertyLocationValue {
  countryId: string;
  cityId: string;
  areaId: string;
  districtId: string;
  compoundId: string;
  /** Display-only labels (IDs remain source of truth). */
  countryName: string;
  cityName: string;
  areaName: string;
  districtName: string;
  compoundName: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface PropertyLocationFieldProps {
  value: PropertyLocationValue;
  onChange: (value: PropertyLocationValue) => void;
  disabled?: boolean;
  countryError?: string;
  cityError?: string;
  areaError?: string;
  latitudeError?: string;
  longitudeError?: string;
  title?: string;
}

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

function formatLocationLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function formatCompoundOptionLabel(compound: CompoundSelectOption): string {
  const name = compound.nameAr?.trim() || compound.nameEn;
  return compound.developerName ? `${name} — ${compound.developerName}` : name;
}

export function PropertyLocationField({
  value,
  onChange,
  disabled = false,
  countryError,
  cityError,
  areaError,
  latitudeError,
  longitudeError,
  title = 'الموقع',
}: PropertyLocationFieldProps) {
  const [loading, setLoading] = useState(false);
  const [compoundsLoading, setCompoundsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [compounds, setCompounds] = useState<CompoundSelectOption[]>([]);

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

  useEffect(() => {
    const areaId = value.areaId.trim();
    if (!areaId) {
      setCompounds([]);
      return;
    }

    let cancelled = false;

    async function loadCompounds() {
      setCompoundsLoading(true);
      const result = await listPropertyCompoundsAction(areaId);
      if (cancelled) {
        return;
      }
      if (result.ok) {
        setCompounds(result.items);
      } else {
        setCompounds([]);
        toast.error(getAdminErrorMessage(result.error));
      }
      setCompoundsLoading(false);
    }

    void loadCompounds();

    return () => {
      cancelled = true;
    };
  }, [value.areaId]);

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

  const compoundOptions = useMemo(
    () => [
      { value: '', label: 'بدون كمبوند' },
      ...compounds.map((compound) => ({
        value: compound.id,
        label: formatCompoundOptionLabel(compound),
      })),
    ],
    [compounds],
  );

  const selectedCompound = compounds.find(
    (compound) => compound.id === value.compoundId,
  );

  function patchLocation(patch: Partial<PropertyLocationValue>) {
    onChange({ ...value, ...patch });
  }

  async function handleCountryChange(countryId: string) {
    const country = countries.find((item) => item.id === countryId);
    patchLocation({
      countryId,
      countryName: country ? formatLocationLabel(country) : '',
      cityId: '',
      cityName: '',
      areaId: '',
      areaName: '',
      districtId: '',
      districtName: '',
      compoundId: '',
      compoundName: '',
    });
    setCities([]);
    setAreas([]);
    setDistricts([]);
    setCompounds([]);

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
    const city = cities.find((item) => item.id === cityId);
    patchLocation({
      cityId,
      cityName: city ? formatLocationLabel(city) : '',
      areaId: '',
      areaName: '',
      districtId: '',
      districtName: '',
      compoundId: '',
      compoundName: '',
    });
    setAreas([]);
    setDistricts([]);
    setCompounds([]);

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
    const area = areas.find((item) => item.id === areaId);
    patchLocation({
      areaId,
      areaName: area ? formatLocationLabel(area) : '',
      districtId: '',
      districtName: '',
      compoundId: '',
      compoundName: '',
    });
    setDistricts([]);
    setCompounds([]);

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

  const mapLat = Number.parseFloat(value.latitude);
  const mapLng = Number.parseFloat(value.longitude);
  const hasMapCoords =
    Number.isFinite(mapLat) && Number.isFinite(mapLng);

  const selectsDisabled = disabled || loading;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="countryId"
          label="الدولة"
          placeholder="اختر الدولة"
          options={countryOptions}
          value={value.countryId}
          disabled={selectsDisabled}
          error={countryError}
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
          error={cityError}
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
          label="الحي (اختياري)"
          placeholder="اختر الحي"
          options={districtOptions}
          value={value.districtId}
          disabled={selectsDisabled || !value.areaId}
          onChange={(event) => {
            const districtId = event.target.value;
            const district = districts.find((item) => item.id === districtId);
            patchLocation({
              districtId,
              districtName: district ? formatLocationLabel(district) : '',
            });
          }}
        />
        <div className="sm:col-span-2">
          <Select
            name="compoundId"
            label="الكمبوند (اختياري)"
            options={compoundOptions}
            value={value.compoundId}
            disabled={
              selectsDisabled || !value.areaId || compoundsLoading
            }
            onChange={(event) => {
              const compoundId = event.target.value;
              const compound = compounds.find((item) => item.id === compoundId);
              patchLocation({
                compoundId,
                compoundName: compound
                  ? compound.nameAr?.trim() || compound.nameEn
                  : '',
              });
            }}
          />
        </div>
      </div>

      {!value.areaId ? (
        <p className="text-xs text-ink-500">
          اختر المنطقة أولاً لعرض الكمبوندات.
        </p>
      ) : compoundsLoading ? (
        <p className="text-xs text-ink-500">جاري تحميل الكمبوندات…</p>
      ) : null}

      {selectedCompound ? (
        <p className="text-xs text-ink-600">
          {[
            selectedCompound.nameAr?.trim() || selectedCompound.nameEn,
            selectedCompound.developerName,
            selectedCompound.locationLabel,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      ) : null}

      <Input
        name="address"
        label="العنوان (اختياري)"
        placeholder="العنوان التفصيلي"
        value={value.address}
        disabled={disabled}
        onChange={(event) => patchLocation({ address: event.target.value })}
      />

      <PropertyLocationMapPicker
        latitude={hasMapCoords ? mapLat : DEFAULT_LAT}
        longitude={hasMapCoords ? mapLng : DEFAULT_LNG}
        disabled={disabled}
        onChange={({ latitude, longitude }) =>
          patchLocation({
            latitude: String(latitude),
            longitude: String(longitude),
          })
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="latitude"
          label="خط العرض (اختياري)"
          placeholder="30.0444"
          dir="ltr"
          className="text-start"
          value={value.latitude}
          disabled={disabled}
          error={latitudeError}
          onChange={(event) => patchLocation({ latitude: event.target.value })}
        />
        <Input
          name="longitude"
          label="خط الطول (اختياري)"
          placeholder="31.2357"
          dir="ltr"
          className="text-start"
          value={value.longitude}
          disabled={disabled}
          error={longitudeError}
          onChange={(event) => patchLocation({ longitude: event.target.value })}
        />
      </div>

      {loading ? (
        <p className={cn('text-xs text-ink-500')}>جاري تحميل بيانات المواقع…</p>
      ) : null}
    </div>
  );
}
