import Image from 'next/image';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { valuationCopy } from '../config';

export function ValuationPublicLanding() {
  const loginHref = `${routes.auth.login}?returnTo=${encodeURIComponent(routes.valuation.root)}`;
  const registerHref = `${routes.auth.register}?returnTo=${encodeURIComponent(routes.valuation.root)}`;

  return (
    <section className="border-b border-[#edd9a8] bg-[#fff6e0]">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
            <Image
              src="/assets/valuation/landing-device.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            <Sparkles size={14} aria-hidden />
            {valuationCopy.aiBadge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-snug text-ink-950 lg:text-[2.5rem]">
            {valuationCopy.publicTitle}
          </h1>
          <ul className="mt-6 space-y-3">
            {valuationCopy.benefits.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink-800">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-700">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={loginHref}
              className={getButtonClassName({
                className: 'h-11 min-w-[9rem] px-6',
              })}
            >
              {valuationCopy.login}
            </Link>
            <Link
              href={registerHref}
              className={getButtonClassName({
                variant: 'accent',
                className: 'h-11 min-w-[9rem] px-6 font-bold',
              })}
            >
              {valuationCopy.register}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
