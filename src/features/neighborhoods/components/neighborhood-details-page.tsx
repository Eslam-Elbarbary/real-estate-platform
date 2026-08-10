import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { TransactionType } from '@/types';
import { neighborhoodCopy } from '../config';
import type { NeighborhoodDetailsView } from '../types';
import { NeighborhoodAbout } from './neighborhood-about';
import { NeighborhoodAnnualChangeCard } from './neighborhood-annual-change';
import { NeighborhoodBreadcrumb } from './neighborhood-breadcrumb';
import { NeighborhoodBrokers } from './neighborhood-brokers';
import { NeighborhoodChildGrid } from './neighborhood-child-grid';
import { NeighborhoodFaq } from './neighborhood-faq';
import { NeighborhoodHero } from './neighborhood-hero';
import { NeighborhoodPriceSummary } from './neighborhood-price-summary';
import { NeighborhoodPropertyLinks } from './neighborhood-property-links';
import { NeighborhoodRatingsSection } from './neighborhood-ratings';
import { NeighborhoodShare } from './neighborhood-share';

interface NeighborhoodDetailsPageProps {
  view: NeighborhoodDetailsView;
  transaction: TransactionType;
  shareUrl: string;
}

export function NeighborhoodDetailsPage({
  view,
  transaction,
  shareUrl,
}: NeighborhoodDetailsPageProps) {
  const { neighborhood, children } = view;
  const heroImage =
    neighborhood.heroImage ?? neighborhood.coverImage ?? neighborhood.cardImage;
  const showRegionLayout = children.length > 0;
  const showAreaLayout = !showRegionLayout;

  return (
    <div className="bg-white pb-16">
      {showRegionLayout && heroImage ? (
        <div className="border-b border-[#eee] bg-surface-50">
          <Container neighborhood className="py-6">
            <NeighborhoodHero name={neighborhood.nameAr} image={heroImage} />
          </Container>
        </div>
      ) : null}

      <Container neighborhood className="pt-6">
        <NeighborhoodBreadcrumb items={neighborhood.breadcrumb} />

        <p className="mt-3 text-xs font-semibold text-ink-400">
          {neighborhoodCopy.demoDisclaimer}
        </p>

        <div className="mt-8 space-y-12">
          {showRegionLayout ? (
            <NeighborhoodChildGrid items={children} />
          ) : null}

          {showAreaLayout ? (
            <>
              {neighborhood.priceStats.length ? (
                <NeighborhoodPriceSummary
                  name={neighborhood.nameAr}
                  pathSegments={neighborhood.pathSegments}
                  priceStats={neighborhood.priceStats}
                />
              ) : null}

              {neighborhood.annualChange ? (
                <NeighborhoodAnnualChangeCard
                  name={neighborhood.nameAr}
                  change={neighborhood.annualChange}
                />
              ) : null}

              {neighborhood.ratings ? (
                <NeighborhoodRatingsSection
                  name={neighborhood.nameAr}
                  ratings={neighborhood.ratings}
                />
              ) : null}

              {neighborhood.description ? (
                <NeighborhoodAbout
                  name={neighborhood.nameAr}
                  description={neighborhood.description}
                  image={neighborhood.coverImage ?? neighborhood.heroImage}
                />
              ) : null}

              <NeighborhoodShare name={neighborhood.nameAr} url={shareUrl} />

              {neighborhood.brokers?.length ? (
                <NeighborhoodBrokers
                  name={neighborhood.nameAr}
                  brokers={neighborhood.brokers}
                />
              ) : null}

              {neighborhood.faq?.length ? (
                <NeighborhoodFaq items={neighborhood.faq} />
              ) : null}
            </>
          ) : null}

          {(neighborhood.relatedPropertyLinks?.length ?? 0) > 0 ? (
            <NeighborhoodPropertyLinks
              title={`${neighborhoodCopy.propertiesInPrefix} ${neighborhood.nameAr}`}
              links={neighborhood.relatedPropertyLinks ?? []}
              transaction={transaction}
              basePath={routes.neighborhood.details(...neighborhood.pathSegments)}
            />
          ) : null}
        </div>
      </Container>
    </div>
  );
}

export function neighborhoodDetailsMetadataTitle(name: string) {
  return `أسعار العقارات في ${name} | ${siteConfig.name}`;
}
