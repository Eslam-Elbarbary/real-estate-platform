'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';
import { createDeveloperAction, updateDeveloperAction } from '../actions';
import type { Developer } from '../types';
import { DeveloperLogoField } from './developer-logo-field';

interface DeveloperFormState {
  slug: string;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  logoPublicId: string;
  website: string;
  isActive: boolean;
}

interface DeveloperFormFieldErrors {
  slug?: string;
  nameEn?: string;
}

export interface DeveloperFormProps {
  mode: 'create' | 'edit';
  initialData?: Developer | null;
  permissions: string[];
  onSuccess: () => void;
  formId?: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const EMPTY_FORM: DeveloperFormState = {
  slug: '',
  nameEn: '',
  nameAr: '',
  description: '',
  logoUrl: '',
  logoPublicId: '',
  website: '',
  isActive: true,
};

function developerToForm(developer: Developer): DeveloperFormState {
  return {
    slug: developer.slug,
    nameEn: developer.nameEn,
    nameAr: developer.nameAr ?? '',
    description: developer.description ?? '',
    logoUrl: developer.logoUrl ?? '',
    logoPublicId: developer.logoPublicId ?? '',
    website: developer.website ?? '',
    isActive: developer.isActive,
  };
}

export function DeveloperForm({
  mode,
  initialData,
  permissions,
  onSuccess,
  formId = 'developer-form',
  disabled = false,
  onLoadingChange,
}: DeveloperFormProps) {
  const isEdit = mode === 'edit';
  const canSubmit = hasPermission(
    permissions,
    isEdit ? 'developers.update' : 'developers.create',
  );

  const [form, setForm] = useState<DeveloperFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<DeveloperFormFieldErrors>({});

  useEffect(() => {
    setForm(isEdit && initialData ? developerToForm(initialData) : EMPTY_FORM);
    setFieldErrors({});
  }, [isEdit, initialData]);

  function updateField<K extends keyof DeveloperFormState>(
    key: K,
    value: DeveloperFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: DeveloperFormFieldErrors = {};

    if (!form.slug.trim()) {
      nextErrors.slug = 'الرابط مطلوب.';
    }

    if (!form.nameEn.trim()) {
      nextErrors.nameEn = 'الاسم بالإنجليزية مطلوب.';
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
      logoUrl: form.logoUrl.trim() || undefined,
      logoPublicId: form.logoPublicId.trim() || undefined,
      website: form.website.trim() || undefined,
      isActive: form.isActive,
    };

    const result =
      isEdit && initialData
        ? await updateDeveloperAction(initialData.id, {
            ...basePayload,
            nameAr: form.nameAr.trim() || null,
            description: form.description.trim() || null,
            logoUrl: form.logoUrl.trim() || null,
            logoPublicId: form.logoPublicId.trim() || null,
            website: form.website.trim() || null,
          })
        : await createDeveloperAction(basePayload);

    if (result.ok) {
      toast.success(
        isEdit ? 'تم حفظ تعديلات المطور بنجاح.' : 'تمت إضافة المطور بنجاح.',
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
      className="max-h-[min(70vh,40rem)] space-y-5 overflow-y-auto pe-1"
    >
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-ink-900">المعلومات الأساسية</h3>

        <Input
          name="nameEn"
          label="الاسم الإنجليزي"
          placeholder="Prime Urban Developments"
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
          placeholder="برايم أوربان"
          value={form.nameAr}
          disabled={formDisabled}
          onChange={(event) => updateField('nameAr', event.target.value)}
        />

        <Input
          name="slug"
          label="Slug"
          placeholder="prime-urban"
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
            placeholder="وصف مختصر عن المطور..."
            onChange={(event) => updateField('description', event.target.value)}
            className={cn(
              'min-h-20 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
            )}
          />
        </label>

        <Input
          name="website"
          label="الموقع الإلكتروني"
          placeholder="https://example.com"
          dir="ltr"
          className="text-start"
          value={form.website}
          disabled={formDisabled}
          onChange={(event) => updateField('website', event.target.value)}
        />
      </section>

      <DeveloperLogoField
        value={{
          logoUrl: form.logoUrl,
          logoPublicId: form.logoPublicId,
        }}
        onChange={(logo) => {
          setForm((current) => ({
            ...current,
            logoUrl: logo.logoUrl,
            logoPublicId: logo.logoPublicId,
          }));
        }}
        permissions={permissions}
        disabled={formDisabled}
      />

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
