import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';

export function AddPropertyCta() {
  return (
    <section className="bg-white py-5 sm:py-7">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-surface-50 px-5 py-8 text-center sm:px-10 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -start-10 top-1/2 size-40 -translate-y-1/2 rounded-full bg-brand-50"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -end-8 top-6 size-28 rounded-full bg-surface-200/80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute end-16 bottom-4 size-16 rounded-full bg-brand-50/80"
          />

          <div className="relative mx-auto max-w-xl">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {uiLabels.addPropertyTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {uiLabels.addPropertyDescription}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={routes.addListing}
                className={getButtonClassName({ size: 'medium' })}
              >
                {uiLabels.addPropertyPrimary}
              </Link>
              <span className="cursor-default text-sm font-semibold text-ink-400">
                {uiLabels.addPropertySecondary}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
