import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import type { CreditPackage } from '@/features/credits/types';
import type { PackageAudienceDefinition } from '../config/catalog';
import {
  CommercialAudienceHero,
  PackagePromoBanner,
  PackageSuccessStoriesBanner,
} from './package-banners';
import { PackageGrid } from './package-card';
import { PackageInfoActions } from './package-info-actions';

interface PackageAudiencePageProps {
  audience: PackageAudienceDefinition;
  packages: CreditPackage[];
}

export function PackageAudiencePage({
  audience,
  packages,
}: PackageAudiencePageProps) {
  return (
    <div className="bg-white pb-16">
      <CommercialAudienceHero
        title={audience.heroTitle}
        description={audience.heroDescription}
      />

      <Container className="py-10 sm:py-12">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
            {audience.catalogTitle}
          </h2>
          <p className="mt-2 text-sm text-ink-600 sm:text-base">
            {audience.catalogSubtitle}
          </p>
        </div>

        <div className="mt-10">
          {audience.hasPricedCatalog ? (
            <PackageGrid packages={packages} />
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-[#e5e5e5] bg-white px-6 py-16 text-center">
              <p className="text-base font-semibold leading-8 text-ink-800">
                {audience.contactOnlyMessage}
              </p>
              <Link
                href={audience.contactHref ?? '/help'}
                className={getButtonClassName({
                  className: 'mt-6 h-11 min-w-[10rem] rounded-lg px-8 font-bold',
                })}
              >
                {audience.contactCtaLabel ?? 'تواصل معنا'}
              </Link>
            </div>
          )}
        </div>

        {audience.hasPricedCatalog ? (
          <PackageInfoActions faqs={audience.faqs} terms={audience.terms} />
        ) : null}

        {audience.promo ? (
          <div className="mt-12">
            <PackagePromoBanner promo={audience.promo} />
          </div>
        ) : null}

        {audience.successStories ? (
          <div className="mt-10">
            <PackageSuccessStoriesBanner stories={audience.successStories} />
          </div>
        ) : null}
      </Container>
    </div>
  );
}
