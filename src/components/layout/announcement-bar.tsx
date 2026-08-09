'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { uiLabels } from '@/config/labels';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-announce text-white">
      <div className="relative mx-auto flex min-h-8 max-w-[min(100%,var(--container-max))] items-center justify-center px-10 py-1.5 text-center text-xs sm:text-[13px]">
        <p className="leading-5">{uiLabels.announcement}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute end-3 inline-flex size-7 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label={uiLabels.closeAnnouncement}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
