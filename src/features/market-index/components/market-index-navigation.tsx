import Link from 'next/link';
import { routes } from '@/config/routes';
import { marketIndexCopy } from '../config';
import { formatMarketIndexPeriod } from '../format';
import type { MarketIndexEntry } from '../types';

interface MarketIndexNavigationProps {
  previous: MarketIndexEntry | null;
  next: MarketIndexEntry | null;
}

export function MarketIndexNavigation({
  previous,
  next,
}: MarketIndexNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="التنقل بين الأشهر"
      data-testid="market-index-month-nav"
      className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#ececec] pt-6"
    >
      {previous ? (
        <Link
          href={routes.marketIndex.month(previous.year, previous.month)}
          className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {marketIndexCopy.previousMonth}
          <span className="mt-0.5 block text-xs font-medium text-ink-500">
            {formatMarketIndexPeriod(previous.year, previous.month)}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={routes.marketIndex.month(next.year, next.month)}
          className="ms-auto text-end text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {marketIndexCopy.nextMonth}
          <span className="mt-0.5 block text-xs font-medium text-ink-500">
            {formatMarketIndexPeriod(next.year, next.month)}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
