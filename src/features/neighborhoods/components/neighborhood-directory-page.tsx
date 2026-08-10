import { Star } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { TransactionType } from '@/types';
import { neighborhoodCopy } from '../config';
import type { NeighborhoodDirectoryView } from '../types';
import { NeighborhoodBreadcrumb } from './neighborhood-breadcrumb';
import { NeighborhoodCard } from './neighborhood-card';
import { NeighborhoodPropertyLinks } from './neighborhood-property-links';

interface NeighborhoodDirectoryPageProps {
  view: NeighborhoodDirectoryView;
  transaction: TransactionType;
}

export function NeighborhoodDirectoryPage({
  view,
  transaction,
}: NeighborhoodDirectoryPageProps) {
  return (
    <div className="bg-white pb-16 pt-6">
      <Container neighborhood>
        <NeighborhoodBreadcrumb
          items={[
            { label: neighborhoodCopy.breadcrumbHome, href: routes.home },
            {
              label: neighborhoodCopy.breadcrumbPrices,
              href: routes.neighborhood.root,
            },
          ]}
        />

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
              {neighborhoodCopy.directoryTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
              {neighborhoodCopy.directoryIntro}
            </p>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500">
            <Star className="size-3.5 text-accent-500" aria-hidden />
            {neighborhoodCopy.ratingScaleHint}
          </p>
        </div>

        <p className="mt-3 text-xs font-semibold text-ink-400">
          {neighborhoodCopy.demoDisclaimer}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {view.popular.map((item) => (
            <NeighborhoodCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-14">
          <NeighborhoodPropertyLinks
            title={neighborhoodCopy.citiesSectionTitle}
            links={view.cityLinks.map((link) => ({
              ...link,
              // Keep city directory links pointing to neighborhood pages
              label: link.label,
            }))}
            transaction={transaction}
            basePath={routes.neighborhood.root}
          />
        </div>
      </Container>
    </div>
  );
}

export function neighborhoodDirectoryMetadata() {
  return {
    title: `أسعار العقارات في مصر | ${siteConfig.name}`,
    description:
      'استكشف متوسط سعر المتر في المناطق والمدن المختلفة عبر دليل أسعار عقارات مصر التجريبي.',
    path: routes.neighborhood.root,
  };
}
