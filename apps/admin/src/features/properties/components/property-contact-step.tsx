'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type {
  PropertyContactSource,
  PropertyContactType,
  UpsertPropertyContactInput,
} from '../api-property-contact';

export interface PropertyContactFormState {
  contactSource: PropertyContactSource;
  contactType: PropertyContactType;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export const EMPTY_CONTACT_FORM: PropertyContactFormState = {
  contactSource: 'OWNER',
  contactType: 'OWNER',
  contactName: '',
  phone: '',
  whatsapp: '',
  email: '',
};

export function contactFormToPayload(
  form: PropertyContactFormState,
): UpsertPropertyContactInput {
  if (form.contactSource === 'OWNER') {
    return { source: 'OWNER', contactType: 'OWNER' };
  }
  return {
    source: 'CUSTOM',
    contactType: form.contactType,
    name: form.contactName.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim() || null,
    email: form.email.trim() || null,
  };
}

export function contactDtoToForm(dto: {
  source: PropertyContactSource;
  contactType: PropertyContactType;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}): PropertyContactFormState {
  if (dto.source === 'CUSTOM') {
    return {
      contactSource: 'CUSTOM',
      contactType: dto.contactType,
      contactName: dto.name ?? '',
      phone: dto.phone ?? '',
      whatsapp: dto.whatsapp ?? '',
      email: dto.email ?? '',
    };
  }
  return {
    ...EMPTY_CONTACT_FORM,
    contactSource: 'OWNER',
    contactType: 'OWNER',
  };
}

const CONTACT_TYPE_OPTIONS = [
  { value: 'OWNER', label: 'مالك' },
  { value: 'AGENT', label: 'وسيط' },
  { value: 'COMPANY', label: 'شركة' },
];

interface PropertyContactStepProps {
  value: PropertyContactFormState;
  onChange: (next: PropertyContactFormState) => void;
  ownerPreview?: {
    name: string | null;
    phone: string | null;
    email?: string | null;
  } | null;
  disabled?: boolean;
  loading?: boolean;
  errors?: Partial<Record<keyof PropertyContactFormState, string>>;
}

export function PropertyContactStep({
  value,
  onChange,
  ownerPreview,
  disabled,
  loading,
  errors,
}: PropertyContactStepProps) {
  function setField<K extends keyof PropertyContactFormState>(
    key: K,
    next: PropertyContactFormState[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-bold text-ink-900">بيانات التواصل</h3>
        <p className="text-sm text-ink-500">
          تظهر هذه البيانات لزوار صفحة العقار عند طلب التواصل.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <p className="text-sm text-ink-500" role="status">
            جارٍ تحميل بيانات التواصل…
          </p>
        ) : null}

        <fieldset className="space-y-3" disabled={disabled || loading}>
          <p className="text-sm font-semibold text-ink-800">
            مصدر بيانات التواصل
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
            <input
              type="radio"
              name="contact-source"
              className="mt-1"
              checked={value.contactSource === 'OWNER'}
              onChange={() =>
                onChange({
                  ...value,
                  contactSource: 'OWNER',
                  contactType: 'OWNER',
                })
              }
            />
            <span>
              <span className="block font-semibold text-ink-900">
                استخدام بيانات مالك العقار
              </span>
              <span className="mt-1 block text-sm text-ink-500">
                الاسم ورقم الهاتف والبريد من ملف المالك.
              </span>
            </span>
          </label>

          {value.contactSource === 'OWNER' ? (
            <div className="rounded-xl bg-surface-50 px-4 py-3 text-sm text-ink-700">
              <p>
                <span className="font-semibold">الاسم: </span>
                {ownerPreview?.name?.trim() || '—'}
              </p>
              <p className="mt-1">
                <span className="font-semibold">رقم الهاتف: </span>
                {ownerPreview?.phone?.trim() || '—'}
              </p>
              <p className="mt-1">
                <span className="font-semibold">البريد الإلكتروني: </span>
                {ownerPreview?.email?.trim() || '—'}
              </p>
              {!ownerPreview?.phone?.trim() ? (
                <p className="mt-2 text-xs text-warning-800">
                  المالك لا يملك رقم هاتف في الملف الشخصي. يُفضّل إضافة بيانات
                  مخصصة.
                </p>
              ) : null}
            </div>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
            <input
              type="radio"
              name="contact-source"
              className="mt-1"
              checked={value.contactSource === 'CUSTOM'}
              onChange={() =>
                onChange({
                  ...value,
                  contactSource: 'CUSTOM',
                  contactType:
                    value.contactType === 'OWNER' ? 'AGENT' : value.contactType,
                })
              }
            />
            <span>
              <span className="block font-semibold text-ink-900">
                إضافة بيانات مخصصة
              </span>
              <span className="mt-1 block text-sm text-ink-500">
                وسيط أو شركة أو بيانات تواصل مختلفة عن المالك.
              </span>
            </span>
          </label>
        </fieldset>

        {value.contactSource === 'CUSTOM' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="اسم جهة التواصل"
              value={value.contactName}
              onChange={(e) => setField('contactName', e.target.value)}
              error={errors?.contactName}
              disabled={disabled || loading}
            />
            <Select
              label="نوع جهة التواصل"
              value={value.contactType}
              onChange={(e) =>
                setField('contactType', e.target.value as PropertyContactType)
              }
              options={CONTACT_TYPE_OPTIONS}
              disabled={disabled || loading}
            />
            <Input
              label="رقم الهاتف"
              value={value.phone}
              onChange={(e) => setField('phone', e.target.value)}
              error={errors?.phone}
              disabled={disabled || loading}
              dir="ltr"
            />
            <Input
              label="رقم واتساب"
              value={value.whatsapp}
              onChange={(e) => setField('whatsapp', e.target.value)}
              disabled={disabled || loading}
              dir="ltr"
            />
            <Input
              label="البريد الإلكتروني"
              value={value.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors?.email}
              disabled={disabled || loading}
              className="sm:col-span-2"
              dir="ltr"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function validateContactForm(
  value: PropertyContactFormState,
): Partial<Record<keyof PropertyContactFormState, string>> {
  if (value.contactSource !== 'CUSTOM') return {};
  const errors: Partial<Record<keyof PropertyContactFormState, string>> = {};
  if (!value.contactName.trim()) errors.contactName = 'الاسم مطلوب.';
  if (!value.phone.trim() || value.phone.trim().length < 5) {
    errors.phone = 'رقم الهاتف مطلوب.';
  }
  if (
    value.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())
  ) {
    errors.email = 'البريد غير صالح.';
  }
  return errors;
}

export function formatContactSourceLabel(source: PropertyContactSource): string {
  return source === 'CUSTOM' ? 'مخصص' : 'مالك العقار';
}

export function formatContactTypeLabel(type: PropertyContactType): string {
  switch (type) {
    case 'AGENT':
      return 'وسيط';
    case 'COMPANY':
      return 'شركة';
    default:
      return 'مالك';
  }
}
