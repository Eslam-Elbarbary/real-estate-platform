import Link from 'next/link';
import { routes } from '@/config/routes';
import { formatDate } from '@/lib/formatting/date';
import { marketIndexCopy } from '../config';
import type { MarketIndexEntry } from '../types';
import { MarketIndexChart, MarketIndexValue } from './market-index-chart';

interface MarketIndexCardProps {
  entry: MarketIndexEntry;
}

export function MarketIndexCard({ entry }: MarketIndexCardProps) {
  const href = routes.marketIndex.month(entry.year, entry.month);

  return (
    <article
      data-testid={`market-index-card-${entry.year}-${entry.month}`}
      className="border-b border-[#ececec] py-10 first:pt-2"
    >
      <h2 className="text-xl font-extrabold text-ink-950 sm:text-[1.35rem]">
        <Link
          href={href}
          className="hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {entry.title}
        </Link>
      </h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <MarketIndexValue entry={entry} />
        <div className="min-w-0 flex-1">
          <MarketIndexChart entry={entry} compact />
        </div>
      </div>

      <div className="mt-5 max-w-3xl space-y-3 text-sm leading-7 text-ink-600">
        {entry.content.slice(0, 2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={href}
          className="text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {marketIndexCopy.readFull}
        </Link>
        <p className="text-xs text-ink-400">
          {marketIndexCopy.publishedLabel}{' '}
          <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
        </p>
      </div>
    </article>
  );
}
