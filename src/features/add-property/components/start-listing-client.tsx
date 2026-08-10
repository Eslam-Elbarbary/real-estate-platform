'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { createListingDraftAction } from '@/features/add-property/actions';

export function StartListingClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await createListingDraftAction();
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        router.replace(routes.myProperties);
        return;
      }
      router.replace(result.data.href);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm font-semibold text-ink-600" role="status">
        {error ?? 'جاري إنشاء مسودة الإعلان...'}
      </p>
    </div>
  );
}
