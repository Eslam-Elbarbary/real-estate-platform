import type { ExhibitionCalendarView } from '../types';
import { CalendarMonthGrid } from './calendar-month-grid';
import { CalendarToolbar } from './calendar-toolbar';

interface ExhibitionsCalendarProps {
  calendar: ExhibitionCalendarView;
}

export function ExhibitionsCalendar({ calendar }: ExhibitionsCalendarProps) {
  return (
    <section className="mt-6" aria-labelledby="exhibitions-calendar-heading" data-testid="exhibitions-calendar">
      <h2 id="exhibitions-calendar-heading" className="sr-only">
        تقويم المعارض لشهر {calendar.monthLabel}
      </h2>
      <CalendarToolbar calendar={calendar} />
      <div className="overflow-x-auto">
        <CalendarMonthGrid calendar={calendar} />
      </div>
    </section>
  );
}
