'use client';

import { useEffect, useRef } from 'react';
import { startListingDraftAction } from '@/features/add-property/actions';

interface StartListingClientProps {
  initialError?: string;
}

export function StartListingClient({ initialError }: StartListingClientProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialError) return;
    formRef.current?.requestSubmit();
  }, [initialError]);

  if (initialError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {initialError}
        </p>
        <form action={startListingDraftAction}>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
          >
            إعادة المحاولة
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <form ref={formRef} action={startListingDraftAction}>
        <p className="text-sm font-semibold text-ink-600" role="status">
          جاري إنشاء مسودة الإعلان...
        </p>
        <button type="submit" className="sr-only">
          متابعة
        </button>
      </form>
    </div>
  );
}
