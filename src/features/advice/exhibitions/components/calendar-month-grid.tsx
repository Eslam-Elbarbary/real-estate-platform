import type { ExhibitionCalendarView } from '../types';
import { CalendarDayCell } from './calendar-day-cell';
import { CalendarPopoverProvider } from './calendar-popover-provider';

interface CalendarMonthGridProps {
  calendar: ExhibitionCalendarView;
}

export function CalendarMonthGrid({ calendar }: CalendarMonthGridProps) {
  return (
    <CalendarPopoverProvider>
      <div
        className="min-w-[44rem] border-s border-t border-[#e6e6e6]"
        data-testid="calendar-month-grid"
      >
        <div className="grid grid-cols-7">
          {calendar.weekdayLabels.map((label) => (
            <div
              key={label}
              className="border-b border-e border-[#e6e6e6] bg-white px-2 py-2.5 text-center text-sm font-bold text-ink-800"
            >
              {label}
            </div>
          ))}
          {calendar.days.map((day) => (
            <CalendarDayCell key={day.iso} day={day} />
          ))}
        </div>
      </div>
    </CalendarPopoverProvider>
  );
}
