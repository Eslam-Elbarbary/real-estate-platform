import Link from 'next/link';
import { marketIndexCopy } from '../config';
import { buildMarketIndexPath } from '../search-params';

interface MarketIndexEmptyStateProps {
  year?: number;
}

export function MarketIndexEmptyState({ year }: MarketIndexEmptyStateProps) {
  return (
    <div className="border-y border-border py-12 text-center">
      <h2 className="text-base font-bold text-ink-900">{marketIndexCopy.emptyTitle}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-600">
        {marketIndexCopy.emptyDescription}
        {year ? ` (${year})` : null}
      </p>
      <Link
        href={buildMarketIndexPath({ page: 1 })}
        className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:underline"
      >
        {marketIndexCopy.backToIndex}
      </Link>
    </div>
  );
}
