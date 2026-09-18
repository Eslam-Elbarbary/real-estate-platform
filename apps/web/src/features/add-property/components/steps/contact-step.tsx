'use client';

import { useMemo, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { saveContactStepAction } from '../../actions';
import { listingCopy } from '../../config';
import type {
  ListingContactDraft,
  ListingContactType,
  ListingDraft,
} from '../../types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

const CONTACT_TYPE_OPTIONS: Array<{ value: ListingContactType; label: string }> =
  [
    { value: 'OWNER', label: listingCopy.contactTypeOwner },
    { value: 'AGENT', label: listingCopy.contactTypeAgent },
    { value: 'COMPANY', label: listingCopy.contactTypeCompany },
  ];

interface ContactStepFormProps {
  draft: ListingDraft;
  accountName: string;
  accountPhone: string | null;
}

export function ContactStepForm({
  draft,
  accountName,
  accountPhone,
}: ContactStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ListingContactDraft, string>>
  >({});

  const initial = useMemo<ListingContactDraft>(() => {
    if (draft.contact.contactSource === 'CUSTOM') {
      return { ...draft.contact };
    }
    return {
      contactSource: 'OWNER',
      contactType: 'OWNER',
      contactName: draft.contact.contactName || accountName,
      phone: draft.contact.phone || accountPhone?.trim() || '',
      whatsapp: draft.contact.whatsapp || accountPhone?.trim() || '',
      email: draft.contact.email || '',
    };
  }, [draft.contact, accountName, accountPhone]);

  const [contact, setContact] = useState<ListingContactDraft>(initial);

  function setField<K extends keyof ListingContactDraft>(
    key: K,
    value: ListingContactDraft[K],
  ) {
    setContact((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const payload: ListingContactDraft =
        contact.contactSource === 'OWNER'
          ? {
              contactSource: 'OWNER',
              contactType: 'OWNER',
              contactName: accountName,
              phone: accountPhone?.trim() || '',
              whatsapp: accountPhone?.trim() || '',
              email: '',
            }
          : contact;

      const result = await saveContactStepAction(draft.id, payload);
      if (!result.ok) {
        setError(result.error);
        if (result.error.includes('اسم')) {
          setFieldErrors({ contactName: result.error });
        } else if (result.error.includes('هاتف') || result.error.includes('حسابك')) {
          setFieldErrors({ phone: result.error });
        } else if (result.error.includes('بريد')) {
          setFieldErrors({ email: result.error });
        }
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset className="space-y-3" disabled={pending}>
        <legend className="mb-1 text-sm font-extrabold text-ink-900">
          مصدر بيانات التواصل
        </legend>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e5e5e5] bg-white p-4">
          <input
            type="radio"
            name="contact-source"
            className="mt-1"
            checked={contact.contactSource === 'OWNER'}
            onChange={() =>
              setContact({
                contactSource: 'OWNER',
                contactType: 'OWNER',
                contactName: accountName,
                phone: accountPhone?.trim() || '',
                whatsapp: accountPhone?.trim() || '',
                email: '',
              })
            }
          />
          <span>
            <span className="block text-sm font-extrabold text-ink-900">
              {listingCopy.contactAccountMode}
            </span>
            <span className="mt-1 block text-sm text-ink-600">
              الاسم ورقم الهاتف من حسابك.
            </span>
          </span>
        </label>

        {contact.contactSource === 'OWNER' ? (
          <div className="rounded-xl bg-surface-50 px-4 py-3 text-sm text-ink-700">
            <p>
              <span className="font-bold">الاسم: </span>
              {accountName.trim() || '—'}
            </p>
            <p className="mt-1" dir="ltr">
              <span className="font-bold">رقم الهاتف: </span>
              {accountPhone?.trim() || '—'}
            </p>
            {!accountPhone?.trim() ? (
              <p className="mt-2 text-xs font-semibold text-warning-800">
                حسابك لا يحتوي على رقم هاتف. اختر بيانات تواصل مختلفة أو حدّث
                ملفك الشخصي.
              </p>
            ) : null}
            {fieldErrors.phone ? (
              <p className="mt-2 text-xs font-semibold text-danger-700">
                {fieldErrors.phone}
              </p>
            ) : null}
          </div>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e5e5e5] bg-white p-4">
          <input
            type="radio"
            name="contact-source"
            className="mt-1"
            checked={contact.contactSource === 'CUSTOM'}
            onChange={() =>
              setContact({
                ...contact,
                contactSource: 'CUSTOM',
                contactType:
                  contact.contactType === 'OWNER' ? 'AGENT' : contact.contactType,
              })
            }
          />
          <span>
            <span className="block text-sm font-extrabold text-ink-900">
              {listingCopy.contactCustomMode}
            </span>
            <span className="mt-1 block text-sm text-ink-600">
              وسيط أو شركة أو رقم مختلف عن حسابك.
            </span>
          </span>
        </label>
      </fieldset>

      {contact.contactSource === 'CUSTOM' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              {listingCopy.contactName}
            </label>
            <input
              id="contact-name"
              className={inputClass}
              value={contact.contactName}
              onChange={(e) => setField('contactName', e.target.value)}
              disabled={pending}
            />
            {fieldErrors.contactName ? (
              <p className="mt-1 text-xs font-semibold text-danger-700">
                {fieldErrors.contactName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-type"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              {listingCopy.contactType}
            </label>
            <select
              id="contact-type"
              className={inputClass}
              value={contact.contactType}
              onChange={(e) =>
                setField('contactType', e.target.value as ListingContactType)
              }
              disabled={pending}
            >
              {CONTACT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              {listingCopy.contactPhone}
            </label>
            <input
              id="contact-phone"
              className={inputClass}
              value={contact.phone}
              onChange={(e) => setField('phone', e.target.value)}
              disabled={pending}
              dir="ltr"
            />
            {fieldErrors.phone ? (
              <p className="mt-1 text-xs font-semibold text-danger-700">
                {fieldErrors.phone}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-whatsapp"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              {listingCopy.contactWhatsapp}
            </label>
            <input
              id="contact-whatsapp"
              className={inputClass}
              value={contact.whatsapp}
              onChange={(e) => setField('whatsapp', e.target.value)}
              disabled={pending}
              dir="ltr"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              {listingCopy.contactEmail}
            </label>
            <input
              id="contact-email"
              type="email"
              className={inputClass}
              value={contact.email}
              onChange={(e) => setField('email', e.target.value)}
              disabled={pending}
              dir="ltr"
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-xs font-semibold text-danger-700">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          getButtonClassName({
            className:
              'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
          }),
          pending && 'opacity-70',
        )}
      >
        {pending ? 'جارٍ الحفظ…' : listingCopy.continue}
      </button>
    </form>
  );
}
