import Link from 'next/link';
import { routes } from '@/config/routes';
import { marketIndexCopy } from '../config';
import type { MarketIndexArchiveGroup, MarketIndexFilters } from '../types';
import { MarketIndexAbout } from './market-index-about';
import { MarketIndexArchive } from './market-index-archive';

interface MarketIndexSidebarProps {
  archive: MarketIndexArchiveGroup[];
  filters?: MarketIndexFilters;
  activeYear?: number;
  activeMonth?: number;
}

export function MarketIndexSidebar({
  archive,
  filters,
  activeYear,
  activeMonth,
}: MarketIndexSidebarProps) {
  return (
    <aside className="space-y-10 lg:sticky lg:top-24">
      <MarketIndexAbout />
      <MarketIndexArchive
        groups={archive}
        filters={filters}
        activeYear={activeYear}
        activeMonth={activeMonth}
      />
      <section aria-labelledby="market-index-related-heading">
        <h2
          id="market-index-related-heading"
          className="text-sm font-extrabold text-ink-950"
        >
          {marketIndexCopy.relatedHeading}
        </h2>
        <ul className="mt-2 space-y-1.5 text-[13px]">
          <li>
            <Link
              href={routes.neighborhood.root}
              className="text-brand-700 hover:underline"
            >
              أسعار العقارات حسب المنطقة
            </Link>
          </li>
          <li>
            <Link
              href={routes.advice.index.root}
              className="text-brand-700 hover:underline"
            >
              نصائح عقارية
            </Link>
          </li>
          <li>
            <Link
              href={routes.valuation.root}
              className="text-brand-700 hover:underline"
            >
              تقييم عقاري
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  );
}
