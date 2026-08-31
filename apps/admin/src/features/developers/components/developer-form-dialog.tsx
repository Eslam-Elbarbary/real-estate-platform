'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/features/auth/permissions';
import { cn } from '@/lib/utils/cn';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { UserRole } from '@/types';
import { createDeveloperAction, updateDeveloperAction } from '../actions';
import type { Developer } from '../types';

interface DeveloperFormState {
  slug: string;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  website: string;
  isActive: boolean;
}

interface DeveloperFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developer?: Developer | null;
  roles: UserRole[];
  onSuccess: () => void;
}

const EMPTY_FORM: DeveloperFormState = {
  slug: '',
  nameEn: '',
  nameAr: '',
  description: '',
  logoUrl: '',
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
    website: developer.website ?? '',
    isActive: developer.isActive,
  };
}

export function DeveloperFormDialog({
  open,
  onOpenChange,
  developer,
  roles,
  onSuccess,
}: DeveloperFormDialogProps) {
  const isEdit = Boolean(developer);
  const canSubmit = hasPermission(
    roles,
    isEdit ? 'developers.update' : 'developers.create',
  );
  const [form, setForm] = useState<DeveloperFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    slug?: string;
    nameEn?: string;
  }>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(developer ? developerToForm(developer) : EMPTY_FORM);
    setFieldErrors({});
  }, [open, developer]);

  function updateField<K extends keyof DeveloperFormState>(
    key: K,
    value: DeveloperFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === 'slug' && fieldErrors.slug) {
      setFieldErrors((current) => ({ ...current, slug: undefined }));
    }
    if (key === 'nameEn' && fieldErrors.nameEn) {
      setFieldErrors((current) => ({ ...current, nameEn: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: { slug?: string; nameEn?: string } = {};

    if (!form.slug.trim()) {
      nextErrors.slug = 'الرابط مطلوب.';
    }

    if (!form.nameEn.trim()) {
      nextErrors.nameEn = 'الاسم بالإنجليزية مطلوب.';
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
      logoUrl: form.logoUrl.trim() || undefined,
      website: form.website.trim() || undefined,
      isActive: form.isActive,
    };

    const result = isEdit && developer
      ? await updateDeveloperAction(developer.id, payload)
      : await createDeveloperAction(payload);

    if (result.ok) {
      toast.success(isEdit ? 'تم حفظ التعديلات بنجاح.' : 'تمت إضافة المطور بنجاح.');
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

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'تعديل مطور' : 'إضافة مطور'}
      description={
        isEdit
          ? 'حدّث بيانات المطور ثم احفظ التغييرات.'
          : 'أدخل بيانات المطور الجديد.'
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
              disabled={loading}
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
          placeholder="prime-urban"
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
          placeholder="Prime Urban Developments"
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
          placeholder="Prime Urban"
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
            placeholder="وصف مختصر عن المطور..."
          />
        </label>

        <Input
          name="logoUrl"
          label="رابط الشعار"
          placeholder="https://example.com/logo.png"
          dir="ltr"
          className="text-start"
          value={form.logoUrl}
          disabled={loading}
          onChange={(event) => updateField('logoUrl', event.target.value)}
        />

        <Input
          name="website"
          label="الموقع الإلكتروني"
          placeholder="https://example.com"
          dir="ltr"
          className="text-start"
          value={form.website}
          disabled={loading}
          onChange={(event) => updateField('website', event.target.value)}
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
