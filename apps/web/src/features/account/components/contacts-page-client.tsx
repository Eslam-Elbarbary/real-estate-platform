'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import { EgyptFlag } from '@/components/layout/egypt-flag';
import { getButtonClassName } from '@/components/ui/button';
import {
  addContactPhoneAction,
  removeContactPhoneAction,
  setWhatsAppEnabledAction,
} from '../actions';
import { accountCopy } from '../config/account-nav';
import type { AdvertisingContactPhone } from '../types';
import { AccountModal } from './account-modal';
import { AccountSection } from './account-primitives';

interface ContactsPageClientProps {
  contacts: AdvertisingContactPhone[];
}

export function ContactsPageClient({ contacts }: ContactsPageClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const phoneInputId = useId();

  function handleAdd() {
    startTransition(async () => {
      setError(null);
      const result = await addContactPhoneAction(phone);
      if (!result.ok) {
        setError(
          result.fieldErrors?.phone ?? result.error ?? 'تعذر إضافة الرقم',
        );
        return;
      }
      setOpen(false);
      setPhone('');
      router.refresh();
    });
  }

  function handleToggle(id: string, enabled: boolean) {
    startTransition(async () => {
      await setWhatsAppEnabledAction(id, enabled);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await removeContactPhoneAction(id);
      router.refresh();
    });
  }

  return (
    <>
      <AccountSection
        title={accountCopy.contactsTitle}
        description={accountCopy.contactsDescription}
        action={
          <button
            type="button"
            onClick={() => {
              setError(null);
              setOpen(true);
            }}
            className={getButtonClassName({
              className: 'h-10 min-w-[5.5rem] rounded-lg font-bold',
            })}
            data-testid="add-phone-open"
          >
            {accountCopy.add}
          </button>
        }
      >
        <div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
          <div className="border-b border-[#e5e5e5] px-5 py-4 sm:px-6">
            <h3 className="text-sm font-extrabold text-ink-950">
              {accountCopy.adNumbersHeading}
            </h3>
          </div>
          <ul className="divide-y divide-[#e5e5e5]">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
              >
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <p
                    className="text-sm font-semibold text-ink-900"
                    dir="ltr"
                  >
                    {contact.e164}
                  </p>
                  <label className="inline-flex items-center gap-2 text-xs text-ink-700">
                    <FaWhatsapp
                      className="size-4 text-[#25D366]"
                      aria-hidden
                    />
                    <span>{accountCopy.whatsappToggleLabel}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={contact.whatsappEnabled}
                      aria-label={accountCopy.whatsappToggleLabel}
                      disabled={pending}
                      onClick={() =>
                        handleToggle(contact.id, !contact.whatsappEnabled)
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        contact.whatsappEnabled
                          ? 'bg-[#25D366]'
                          : 'bg-surface-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start] ${
                          contact.whatsappEnabled
                            ? 'inset-inline-start-[1.375rem]'
                            : 'inset-inline-start-0.5'
                        }`}
                      />
                    </button>
                  </label>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(contact.id)}
                  className="inline-flex size-9 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-danger-50 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={accountCopy.deletePhone}
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </AccountSection>

      <AccountModal
        open={open}
        title={accountCopy.addPhoneTitle}
        onClose={() => setOpen(false)}
      >
        <label
          htmlFor={phoneInputId}
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          {accountCopy.phoneLabel}
        </label>
        <div className="flex overflow-hidden rounded-md border border-border focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
          <span className="inline-flex items-center gap-1.5 border-e border-border bg-surface-50 px-3 text-sm text-ink-700">
            <EgyptFlag className="size-4" />
            <span dir="ltr">{accountCopy.countryPrefix}</span>
          </span>
          <input
            id={phoneInputId}
            data-testid="add-phone-input"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="1000000000"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-11 flex-1 bg-white px-3 text-sm text-ink-900 outline-none"
            aria-invalid={Boolean(error)}
          />
        </div>
        {error ? (
          <p className="mt-2 text-sm text-danger-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          data-testid="add-phone-save"
          disabled={pending}
          onClick={handleAdd}
          className={getButtonClassName({
            className: 'mt-5 h-11 w-full font-bold',
          })}
        >
          {accountCopy.save}
        </button>
      </AccountModal>
    </>
  );
}
