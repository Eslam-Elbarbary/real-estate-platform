'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { routes } from '@/config/routes';
import { myPropertiesCopy } from '../config/copy';

export function ProfileCompletionAlert() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      role="status"
      className="border-b border-danger-200 bg-[#fce4ec] px-4 py-2.5 text-sm text-danger-700"
    >
      <div className="mx-auto flex max-w-[min(100%,var(--container-dashboard))] items-center justify-between gap-3 px-2 sm:px-0">
        <p className="leading-6">
          {myPropertiesCopy.profileAlert}{' '}
          <Link
            href={routes.account.profile}
            className="font-bold underline underline-offset-2"
          >
            {myPropertiesCopy.profileAlertCta}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
          aria-label="إغلاق التنبيه"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
