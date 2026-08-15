import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { routes } from '@/config/routes';
import { formatDate } from '@/lib/formatting/date';
import { marketIndexCopy } from '../config';
import type { MarketIndexDetailsView } from '../types';
import { MarketIndexChart, MarketIndexValue } from './market-index-chart';
import { MarketIndexNavigation } from './market-index-navigation';
import { MarketIndexSidebar } from './market-index-sidebar';

interface MarketIndexMonthPageProps {
  view: MarketIndexDetailsView;
}

export function MarketIndexMonthPage({ view }: MarketIndexMonthPageProps) {
  const { entry, previous, next, archive } = view;

  return (
    <div className="bg-white pb-16 pt-5">
      <Container marketIndex>
        <AdviceBreadcrumb
          items={[
            { label: marketIndexCopy.breadcrumbHome, href: routes.home },
            { label: marketIndexCopy.breadcrumbKnow, href: routes.advice.root },
            { label: marketIndexCopy.breadcrumbIndex, href: routes.marketIndex.root },
            {
              label: entry.title,
              href: routes.marketIndex.month(entry.year, entry.month),
            },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-snug text-ink-950 sm:text-[1.85rem]">
              {entry.title}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {marketIndexCopy.publishedLabel}{' '}
              <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
            </p>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <MarketIndexValue entry={entry} />
              <div className="min-w-0 flex-1">
                <MarketIndexChart entry={entry} />
              </div>
            </div>

            <div className="mt-8 max-w-3xl space-y-4 text-[15px] leading-8 text-ink-700">
              {entry.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <MarketIndexNavigation previous={previous} next={next} />

            <Link
              href={routes.marketIndex.root}
              className="mt-8 inline-flex text-sm font-semibold text-brand-700 hover:underline"
            >
              {marketIndexCopy.backToIndex}
            </Link>
          </article>

          <MarketIndexSidebar
            archive={archive}
            activeYear={entry.year}
            activeMonth={entry.month}
          />
        </div>

        <p className="mt-10 text-xs font-semibold text-ink-400">
          {marketIndexCopy.disclaimer}
        </p>
      </Container>
    </div>
  );
}
