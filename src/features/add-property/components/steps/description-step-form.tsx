'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { saveDescriptionStepAction } from '../../actions';
import { listingCopy } from '../../config';
import { generateListingCopy } from '../../lib/copy-generator';
import type { ListingDraft, LocalizedListingDescription } from '../../types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';
const textareaClass =
  'min-h-32 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

interface DescriptionStepFormProps {
  draft: ListingDraft;
}

export function DescriptionStepForm({ draft }: DescriptionStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [ar, setAr] = useState<LocalizedListingDescription>(draft.description.ar);
  const [en, setEn] = useState<LocalizedListingDescription>(draft.description.en);

  function autoGenerate() {
    const generated = generateListingCopy(draft, locale);
    if (locale === 'ar') setAr(generated);
    else setEn(generated);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveDescriptionStepAction(draft.id, { ar, en });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  const current = locale === 'ar' ? ar : en;
  const setCurrent = locale === 'ar' ? setAr : setEn;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div role="tablist" aria-label="لغة الوصف" className="inline-flex rounded-lg border border-[#e5e5e5] bg-surface-50 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={locale === 'ar'}
          onClick={() => setLocale('ar')}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-bold',
            locale === 'ar' ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-600',
          )}
        >
          {listingCopy.arTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={locale === 'en'}
          onClick={() => setLocale('en')}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-bold',
            locale === 'en' ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-600',
          )}
        >
          {listingCopy.enTab}
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={autoGenerate}
          className="text-sm font-bold text-brand-600 hover:underline"
        >
          {locale === 'ar' ? listingCopy.autoGenerate : listingCopy.autoGenerateEn}
        </button>
      </div>

      <div>
        <label
          htmlFor="listing-title"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {locale === 'ar' ? listingCopy.listingNameAr : listingCopy.listingNameEn}
        </label>
        <input
          id="listing-title"
          value={current.title}
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          className={inputClass}
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        />
      </div>

      <div>
        <label
          htmlFor="listing-desc"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {locale === 'ar' ? listingCopy.listingDescAr : listingCopy.listingDescEn}
        </label>
        <textarea
          id="listing-desc"
          value={current.description}
          onChange={(e) =>
            setCurrent({ ...current, description: e.target.value })
          }
          className={textareaClass}
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        />
      </div>

      <div>
        <label
          htmlFor="listing-address"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {locale === 'ar'
            ? listingCopy.listingAddressAr
            : listingCopy.listingAddressEn}
        </label>
        <input
          id="listing-address"
          value={current.address}
          onChange={(e) => setCurrent({ ...current, address: e.target.value })}
          className={inputClass}
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        />
      </div>

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={getButtonClassName({
          className: 'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.continue}
      </button>
    </form>
  );
}
