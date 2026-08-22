import Link from 'next/link';
import { buildMarketIndexPath } from '../search-params';
import { marketIndexCopy } from '../config';
import type { MarketIndexArchiveGroup, MarketIndexFilters } from '../types';

interface MarketIndexArchiveProps {
  groups: MarketIndexArchiveGroup[];
  filters?: MarketIndexFilters;
  activeYear?: number;
  activeMonth?: number;
}

export function MarketIndexArchive({
  groups,
  filters,
  activeYear,
  activeMonth,
}: MarketIndexArchiveProps) {
  return (
    <section aria-labelledby="market-index-archive-heading">
      <h2
        id="market-index-archive-heading"
        className="text-sm font-extrabold text-ink-950"
      >
        {marketIndexCopy.archiveHeading}
      </h2>
      <div className="mt-3 space-y-4">
        {groups.map((group) => (
          <div key={group.year}>
            <Link
              href={buildMarketIndexPath({ year: group.year, page: 1 })}
              className="text-xs font-extrabold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {group.year}
            </Link>
            <ul className="mt-1.5 space-y-1">
              {group.items.map((item) => {
                const current =
                  item.year === activeYear && item.month === activeMonth;
                return (
                  <li key={`${item.year}-${item.month}`}>
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className={`block text-[13px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        current
                          ? 'font-bold text-ink-950'
                          : 'text-ink-600 hover:text-brand-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {filters?.year ? (
        <Link
          href={buildMarketIndexPath({ page: 1 })}
          className="mt-3 inline-flex text-xs font-semibold text-ink-500 hover:text-brand-700"
        >
          عرض كل السنوات
        </Link>
      ) : null}
    </section>
  );
}
