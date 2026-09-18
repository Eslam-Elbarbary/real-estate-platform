'use client';

import { useMemo, useState, useTransition } from 'react';
import { MediaPicker, type MediaAsset } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/features/auth/permissions';
import { useUnsavedChangesGuard } from '@/features/properties/components/wizard/use-unsaved-changes-guard';
import { toast } from '@/lib/toast';
import { updatePlatformSettingsAction } from '../actions';
import type { AdminPlatformSettings, UpdatePlatformSettingsInput } from '../types';

interface SettingsFormProps {
  initial: AdminPlatformSettings;
  permissions: string[];
}

type FormState = UpdatePlatformSettingsInput;

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(settings: AdminPlatformSettings): FormState {
  return {
    siteName: settings.siteName ?? '',
    shortName: settings.shortName ?? '',
    description: settings.description ?? '',
    logoUrl: settings.logoUrl ?? '',
    faviconUrl: settings.faviconUrl ?? '',
    email: settings.email ?? '',
    phone: settings.phone ?? '',
    whatsapp: settings.whatsapp ?? '',
    address: settings.address ?? '',
    facebookUrl: settings.facebookUrl ?? '',
    instagramUrl: settings.instagramUrl ?? '',
    twitterUrl: settings.twitterUrl ?? '',
    linkedinUrl: settings.linkedinUrl ?? '',
    metaTitle: settings.metaTitle ?? '',
    metaDescription: settings.metaDescription ?? '',
    ogImageUrl: settings.ogImageUrl ?? '',
  };
}

function toPickerAssets(url: string, label: string): MediaAsset[] {
  if (!url.trim()) {
    return [];
  }
  return [
    {
      id: url,
      url,
      fileName: label,
      mimeType: null,
      size: null,
      width: null,
      height: null,
      folder: 'platform',
      createdAt: new Date(0).toISOString(),
    },
  ];
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.siteName.trim()) {
    errors.siteName = 'اسم الموقع مطلوب.';
  }
  if (!form.shortName.trim()) {
    errors.shortName = 'الاسم المختصر مطلوب.';
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'البريد الإلكتروني غير صالح.';
  }
  return errors;
}

