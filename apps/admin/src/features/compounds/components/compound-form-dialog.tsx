'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Developer } from '@/features/developers/types';
import {
  getAdminAreas,
  getAdminCities,
  getAdminCountries,
  getLocationTree,
} from '@/features/locations';
import type { Area, City, Country, LocationTreeNode } from '@/features/locations';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';
import { createCompoundAction, updateCompoundAction } from '../actions';
import type { Compound } from '../types';

interface CompoundFormState {
  slug: string;
  nameEn: string;
  nameAr: string;
  description: string;
  developerId: string;
  countryId: string;
  cityId: string;
  areaId: string;
  latitude: string;
  longitude: string;
  coverUrl: string;
  isActive: boolean;
}

interface CompoundFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compound?: Compound | null;
  developers: Developer[];
  roles: UserRole[];
  onSuccess: () => void;
}

const EMPTY_FORM: CompoundFormState = {
  slug: '',
  nameEn: '',
  nameAr: '',
  description: '',
  developerId: '',
  countryId: '',
  cityId: '',
  areaId: '',
  latitude: '',
  longitude: '',
  coverUrl: '',
  isActive: true,
};

function formatLocationLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function findLocationPath(
  tree: LocationTreeNode[],
  areaId: string,
): {
  country: LocationTreeNode;
  city: LocationTreeNode['cities'][number];
  area: LocationTreeNode['cities'][number]['areas'][number];
} | null {
  for (const country of tree) {
    for (const city of country.cities) {
      for (const area of city.areas) {
        if (area.id === areaId) {
          return { country, city, area };
        }
      }
    }
  }
  return null;
}

function compoundToForm(compound: Compound): CompoundFormState {
  return {
    slug: compound.slug,
    nameEn: compound.nameEn,
    nameAr: compound.nameAr ?? '',
    description: compound.description ?? '',
    developerId: compound.developerId ?? '',
    countryId: '',
    cityId: '',
    areaId: compound.areaId,
    latitude: compound.latitude != null ? String(compound.latitude) : '',
    longitude: compound.longitude != null ? String(compound.longitude) : '',
    coverUrl: compound.coverUrl ?? '',
    isActive: compound.isActive,
  };
}

