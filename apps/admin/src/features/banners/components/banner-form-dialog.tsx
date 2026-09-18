'use client';

import { useEffect, useState, useTransition } from 'react';
import { MediaPicker, type MediaAsset } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/lib/toast';
import { createBannerAction, updateBannerAction } from '../actions';
import {
  BANNER_POSITION_OPTIONS,
  type AdminBanner,
  type BannerFormInput,
  type BannerPosition,
} from '../types';

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: string[];
  banner?: AdminBanner | null;
  onSuccess: () => void;
}

function emptyForm(): BannerFormInput {
  return {
    title: '',
    description: '',
    imageUrl: '',
    mobileImageUrl: '',
    buttonText: '',
    buttonUrl: '',
    position: 'HOME_HERO',
    sortOrder: 0,
    isActive: true,
  };
}

function fromBanner(banner: AdminBanner): BannerFormInput {
  return {
    title: banner.title,
    description: banner.description ?? '',
    imageUrl: banner.imageUrl,
    mobileImageUrl: banner.mobileImageUrl ?? '',
    buttonText: banner.buttonText ?? '',
    buttonUrl: banner.buttonUrl ?? '',
    position: banner.position,
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
  };
}

function toPickerAssets(url: string, label: string): MediaAsset[] {
  if (!url.trim()) return [];
  return [
    {
      id: url,
      url,
      fileName: label,
      mimeType: null,
      size: null,
      width: null,
      height: null,
      folder: 'banners',
      createdAt: new Date(0).toISOString(),
    },
  ];
}

export function BannerFormDialog({
  open,
  onOpenChange,
  permissions,
  banner,
  onSuccess,
}: BannerFormDialogProps) {
  const isEdit = Boolean(banner);
  const [form, setForm] = useState<BannerFormInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BannerFormInput, string>>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setForm(banner ? fromBanner(banner) : emptyForm());
      setErrors({});
    }
  }, [open, banner]);

  function setField<K extends keyof BannerFormInput>(key: K, value: BannerFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const next: Partial<Record<keyof BannerFormInput, string>> = {};
    if (!form.title.trim()) next.title = 'العنوان مطلوب.';
    if (!form.imageUrl.trim()) next.imageUrl = 'صورة سطح المكتب مطلوبة.';
    if (!form.position) next.position = 'الموضع مطلوب.';
    if (
      form.buttonUrl.trim() &&
      !/^(https?:\/\/|\/).+/i.test(form.buttonUrl.trim())
    ) {
      next.buttonUrl = 'الرابط يجب أن يبدأ بـ / أو http(s)://';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) {
      toast.error('يرجى تصحيح الأخطاء قبل الحفظ.');
      return;
    }

    startTransition(async () => {
      const result = isEdit && banner
        ? await updateBannerAction(banner.id, form)
        : await createBannerAction(form);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(isEdit ? 'تم تحديث البنر.' : 'تم إنشاء البنر.');
      if (!result.cacheInvalidated) {
        toast.info(
          'تم الحفظ. إن لم يظهر التغيير فورًا على الموقع، تأكد من REVALIDATE_SECRET و WEB_APP_URL.',
        );
      }
      onOpenChange(false);
      onSuccess();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'تعديل البنر' : 'إضافة بنر'}
      description="إدارة محتوى البنر والوسائط والموضع."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? 'جارٍ الحفظ…' : 'حفظ'}
          </Button>
        </>
      }
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pe-1">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink-900">المحتوى</h3>
          <Input
            label="العنوان"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            error={errors.title}
          />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-800">الوصف</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            />
          </label>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink-900">الوسائط</h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink-800">صورة سطح المكتب</p>
            {errors.imageUrl ? (
              <p className="text-xs text-danger-600">{errors.imageUrl}</p>
            ) : null}
            <MediaPicker
              value={toPickerAssets(form.imageUrl, 'desktop')}
              onChange={(assets) => setField('imageUrl', assets[0]?.url ?? '')}
              multiple={false}
              maxItems={1}
              folder="banners"
              permissions={permissions}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink-800">صورة الجوال (اختياري)</p>
            <MediaPicker
              value={toPickerAssets(form.mobileImageUrl, 'mobile')}
              onChange={(assets) =>
                setField('mobileImageUrl', assets[0]?.url ?? '')
              }
              multiple={false}
              maxItems={1}
              folder="banners"
              permissions={permissions}
              disabled={isPending}
            />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <h3 className="text-sm font-semibold text-ink-900 sm:col-span-2">الزر</h3>
          <Input
            label="نص الزر"
            value={form.buttonText}
            onChange={(e) => setField('buttonText', e.target.value)}
          />
          <Input
            label="رابط الزر"
            value={form.buttonUrl}
            onChange={(e) => setField('buttonUrl', e.target.value)}
            error={errors.buttonUrl}
            hint="مسار الموقع أو رابط كامل"
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Select
            label="الموضع"
            value={form.position}
            onChange={(e) =>
              setField('position', e.target.value as BannerPosition)
            }
            error={errors.position}
            options={BANNER_POSITION_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <Input
            label="الترتيب"
            type="number"
            min={0}
            value={String(form.sortOrder)}
            onChange={(e) =>
              setField('sortOrder', Number.parseInt(e.target.value || '0', 10) || 0)
            }
          />
          <div className="sm:col-span-2">
            <Switch
              label="نشط"
              description="البنرات غير النشطة لا تظهر في الموقع."
              checked={form.isActive}
              onCheckedChange={(checked) => setField('isActive', checked)}
              disabled={isPending}
            />
          </div>
        </section>
      </div>
    </Dialog>
  );
}
