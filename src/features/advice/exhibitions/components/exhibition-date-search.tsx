import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { exhibitionCopy } from '../config';

interface ExhibitionDateSearchProps {
  queriedDate?: string;
  queriedDateHasEvents: boolean;
}

export function ExhibitionDateSearch({
  queriedDate,
  queriedDateHasEvents,
}: ExhibitionDateSearchProps) {
  return (
    <div className="mt-6" data-testid="exhibition-date-search">
      <form
        method="get"
        action={routes.advice.exhibitions.root}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1.5 text-sm sm:max-w-xs">
          <span className="font-medium text-ink-800">{exhibitionCopy.dateLabel}</span>
          <input
            type="date"
            name="date"
            defaultValue={queriedDate}
            className="h-11 w-full rounded-md border border-border bg-white px-3 text-ink-900 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            dir="ltr"
          />
        </label>
        <Button type="submit" size="large">
          {exhibitionCopy.search}
        </Button>
      </form>
      {queriedDate && !queriedDateHasEvents ? (
        <p
          className="mt-3 text-sm font-semibold text-ink-600"
          role="status"
          data-testid="date-search-empty"
        >
          {exhibitionCopy.noEventsOnDate}
        </p>
      ) : null}
    </div>
  );
}
