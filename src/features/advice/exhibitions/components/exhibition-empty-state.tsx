import { exhibitionCopy } from '../config';

export function ExhibitionEmptyState() {
  return (
    <p
      className="mt-5 text-sm font-semibold text-ink-500"
      role="status"
      data-testid="month-empty-state"
    >
      {exhibitionCopy.noEventsInMonth}
    </p>
  );
}
