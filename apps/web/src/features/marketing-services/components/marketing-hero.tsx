import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { marketingServicesCopy } from '../config';

export function MarketingHero() {
  return (
    <section className="overflow-hidden bg-white">
      <Container
        marketing
        className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:gap-10 lg:py-14"
      >
        <div>
          <h1 className="text-3xl font-extrabold leading-snug text-ink-950 sm:text-4xl lg:text-[2.6rem]">
            {marketingServicesCopy.heroTitle}
          </h1>
          <p className="mt-3 text-base font-semibold text-ink-600 sm:text-lg">
            {marketingServicesCopy.heroSubtitle}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-600 sm:text-[0.95rem]">
            {marketingServicesCopy.heroDescription}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#marketing-lead-form"
              className={getButtonClassName({
                className: 'h-11 rounded-full px-8 font-bold',
              })}
            >
              {marketingServicesCopy.joinNow}
            </a>
            <a
              href="#marketing-services"
              className="text-sm font-semibold text-ink-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {marketingServicesCopy.knowMore}
              <span aria-hidden> ›</span>
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface-100 lg:aspect-[5/3]">
          <Image
            src="/assets/marketing-services/hero.webp"
            alt="فعالية عقارية تجمع مسوقين ومطورين"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-l from-white to-transparent max-lg:hidden"
          />
        </div>
      </Container>
    </section>
  );
}
