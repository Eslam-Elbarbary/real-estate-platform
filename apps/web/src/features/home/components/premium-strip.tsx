import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';

interface PremiumStripProps {
  href: string;
  ctaLabel?: string;
}

export function PremiumStrip({
  href,
  ctaLabel = uiLabels.premiumCta,
}: PremiumStripProps) {
  return (
    <section className="bg-accent-50" data-testid="home-pro-strip">
      <Container className="flex min-h-12 flex-col items-center justify-between gap-2 py-2.5 sm:flex-row">
        <div className="flex items-center gap-2 text-center text-sm text-ink-800 sm:text-start">
          <span className="inline-flex h-5 items-center rounded bg-accent-500 px-1.5 text-[10px] font-bold text-ink-950">
            PRO
          </span>
          <p>{uiLabels.premiumMessage}</p>
        </div>
        <Link
          href={href}
          className={getButtonClassName({
            variant: 'accent',
            size: 'small',
            className: 'font-bold',
          })}
          data-testid="home-pro-cta"
        >
          {ctaLabel}
        </Link>
      </Container>
    </section>
  );
}
