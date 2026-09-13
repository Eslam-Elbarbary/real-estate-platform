'use client';

import { useEffect } from 'react';
import { uiLabels } from '@/config/labels';

interface ListingDetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ListingDetailsError({
  error,
  reset,
}: ListingDetailsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">
        {uiLabels.listingErrorTitle}
      </h1>
      <p className="text-sm leading-7 text-ink-600 sm:text-base">
        {uiLabels.listingErrorBody}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
      >
        {uiLabels.listingErrorRetry}
      </button>
    </div>
  );
}
