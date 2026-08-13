import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { routes } from '@/config/routes';
import { exhibitionCopy } from '../config';
import { buildExhibitionsPath } from '../search-params';
import type { ExhibitionCalendarView } from '../types';

interface CalendarToolbarProps {
  calendar: ExhibitionCalendarView;
}

export function CalendarToolbar({ calendar }: CalendarToolbarProps) {
  const isCurrentMonth = calendar.monthKey === calendar.todayMonthKey;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-lg font-extrabold text-ink-950" data-testid="calendar-month-label">
        {calendar.monthLabel}
      </p>
      <nav
        dir="ltr"
        aria-label="التنقل بين الأشهر"
        className="flex items-center gap-1"
      >
        <Link
          href={buildExhibitionsPath({ month: calendar.prevMonthKey })}
          className="inline-flex size-9 items-center justify-center rounded-md text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={exhibitionCopy.previousMonth}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
        <Link
          href={routes.advice.exhibitions.root}
          aria-current={isCurrentMonth ? 'page' : undefined}
          className="inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold text-ink-800 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {exhibitionCopy.today}
        </Link>
        <Link
          href={buildExhibitionsPath({ month: calendar.nextMonthKey })}
          className="inline-flex size-9 items-center justify-center rounded-md text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={exhibitionCopy.nextMonth}
        >
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      </nav>
    </div>
  );
}
