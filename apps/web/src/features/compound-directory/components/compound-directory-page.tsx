import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { CompoundSearchFilters, CompoundSearchResult } from '@/types';
import { CompoundCard } from './compound-card';
import { CompoundEmptyState } from './empty-state';
import { CompoundFiltersSidebar } from './compound-filters-sidebar';
import { CompoundPagination } from './pagination';
import { CompoundSortControl } from './sort-control';
import { DirectoryPromo } from './directory-promo';
import { LocationChips } from './location-chips';
import { MobileFiltersSheet } from './mobile-filters-sheet';

interface CompoundDirectoryPageProps {
  filters: CompoundSearchFilters;
  result: CompoundSearchResult;
}

export function CompoundDirectoryPage({
  filters,
  result,
}: CompoundDirectoryPageProps) {
  const displayCount = result.marketEstimate ?? result.total;

  return (
    <Container directory className="pb-10 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="مسار التنقل" className="text-xs text-ink-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href={routes.home}
                className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
              >
                <Home className="size-3.5" aria-hidden />
                {siteConfig.name}
              </Link>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ChevronLeft className="size-3.5 text-ink-400" aria-hidden />
              <span className="font-medium text-ink-700">
                {uiLabels.compoundsDirectoryBreadcrumb}
              </span>
            </li>
          </ol>
        </nav>
        <CompoundSortControl filters={filters} />
      </div>

      <h1 className="mt-3 text-xl font-bold leading-8 text-ink-900 sm:text-[1.5rem]">
        {uiLabels.compoundsDirectoryTitlePrefix} -{' '}
        {displayCount.toLocaleString('ar-EG')}{' '}
        {uiLabels.compoundsDirectoryTitleSuffix}
      </h1>

      <div className="mt-3.5">
        <LocationChips
          filters={filters}
          aggregations={result.aggregations}
        />
      </div>

      <div className="mt-4 lg:hidden">
        <MobileFiltersSheet
          filters={filters}
          aggregations={result.aggregations}
        />
      </div>

      {/* RTL: first column renders on the right → sidebar, then results. */}
      <div className="mt-5 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height-lg)+0.75rem)] rounded-lg border border-border bg-white px-3.5 py-2.5">
            <CompoundFiltersSidebar
              filters={filters}
              aggregations={result.aggregations}
            />
          </div>
        </div>

        <div className="min-w-0">
          {result.items.length ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {result.items.map((compound) => (
                  <CompoundCard key={compound.id} compound={compound} />
                ))}
              </div>
              <CompoundPagination
                filters={filters}
                page={result.page}
                totalPages={result.totalPages}
                className="mt-6"
              />
            </>
          ) : (
            <CompoundEmptyState filters={filters} />
          )}
        </div>
      </div>

      <DirectoryPromo />
    </Container>
  );
}
