'use client';

import { useEffect, useId, useRef } from 'react';
import type { ExhibitionEventPreview } from '../types';
import { useCalendarPopover } from './calendar-popover-provider';
import { ExhibitionPreviewPopover } from './exhibition-preview-popover';

interface CalendarEventChipProps {
  event: ExhibitionEventPreview;
  instanceId: string;
}

export function CalendarEventChip({ event, instanceId }: CalendarEventChipProps) {
  const popoverId = useId();
  const { open, setOpen } = useCalendarPopover(instanceId);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current && !open) {
      buttonRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        data-testid={`calendar-event-chip-${event.slug}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen(!open)}
        className="block w-full truncate rounded-[3px] bg-accent-500 px-1.5 py-0.5 text-start text-[11px] font-bold leading-5 text-white hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {event.title}
      </button>
      {open ? (
        <ExhibitionPreviewPopover
          id={popoverId}
          event={event}
          anchorRef={buttonRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
