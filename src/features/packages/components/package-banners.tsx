import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { AppStoreBadges } from '@/components/ui/app-store-badges';
import type { PackageAudienceDefinition } from '../config/catalog';

interface CommercialAudienceHeroProps {
  title: string;
  description: string;
}

export function CommercialAudienceHero({
  title,
  description,
}: CommercialAudienceHeroProps) {
  return (
    <div className="bg-brand-700">
      <Container className="flex flex-col-reverse items-center justify-between gap-8 py-10 sm:flex-row sm:py-12">
        <div className="max-w-xl text-center sm:text-start">
          <h1 className="text-2xl font-extrabold leading-10 text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/90 sm:text-base">
            {description}
          </p>
        </div>
        <div className="relative h-40 w-56 shrink-0 sm:h-44 sm:w-64">
          <Image
            src="/assets/home/know/experts.webp"
            alt=""
            fill
            className="object-contain"
            sizes="256px"
            priority
          />
        </div>
      </Container>
    </div>
  );
}

interface PackagePromoBannerProps {
  promo: NonNullable<PackageAudienceDefinition['promo']>;
}

export function PackagePromoBanner({ promo }: PackagePromoBannerProps) {
  const content = (
    <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-brand-700 px-6 py-8 text-white sm:flex-row sm:px-10">
      <div className="max-w-xl text-center sm:text-start">
        <h2 className="text-xl font-extrabold sm:text-2xl">{promo.title}</h2>
        <p className="mt-2 text-sm leading-7 text-white/90">{promo.description}</p>
        {promo.showAppBadges ? (
          <AppStoreBadges className="mt-4 justify-center sm:justify-start" size="sm" />
        ) : null}
      </div>
      <div className="relative h-36 w-40 shrink-0 sm:h-40 sm:w-48">
        <Image
          src={promo.imageSrc}
          alt={promo.imageAlt}
          fill
          className="object-contain"
          sizes="192px"
        />
      </div>
    </div>
  );

  if (promo.href) {
    return (
      <Link href={promo.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        {content}
      </Link>
    );
  }

  return content;
}

interface PackageSuccessStoriesBannerProps {
  stories: NonNullable<PackageAudienceDefinition['successStories']>;
}

export function PackageSuccessStoriesBanner({
  stories,
}: PackageSuccessStoriesBannerProps) {
  const inner = (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative h-44 w-full sm:h-56">
        <Image
          src={stories.imageSrc}
          alt={stories.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-ink-950/45" />
      </div>
      <p className="absolute inset-x-0 bottom-0 p-5 text-center text-base font-extrabold text-white sm:p-8 sm:text-xl">
        {stories.title} ←
      </p>
    </div>
  );

  if (stories.href) {
    return (
      <Link
        href={stories.href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
