'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/features/auth/permissions';
import type { Developer } from '@/features/developers/types';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';
import { createCompoundAction, updateCompoundAction } from '../actions';
import type { Compound } from '../types';
import { CompoundCoverField } from './compound-cover-field';
import { CompoundDeveloperSelect } from './compound-developer-select';
import {
  CompoundLocationField,
  type CompoundLocationValue,
} from './compound-location-field';

interface CompoundFormState {
  slug: string;
  nameEn: string;
  nameAr: string;
  description: string;
  developerId: string;
  latitude: string;
  longitude: string;
  coverUrl: string;
  coverPublicId: string;
  isActive: boolean;
}

interface CompoundFormFieldErrors {
  slug?: string;
  nameEn?: string;
  areaId?: string;
}

export interface CompoundFormProps {
  mode: 'create' | 'edit';
  initialData?: Compound | null;
  initialDeveloper?: Developer | null;
  permissions: string[];
  onSuccess: () => void;
  formId?: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const EMPTY_FORM: CompoundFormState = {
  slug: '',
  nameEn: '',
  nameAr: '',
  description: '',
  developerId: '',
  latitude: '',
  longitude: '',
  coverUrl: '',
  coverPublicId: '',
  isActive: true,
};

const EMPTY_LOCATION: CompoundLocationValue = {
  countryId: '',
  cityId: '',
  areaId: '',
};

function compoundToForm(compound: Compound): CompoundFormState {
  return {
    slug: compound.slug,
    nameEn: compound.nameEn,
    nameAr: compound.nameAr ?? '',
    description: compound.description ?? '',
    developerId: compound.developerId ?? '',
    latitude: compound.latitude != null ? String(compound.latitude) : '',
    longitude: compound.longitude != null ? String(compound.longitude) : '',
    coverUrl: compound.coverUrl ?? '',
    coverPublicId: compound.coverPublicId ?? '',
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

export function CompoundForm({
  mode,
  initialData,
  initialDeveloper,
  permissions,
  onSuccess,
  formId = 'compound-form',
  disabled = false,
  onLoadingChange,
}: CompoundFormProps) {
  const isEdit = mode === 'edit';
  const canSubmit = hasPermission(
    permissions,
    isEdit ? 'compounds.update' : 'compounds.create',
  );

  const [form, setForm] = useState<CompoundFormState>(EMPTY_FORM);
  const [location, setLocation] = useState<CompoundLocationValue>(EMPTY_LOCATION);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<CompoundFormFieldErrors>({});

  useEffect(() => {
    if (isEdit && initialData) {
      setForm(compoundToForm(initialData));
      setLocation({
        countryId: '',
        cityId: '',
        areaId: initialData.areaId,
      });
      setFieldErrors({});
      return;
    }

    setForm(EMPTY_FORM);
    setLocation(EMPTY_LOCATION);
    setFieldErrors({});
  }, [isEdit, initialData]);

  function updateField<K extends keyof CompoundFormState>(
    key: K,
    value: CompoundFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: CompoundFormFieldErrors = {};

    if (!form.slug.trim()) {
      nextErrors.slug = 'الرابط مطلوب.';
    }

    if (!form.nameEn.trim()) {
      nextErrors.nameEn = 'الاسم بالإنجليزية مطلوب.';
    }

    if (!location.areaId.trim()) {
      nextErrors.areaId = 'المنطقة مطلوبة.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || disabled) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);

    const basePayload = {
      slug: form.slug.trim(),
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim() || undefined,
      description: form.description.trim() || undefined,
      areaId: location.areaId.trim(),
      developerId: form.developerId.trim() || undefined,
      latitude: parseCoordinate(form.latitude),
      longitude: parseCoordinate(form.longitude),
      coverUrl: form.coverUrl.trim() || undefined,
      coverPublicId: form.coverPublicId.trim() || undefined,
      isActive: form.isActive,
    };

    const result =
      isEdit && initialData
        ? await updateCompoundAction(initialData.id, {
            ...basePayload,
            nameAr: form.nameAr.trim() || null,
            description: form.description.trim() || null,
            developerId: form.developerId.trim() || null,
            latitude: parseCoordinate(form.latitude) ?? null,
            longitude: parseCoordinate(form.longitude) ?? null,
            coverUrl: form.coverUrl.trim() || null,
            coverPublicId: form.coverPublicId.trim() || null,
          })
        : await createCompoundAction(basePayload);

    if (result.ok) {
      toast.success(
        isEdit ? 'تم حفظ تعديلات المشروع بنجاح.' : 'تمت إضافة المشروع بنجاح.',
      );
      onSuccess();
      setLoading(false);
      onLoadingChange?.(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
    onLoadingChange?.(false);
  }

  const formDisabled = disabled || loading;

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="max-h-[min(70vh,42rem)] space-y-6 overflow-y-auto pe-1"
    >
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-ink-900">المعلومات الأساسية</h3>

        <Input
          name="nameEn"
          label="الاسم الإنجليزي"
          placeholder="Mountain View iCity"
          dir="ltr"
          className="text-start"
          value={form.nameEn}
          disabled={formDisabled}
          error={fieldErrors.nameEn}
          onChange={(event) => updateField('nameEn', event.target.value)}
        />

        <Input
          name="nameAr"
          label="الاسم العربي"
          placeholder="ماونتن فيو"
          value={form.nameAr}
          disabled={formDisabled}
          onChange={(event) => updateField('nameAr', event.target.value)}
        />

        <Input
          name="slug"
          label="Slug"
          placeholder="mountain-view-icity"
          dir="ltr"
          className="text-start"
          value={form.slug}
          disabled={formDisabled}
          error={fieldErrors.slug}
          onChange={(event) => updateField('slug', event.target.value)}
        />

        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="description">
          <span className="font-medium text-ink-800">الوصف</span>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            disabled={formDisabled}
            placeholder="وصف مختصر عن المشروع..."
            onChange={(event) => updateField('description', event.target.value)}
            className={cn(
              'min-h-20 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
            )}
          />
        </label>
      </section>

      <CompoundDeveloperSelect
        value={form.developerId}
        onChange={(developerId) => updateField('developerId', developerId)}
        initialDeveloper={initialDeveloper}
        disabled={formDisabled}
      />

      <CompoundLocationField
        value={location}
        onChange={setLocation}
        disabled={formDisabled}
        areaError={fieldErrors.areaId}
      />

      <CompoundCoverField
        value={{
          coverUrl: form.coverUrl,
          coverPublicId: form.coverPublicId,
        }}
        onChange={(cover) => {
          setForm((current) => ({
            ...current,
            coverUrl: cover.coverUrl,
            coverPublicId: cover.coverPublicId,
          }));
        }}
        permissions={permissions}
        disabled={formDisabled}
      />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-ink-900">الإحداثيات</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="latitude"
            label="خط العرض"
            placeholder="30.0444"
            dir="ltr"
            className="text-start"
            value={form.latitude}
            disabled={formDisabled}
            onChange={(event) => updateField('latitude', event.target.value)}
          />
          <Input
            name="longitude"
            label="خط الطول"
            placeholder="31.2357"
            dir="ltr"
            className="text-start"
            value={form.longitude}
            disabled={formDisabled}
            onChange={(event) => updateField('longitude', event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-ink-900">الحالة</h3>
        <label className="inline-flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            checked={form.isActive}
            disabled={formDisabled}
            className="size-4 rounded border-border text-brand-600 focus:ring-brand-200"
            onChange={(event) => updateField('isActive', event.target.checked)}
          />
          {form.isActive ? 'نشط' : 'غير نشط'}
        </label>
      </section>

      {canSubmit ? (
        <button type="submit" className="sr-only">
          {isEdit ? 'حفظ' : 'إنشاء'}
        </button>
      ) : null}
    </form>
  );
}
