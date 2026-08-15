import { Container } from '@/components/ui/container';
import { marketIndexCopy } from '../config';
import type { MarketIndexListResult } from '../types';
import { MarketIndexCard } from './market-index-card';
import { MarketIndexEmptyState } from './market-index-empty-state';
import { MarketIndexHeader } from './market-index-header';
import { MarketIndexPagination } from './market-index-pagination';
import { MarketIndexSidebar } from './market-index-sidebar';

interface MarketIndexPageProps {
  result: MarketIndexListResult;
}

export function MarketIndexPage({ result }: MarketIndexPageProps) {
  return (
    <div className="bg-white pb-16 pt-5">
      <Container marketIndex>
        <MarketIndexHeader />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 lg:order-1">
            {result.items.length ? (
              <section aria-label="تقارير المؤشر الشهرية">
                {result.items.map((entry) => (
                  <MarketIndexCard key={entry.id} entry={entry} />
                ))}
              </section>
            ) : (
              <MarketIndexEmptyState year={result.filters.year} />
            )}
            <MarketIndexPagination
              filters={result.filters}
              page={result.page}
              totalPages={result.totalPages}
            />
          </div>

          <div className="lg:order-2">
            <MarketIndexSidebar
              archive={result.archive}
              filters={result.filters}
              activeYear={result.filters.year}
            />
          </div>
        </div>

        <p className="mt-10 text-xs font-semibold text-ink-400">
          {marketIndexCopy.disclaimer}
        </p>
      </Container>
    </div>
  );
}
