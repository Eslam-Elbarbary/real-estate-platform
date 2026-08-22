'use client';

import { useEffect, useRef } from 'react';
import { startListingDraftAction } from '@/features/add-property/actions';

export function StartListingClient() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

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
