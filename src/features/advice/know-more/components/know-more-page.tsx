import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getAppIcon } from '@/config/icons';
import { routes } from '@/config/routes';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { cn } from '@/lib/utils/cn';
import { knowMoreCopy, knowMoreServices } from '../config';

export function KnowMorePage() {
  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: 'عقارات مصر', href: routes.home },
            { label: knowMoreCopy.seoTitle, href: routes.advice.root },
          ]}
        />

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <h1 className="text-[1.75rem] font-extrabold leading-snug text-brand-700 sm:text-[2.15rem]">
            {knowMoreCopy.title}
          </h1>

          <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-[52rem] overflow-hidden rounded-xl bg-surface-100">
            <Image
              src="/assets/home/hero/hero.webp"
              alt={knowMoreCopy.heroVisualAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 832px"
            />
            <div className="absolute inset-0 bg-ink-950/25" />
            <div
              aria-hidden
              className="absolute start-6 top-8 size-14 rounded-full bg-accent-500/80 blur-[1px] sm:size-16"
            />
            <div
              aria-hidden
              className="absolute end-8 bottom-10 size-12 rounded-full bg-white/70 sm:size-14"
            />
            <span
              aria-hidden
              className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-md sm:size-[4.5rem]"
            >
              <svg viewBox="0 0 24 24" className="ms-1 size-8 fill-current" aria-hidden>
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-ink-600 sm:text-[15px]">
            {knowMoreCopy.intro}
          </p>
        </header>

        <section className="mt-14" aria-labelledby="know-more-services-heading">
          <h2
            id="know-more-services-heading"
            className="text-center text-2xl font-extrabold text-ink-950"
          >
            {knowMoreCopy.servicesHeading}
          </h2>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {knowMoreServices.map((service) => {
              const Icon = getAppIcon(service.icon);
              return (
                <li key={service.id}>
                  <article
                    data-testid={`know-service-${service.id}`}
                    className="flex h-full flex-col border border-[#ececec] bg-white px-6 py-8 text-center"
                  >
                    <Icon
                      className="mx-auto size-14 text-ink-400/70"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <h3 className="mt-5 text-lg font-extrabold text-ink-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-ink-600">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      className={cn(
                        'mt-5 inline-flex justify-center text-sm font-bold text-accent-600',
                        'hover:text-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      )}
                    >
                      {service.ctaLabel}
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>
    </div>
  );
}