export function SettingsForm({ initial, permissions }: SettingsFormProps) {
  const canUpdate = hasPermission(permissions, 'settings.update');
  const [baseline, setBaseline] = useState(() => toFormState(initial));
  const [form, setForm] = useState(() => toFormState(initial));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(baseline),
    [form, baseline],
  );

  useUnsavedChangesGuard(
    dirty && canUpdate,
    'لديك تغييرات غير محفوظة. هل تريد المغادرة دون حفظ؟',
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSave() {
    if (!canUpdate) {
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('يرجى تصحيح الأخطاء قبل الحفظ.');
      return;
    }

    startTransition(async () => {
      const result = await updatePlatformSettingsAction(form);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setBaseline(form);
      toast.success('تم حفظ إعدادات الموقع بنجاح.');
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">إعدادات الموقع</h1>
          <p className="mt-1 text-sm text-ink-500">
            الهوية البصرية، بيانات التواصل، الروابط الاجتماعية، وإعدادات SEO للمنصة.
          </p>
        </div>
        {canUpdate ? (
          <Button
            type="button"
            disabled={!dirty || isPending}
            onClick={handleSave}
          >
            {isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </Button>
        ) : null}
      </div>

      {!canUpdate ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          لديك صلاحية العرض فقط. لا يمكن حفظ التعديلات.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">الهوية البصرية</h2>
          <p className="text-sm text-ink-500">
            اسم المنصة والشعار والأيقونة الظاهرة للزوار.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            label="اسم الموقع"
            name="siteName"
            value={form.siteName}
            onChange={(e) => setField('siteName', e.target.value)}
            error={errors.siteName}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="الاسم المختصر"
            name="shortName"
            value={form.shortName}
            onChange={(e) => setField('shortName', e.target.value)}
            error={errors.shortName}
            disabled={!canUpdate || isPending}
          />
          <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
            <span className="font-medium text-ink-800">الوصف</span>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              disabled={!canUpdate || isPending}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60"
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-medium text-ink-800">شعار الموقع</p>
            {form.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="معاينة الشعار"
                className="h-16 w-auto max-w-full rounded border border-border bg-white object-contain p-2"
              />
            ) : (
              <p className="text-xs text-ink-500">لا يوجد شعار حالياً.</p>
            )}
            <MediaPicker
              value={toPickerAssets(form.logoUrl, 'logo')}
              onChange={(assets) => setField('logoUrl', assets[0]?.url ?? '')}
              multiple={false}
              maxItems={1}
              folder="platform"
              disabled={!canUpdate || isPending}
              permissions={permissions}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-ink-800">أيقونة Favicon</p>
            {form.faviconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.faviconUrl}
                alt="معاينة الأيقونة"
                className="h-12 w-12 rounded border border-border bg-white object-contain p-1"
              />
            ) : (
              <p className="text-xs text-ink-500">لا توجد أيقونة حالياً.</p>
            )}
            <MediaPicker
              value={toPickerAssets(form.faviconUrl, 'favicon')}
              onChange={(assets) => setField('faviconUrl', assets[0]?.url ?? '')}
              multiple={false}
              maxItems={1}
              folder="platform"
              disabled={!canUpdate || isPending}
              permissions={permissions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">بيانات التواصل</h2>
          <p className="text-sm text-ink-500">قنوات التواصل الظاهرة للجمهور.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="الهاتف"
            name="phone"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="WhatsApp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={(e) => setField('whatsapp', e.target.value)}
            hint="رقم دولي بدون + (مثال: 2010…)"
            disabled={!canUpdate || isPending}
          />
          <Input
            label="العنوان"
            name="address"
            value={form.address}
            onChange={(e) => setField('address', e.target.value)}
            disabled={!canUpdate || isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">روابط التواصل الاجتماعي</h2>
          <p className="text-sm text-ink-500">روابط الحسابات الرسمية للمنصة.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            label="Facebook"
            name="facebookUrl"
            value={form.facebookUrl}
            onChange={(e) => setField('facebookUrl', e.target.value)}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="Instagram"
            name="instagramUrl"
            value={form.instagramUrl}
            onChange={(e) => setField('instagramUrl', e.target.value)}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="Twitter / X"
            name="twitterUrl"
            value={form.twitterUrl}
            onChange={(e) => setField('twitterUrl', e.target.value)}
            disabled={!canUpdate || isPending}
          />
          <Input
            label="LinkedIn"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={(e) => setField('linkedinUrl', e.target.value)}
            disabled={!canUpdate || isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">SEO</h2>
          <p className="text-sm text-ink-500">
            عنوان ووصف الميتا وصورة المشاركة الافتراضية.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            label="Meta Title"
            name="metaTitle"
            value={form.metaTitle}
            onChange={(e) => setField('metaTitle', e.target.value)}
            disabled={!canUpdate || isPending}
          />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-800">Meta Description</span>
            <textarea
              name="metaDescription"
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setField('metaDescription', e.target.value)}
              disabled={!canUpdate || isPending}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60"
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink-800">OG Image</p>
            {form.ogImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.ogImageUrl}
                alt="معاينة صورة المشاركة"
                className="h-28 w-auto max-w-full rounded border border-border bg-white object-cover"
              />
            ) : (
              <p className="text-xs text-ink-500">لا توجد صورة مشاركة حالياً.</p>
            )}
            <MediaPicker
              value={toPickerAssets(form.ogImageUrl, 'og')}
              onChange={(assets) => setField('ogImageUrl', assets[0]?.url ?? '')}
              multiple={false}
              maxItems={1}
              folder="platform"
              disabled={!canUpdate || isPending}
              permissions={permissions}
            />
          </div>
        </CardContent>
      </Card>

      {canUpdate ? (
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!dirty || isPending}
            onClick={handleSave}
          >
            {isPending ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
