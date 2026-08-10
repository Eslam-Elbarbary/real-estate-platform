import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { marketingServicesCopy } from '../config';

export function MarketingFinalCTA() {
  return (
    <section className="border-t border-[#eeeeee] bg-[#f7fbfe] py-12 sm:py-14">
      <Container marketing className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
          {marketingServicesCopy.finalCtaTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-600">
          {marketingServicesCopy.finalCtaDescription}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#marketing-lead-form"
            className={getButtonClassName({
              className: 'h-11 rounded-full px-8 font-bold',
            })}
          >
            {marketingServicesCopy.finalCtaPrimary}
          </a>
          <Link
            href={routes.packages.root}
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-11 rounded-full px-8 font-bold',
            })}
          >
            {marketingServicesCopy.finalCtaSecondary}
          </Link>
        </div>
      </Container>
    </section>
  );
}
