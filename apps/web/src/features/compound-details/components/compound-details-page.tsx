import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft, Home, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { CompoundUnitInventory } from '@/features/compounds';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import type { Compound, CompoundGalleryImage } from '@/types';
import { CompoundContent } from './compound-content';
import { CompoundDeveloperSection } from './compound-developer-section';
import { CompoundFaqSection } from './compound-faq-section';
import { CompoundGallery } from './compound-gallery';
import { CompoundGuideBanner } from './compound-guide-banner';
import { CompoundLocationMap } from './compound-location-map';
import { CompoundRecommendationCard } from './compound-recommendation-card';
import { CompoundSidebarActions } from './compound-sidebar-actions';
import { CompoundUnitsSection } from './compound-units-section';

interface CompoundDetailsPageProps {
  compound: Compound;
  inventory: CompoundUnitInventory;
}

function toGallery(compound: Compound): CompoundGalleryImage[] {
  if (compound.gallery?.length) {
    return [...compound.gallery].sort((a, b) => a.order - b.order);
  }

  return [...compound.images]
    .sort((a, b) => a.order - b.order)
    .map((image) => ({
      id: image.id,
      src: image.url,
      alt: image.alt,
      order: image.order,
    }));
}

export function CompoundDetailsPage({
  compound,
  inventory,
}: CompoundDetailsPageProps) {
  const title = compound.nameEn
    ? `${compound.nameEn} - ${compound.nameAr}`
    : compound.nameAr || compound.name;
  const locationLabel = [compound.areaName, compound.cityName]
    .filter(Boolean)
    .join(' - ');
  const gallery = toGallery(compound);
  const starting =
    compound.startingPrice ?? compound.minPrice ?? undefined;
  const developer = compound.developer ?? {
    id: compound.developerId,
    name: compound.developerName,
    slug: compound.developerId.replace(/^dev-/, ''),
    logoUrl: compound.developerLogo,
    projectsCount: compound.developerProjectCount,
  };

  return (
    <Container
      compoundDetails
      className="pb-10 pt-4"
      data-compound-details="true"
    >
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
            <Link
              href={routes.compounds.root}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {uiLabels.compoundDetailsBreadcrumbCompounds}
            </Link>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <ChevronLeft className="size-3.5 text-ink-400" aria-hidden />
            <span className="font-medium text-ink-700">{title}</span>
          </li>
        </ol>
      </nav>

      {/* RTL: gallery first (right), sidebar second (left). */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,32%)] lg:gap-7">
        <div className="min-w-0">
          <CompoundGallery images={gallery} title={title} />

          <div className="mt-4">
            <p className="text-[12px] text-ink-500">
              {uiLabels.compoundDetailsCategory}
              {' • '}
              {formatDate(compound.updatedAt)}
            </p>
            <h1 className="mt-1.5 text-xl font-bold leading-8 text-ink-900 sm:text-[1.65rem]">
              {title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-600">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span>{locationLabel}</span>
              {compound.verified ? (
                <span className="ms-2 rounded border border-success-700/20 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-success-700">
                  {uiLabels.compoundDetailsVerified}
                </span>
              ) : null}
            </p>
            {starting !== undefined ? (
              <p className="mt-2 text-[15px] font-semibold text-ink-950">
                <span className="me-1 font-medium text-ink-600">
                  {uiLabels.compoundsStartsFrom}
                </span>
                {formatCurrency(starting, compound.currency)}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="min-w-0 space-y-3 lg:pt-0">
          <CompoundSidebarActions
            title={title}
            phone={compound.phone}
            whatsapp={compound.whatsapp}
            brochureUrl={compound.brochureUrl}
          />
          {compound.recommendation ? (
            <CompoundRecommendationCard
              projectName={title}
              recommendation={compound.recommendation}
            />
          ) : null}
        </aside>
      </div>

      {inventory.availableViews.length ? (
        <Suspense
          fallback={
            <div className="mt-10 h-40 animate-pulse rounded-lg bg-surface-100" />
          }
        >
          <CompoundUnitsSection inventory={inventory} className="mt-10" />
        </Suspense>
      ) : null}

      <CompoundContent
        sections={compound.contentSections ?? []}
        fallbackDescription={compound.description}
        className="mt-10"
      />

      <CompoundLocationMap
        latitude={compound.latitude}
        longitude={compound.longitude}
        className="mt-10"
      />

      <CompoundDeveloperSection developer={developer} className="mt-10" />

      {compound.faq?.length ? (
        <CompoundFaqSection items={compound.faq} className="mt-10" />
      ) : null}

      <CompoundGuideBanner className="mt-10" />
    </Container>
  );
}
