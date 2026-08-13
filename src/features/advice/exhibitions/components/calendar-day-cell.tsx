import { cn } from '@/lib/utils/cn';
import type { CalendarDayCell as CalendarDayCellModel } from '../types';
import { CalendarEventChip } from './calendar-event-chip';

interface CalendarDayCellProps {
  day: CalendarDayCellModel;
}

export function CalendarDayCell({ day }: CalendarDayCellProps) {
  return (
    <div
      className={cn(
        'relative min-h-[7.25rem] border-b border-e border-[#e6e6e6] bg-white p-1.5 sm:min-h-[8.25rem]',
        !day.inCurrentMonth && 'bg-[#fcfcfc]',
      )}
      data-date={day.iso}
      data-testid={day.isQueriedDate ? 'queried-date-cell' : undefined}
    >
      <div className="flex justify-start">
        <span
          className={cn(
            'inline-flex size-7 items-center justify-center text-sm',
            day.inCurrentMonth ? 'font-semibold text-ink-900' : 'text-ink-400',
            (day.isToday || day.isQueriedDate) &&
              'rounded-full border border-brand-600 text-brand-700',
            day.isQueriedDate && 'bg-brand-50',
          )}
        >
          {day.day}
        </span>
      </div>
      <div className="mt-1 space-y-1">
        {day.events.map((event) => (
          <CalendarEventChip
            key={`${day.iso}-${event.id}`}
            event={event}
            instanceId={`${event.id}-${day.iso}`}
          />
        ))}
      </div>
    </div>
  );
}
