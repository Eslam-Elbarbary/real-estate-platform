import Image from 'next/image';
import Link from 'next/link';
import { AppStoreBadges } from '@/components/ui/app-store-badges';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { myPropertiesCopy } from '../config/copy';

export function MyPropertiesPromoBanner() {
  return (
    <Container dashboard className="py-6">
      <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-brand-700 px-6 py-8 text-white sm:flex-row sm:px-10">
        <div className="max-w-xl text-center sm:text-start">
          <Link
            href={routes.packages.root}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <h2 className="text-xl font-extrabold sm:text-2xl">
              {myPropertiesCopy.promo.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-white/90">
              {myPropertiesCopy.promo.description}
            </p>
          </Link>
          <AppStoreBadges className="mt-4 justify-center sm:justify-start" size="sm" />
        </div>
        <Link
          href={routes.packages.root}
          className="relative h-36 w-40 shrink-0 sm:h-40 sm:w-48"
          aria-label={myPropertiesCopy.promo.title}
        >
          <Image
            src="/assets/home/app/phones.webp"
            alt=""
            fill
            className="object-contain"
            sizes="192px"
            priority
          />
        </Link>
      </div>
    </Container>
  );
}
