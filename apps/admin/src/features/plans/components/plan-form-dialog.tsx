'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { UserRole } from '@/types';
import { createPlanAction, updatePlanAction } from '../actions';
import type { AdminPlan, PlanStatus } from '../types';

interface PlanFormState {
  code: string;
  name: string;
  price: string;
  durationDays: string;
  listingLimit: string;
  status: PlanStatus;
}

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: AdminPlan | null;
  permissions: string[];
  onSuccess: () => void;
}

const EMPTY_FORM: PlanFormState = {
  code: '',
  name: '',
  price: '',
  durationDays: '',
  listingLimit: '',
  status: 'ACTIVE',
};

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'INACTIVE', label: 'غير نشط' },
];

function planToForm(plan: AdminPlan): PlanFormState {
  const listingLimit =
    typeof plan.features.listingLimit === 'number'
      ? String(plan.features.listingLimit)
      : '';

  return {
    code: plan.code,
    name: plan.name,
    price: String(plan.price),
    durationDays: String(plan.durationDays),
    listingLimit,
    status: plan.status,
  };
}

function parsePositiveNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePositiveInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function PlanFormDialog({
  open,
  onOpenChange,
  plan,
  permissions,
  onSuccess,
}: PlanFormDialogProps) {
  const isEdit = Boolean(plan);
  const canSubmit = hasPermission(
    permissions,
    isEdit ? 'plans.update' : 'plans.create',
  );
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    code?: string;
    name?: string;
    price?: string;
    durationDays?: string;
    listingLimit?: string;
  }>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(plan ? planToForm(plan) : EMPTY_FORM);
    setFieldErrors({});
  }, [open, plan]);

  function updateField<K extends keyof PlanFormState>(
    key: K,
    value: PlanFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: typeof fieldErrors = {};

    if (!form.code.trim()) {
      nextErrors.code = 'رمز الخطة مطلوب.';
    }

    if (!form.name.trim()) {
      nextErrors.name = 'اسم الخطة مطلوب.';
    }

    const price = parsePositiveNumber(form.price);
    if (price === undefined || price < 0) {
      nextErrors.price = 'السعر مطلوب ويجب أن يكون رقمًا صالحًا.';
    }

    const durationDays = parsePositiveInt(form.durationDays);
    if (durationDays === undefined) {
      nextErrors.durationDays = 'المدة مطلوبة ويجب أن تكون يومًا واحدًا على الأقل.';
    }

    const listingLimit = parsePositiveInt(form.listingLimit);
    if (listingLimit === undefined) {
      nextErrors.listingLimit = 'حد الإعلانات مطلوب ويجب أن يكون رقمًا صحيحًا.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const price = parsePositiveNumber(form.price)!;
    const durationDays = parsePositiveInt(form.durationDays)!;
    const listingLimit = parsePositiveInt(form.listingLimit)!;

    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      price,
      durationDays,
      features: { listingLimit },
      status: form.status,
    };

    const result =
      isEdit && plan
        ? await updatePlanAction(plan.id, payload)
        : await createPlanAction(payload);

    if (result.ok) {
      toast.success(isEdit ? 'تم حفظ التعديلات بنجاح.' : 'تمت إضافة الخطة بنجاح.');
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
      title={isEdit ? 'تعديل خطة' : 'إضافة خطة'}
      description={
        isEdit
          ? 'حدّث بيانات الخطة ثم احفظ التغييرات.'
          : 'أدخل بيانات خطة الاشتراك الجديدة.'
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
          name="code"
          label="رمز الخطة"
          placeholder="PREMIUM"
          dir="ltr"
          className="text-start uppercase"
          value={form.code}
          disabled={loading}
          error={fieldErrors.code}
          onChange={(event) => updateField('code', event.target.value.toUpperCase())}
        />

        <Input
          name="name"
          label="اسم الخطة"
          placeholder="Premium"
          value={form.name}
          disabled={loading}
          error={fieldErrors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="price"
            label="السعر"
            placeholder="499"
            dir="ltr"
            className="text-start"
            value={form.price}
            disabled={loading}
            error={fieldErrors.price}
            onChange={(event) => updateField('price', event.target.value)}
          />
          <Input
            name="durationDays"
            label="المدة (بالأيام)"
            placeholder="30"
            dir="ltr"
            className="text-start"
            value={form.durationDays}
            disabled={loading}
            error={fieldErrors.durationDays}
            onChange={(event) => updateField('durationDays', event.target.value)}
          />
        </div>

        <Input
          name="listingLimit"
          label="حد الإعلانات"
          placeholder="5"
          dir="ltr"
          className="text-start"
          value={form.listingLimit}
          disabled={loading}
          error={fieldErrors.listingLimit}
          onChange={(event) => updateField('listingLimit', event.target.value)}
        />

        <Select
          name="status"
          label="الحالة"
          options={STATUS_OPTIONS}
          value={form.status}
          disabled={loading}
          onChange={(event) => updateField('status', event.target.value as PlanStatus)}
        />
      </div>
    </Dialog>
  );
}