function parseCoordinate(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function CompoundFormDialog({
  open,
  onOpenChange,
  compound,
  developers,
  roles,
  onSuccess,
}: CompoundFormDialogProps) {
  const isEdit = Boolean(compound);
  const canSubmit = hasPermission(
    roles,
    isEdit ? 'compounds.update' : 'compounds.create',
  );
  const [form, setForm] = useState<CompoundFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    slug?: string;
    nameEn?: string;
    areaId?: string;
  }>({});

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const developerOptions = useMemo(
    () => [
      { value: '', label: 'بدون مطور' },
      ...developers.map((developer) => ({
        value: developer.id,
        label: developer.nameAr ?? developer.nameEn,
      })),
    ],
    [developers],
  );

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

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function initializeForm() {
      setFieldErrors({});
      setLocationsLoading(true);
      setCities([]);
      setAreas([]);

      const baseForm = compound ? compoundToForm(compound) : EMPTY_FORM;
      setForm(baseForm);

      try {
        if (compound?.areaId) {
          // Edit mode: resolve country/city/area from the full location tree.
          const [countryList, tree] = await Promise.all([
            getAdminCountries(),
            getLocationTree(),
          ]);
          if (cancelled) {
            return;
          }

          setCountries(countryList);

          const path = findLocationPath(tree, compound.areaId);
          if (!path) {
            setForm((current) => ({
              ...current,
              countryId: '',
              cityId: '',
              areaId: compound.areaId,
            }));
            return;
          }

          setCities(path.country.cities);
          setAreas(path.city.areas);
          setForm((current) => ({
            ...current,
            countryId: path.country.id,
            cityId: path.city.id,
            areaId: path.area.id,
          }));
          return;
        }

        // Create mode: load countries only; cities/areas load on cascade change.
        const countryList = await getAdminCountries();
        if (cancelled) {
          return;
        }
        setCountries(countryList);
      } catch {
        if (!cancelled) {
          toast.error(getAdminErrorMessage('تعذر تحميل بيانات المواقع.'));
        }
      } finally {
        if (!cancelled) {
          setLocationsLoading(false);
        }
      }
    }

    void initializeForm();

    return () => {
      cancelled = true;
    };
  }, [open, compound]);

  function updateField<K extends keyof CompoundFormState>(
    key: K,
    value: CompoundFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function handleCountryChange(countryId: string) {
    setForm((current) => ({
      ...current,
      countryId,
      cityId: '',
      areaId: '',
    }));
    setCities([]);
    setAreas([]);
    setFieldErrors((current) => ({ ...current, areaId: undefined }));

    if (!countryId) {
      return;
    }

    setLocationsLoading(true);
    try {
      const cityList = await getAdminCities(countryId);
      setCities(cityList);
    } catch {
      toast.error(getAdminErrorMessage('تعذر تحميل قائمة المدن.'));
    } finally {
      setLocationsLoading(false);
    }
  }

  async function handleCityChange(cityId: string) {
    setForm((current) => ({
      ...current,
      cityId,
      areaId: '',
    }));
    setAreas([]);
    setFieldErrors((current) => ({ ...current, areaId: undefined }));

    if (!cityId) {
      return;
    }

    setLocationsLoading(true);
    try {
      const areaList = await getAdminAreas(cityId);
      setAreas(areaList);
    } catch {
      toast.error(getAdminErrorMessage('تعذر تحميل قائمة المناطق.'));
    } finally {
      setLocationsLoading(false);
    }
  }

  function handleAreaChange(areaId: string) {
    updateField('areaId', areaId);
  }

  function validateForm(): boolean {
    const nextErrors: { slug?: string; nameEn?: string; areaId?: string } = {};

    if (!form.slug.trim()) {
      nextErrors.slug = 'الرابط مطلوب.';
    }

    if (!form.nameEn.trim()) {
      nextErrors.nameEn = 'الاسم بالإنجليزية مطلوب.';
    }

    if (!form.areaId.trim()) {
      nextErrors.areaId = 'المنطقة مطلوبة.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload = {
      slug: form.slug.trim(),
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim() || undefined,
      description: form.description.trim() || undefined,
      areaId: form.areaId.trim(),
      developerId: form.developerId.trim() || undefined,
      latitude: parseCoordinate(form.latitude),
      longitude: parseCoordinate(form.longitude),
      coverUrl: form.coverUrl.trim() || undefined,
      isActive: form.isActive,
    };

    const result =
      isEdit && compound
        ? await updateCompoundAction(compound.id, {
            ...payload,
            developerId: form.developerId.trim() || null,
            latitude: parseCoordinate(form.latitude) ?? null,
            longitude: parseCoordinate(form.longitude) ?? null,
            coverUrl: form.coverUrl.trim() || null,
          })
        : await createCompoundAction(payload);

    if (result.ok) {
      toast.success(isEdit ? 'تم حفظ التعديلات بنجاح.' : 'تمت إضافة المشروع بنجاح.');
      onOpenChange(false);
      onSuccess();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  }

  const selectsDisabled = loading || locationsLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'تعديل مشروع' : 'إضافة مشروع'}
      description={
        isEdit
          ? 'حدّث بيانات المشروع ثم احفظ التغييرات.'
          : 'أدخل بيانات المشروع الجديد.'
      }
      className="w-[min(100%-2rem,36rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            إلغاء
          </Button>
          {canSubmit ? (
            <Button
              type="button"
              variant="primary"
              size="small"
              disabled={loading || locationsLoading}
              onClick={() => {
                void handleSubmit();
              }}
            >
              {loading ? 'جاري الحفظ…' : isEdit ? 'حفظ التعديلات' : 'إضافة'}
            </Button>
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        <Input
          name="slug"
          label="الرابط (Slug)"
          placeholder="mountain-view-icity"
          dir="ltr"
          className="text-start"
          value={form.slug}
          disabled={loading}
          error={fieldErrors.slug}
          onChange={(event) => updateField('slug', event.target.value)}
        />

        <Input
          name="nameEn"
          label="الاسم بالإنجليزية"
          placeholder="Mountain View iCity"
          dir="ltr"
          className="text-start"
          value={form.nameEn}
          disabled={loading}
          error={fieldErrors.nameEn}
          onChange={(event) => updateField('nameEn', event.target.value)}
        />

        <Input
          name="nameAr"
          label="الاسم بالعربية"
          placeholder="ماونتن فيو"
          value={form.nameAr}
          disabled={loading}
          onChange={(event) => updateField('nameAr', event.target.value)}
        />

        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="description">
          <span className="font-medium text-ink-800">الوصف</span>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            disabled={loading}
            onChange={(event) => updateField('description', event.target.value)}
            className={cn(
              'min-h-20 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
            )}
            placeholder="وصف مختصر عن المشروع..."
          />
        </label>

        <Select
          name="developerId"
          label="المطور"
          options={developerOptions}
          value={form.developerId}
          disabled={loading}
          onChange={(event) => updateField('developerId', event.target.value)}
        />

        <Select
          name="countryId"
          label="الدولة"
          placeholder="اختر الدولة"
          options={countryOptions}
          value={form.countryId}
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
          value={form.cityId}
          disabled={selectsDisabled || !form.countryId}
          onChange={(event) => {
            void handleCityChange(event.target.value);
          }}
        />

        <Select
          name="areaId"
          label="المنطقة"
          placeholder="اختر المنطقة"
          options={areaOptions}
          value={form.areaId}
          disabled={selectsDisabled || !form.cityId}
          error={fieldErrors.areaId}
          onChange={(event) => handleAreaChange(event.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="latitude"
            label="خط العرض"
            placeholder="30.0444"
            dir="ltr"
            className="text-start"
            value={form.latitude}
            disabled={loading}
            onChange={(event) => updateField('latitude', event.target.value)}
          />
          <Input
            name="longitude"
            label="خط الطول"
            placeholder="31.2357"
            dir="ltr"
            className="text-start"
            value={form.longitude}
            disabled={loading}
            onChange={(event) => updateField('longitude', event.target.value)}
          />
        </div>

        <Input
          name="coverUrl"
          label="رابط الغلاف"
          placeholder="https://example.com/cover.jpg"
          dir="ltr"
          className="text-start"
          value={form.coverUrl}
          disabled={loading}
          onChange={(event) => updateField('coverUrl', event.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            checked={form.isActive}
            disabled={loading}
            onChange={(event) => updateField('isActive', event.target.checked)}
            className="size-4 rounded border-border text-brand-600 focus:ring-brand-500"
          />
          <span>نشط</span>
        </label>
      </div>
    </Dialog>
  );
}
