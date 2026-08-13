import { WEEKDAY_LABELS } from '../config';
import type {
  CalendarDayCell,
  ExhibitionEventPreview,
  RealEstateExhibition,
} from '../types';

export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function parseMonthKey(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function addMonths(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

/** Saturday-first index: Sat=0 … Fri=6 */
export function saturdayFirstIndex(date: Date): number {
  return (date.getDay() + 1) % 7;
}

export function startOfCalendarGrid(year: number, month: number): Date {
  const first = new Date(year, month - 1, 1);
  const leading = saturdayFirstIndex(first);
  const start = new Date(first);
  start.setDate(first.getDate() - leading);
  return start;
}

export function eventDates(event: RealEstateExhibition): string[] {
  const start = parseISODate(event.startDate);
  const end = event.endDate ? parseISODate(event.endDate) : start;
  if (!start || !end) return [event.startDate];
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    dates.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function formatMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('ar-EG', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

export function formatExhibitionDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTimeRange(start?: string, end?: string): string | undefined {
  if (!start) return undefined;
  const startLabel = formatClock(start);
  if (!end) return startLabel;
  return `${startLabel} - ${formatClock(end)}`;
}

export function formatExhibitionPlace(event: RealEstateExhibition): string | undefined {
  const parts = [event.venue ?? event.locationName, event.city].filter(Boolean);
  if (parts.length === 0) return undefined;
  return [...new Set(parts)].join(' — ');
}

export function toEventPreview(event: RealEstateExhibition): ExhibitionEventPreview {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    coverImage: event.coverImage,
    categoryLabel: event.categoryLabel,
    formattedDate: formatExhibitionDate(event.startDate),
    formattedTime: formatTimeRange(event.startTime, event.endTime),
  };
}

export function buildCalendarDays(
  year: number,
  month: number,
  eventsByDate: Map<string, ExhibitionEventPreview[]>,
  todayIso: string,
  queriedDate?: string,
): CalendarDayCell[] {
  const start = startOfCalendarGrid(year, month);
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = toISODate(date);
    return {
      iso,
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month - 1,
      isToday: iso === todayIso,
      isQueriedDate: queriedDate === iso,
      events: eventsByDate.get(iso) ?? [],
    };
  });

  const lastWeek = days.slice(35);
  if (lastWeek.every((cell) => !cell.inCurrentMonth)) {
    return days.slice(0, 35);
  }
  return days;
}

function formatClock(value: string): string {
  const [hoursRaw, minutesRaw] = value.split(':');
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? '00';
  if (!Number.isFinite(hours)) return value;
  const period = hours >= 12 ? 'م' : 'ص';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${period}`;
}

export { WEEKDAY_LABELS };
