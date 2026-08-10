import Link from 'next/link';
import { createElement } from 'react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils/cn';
import type { MarketingServiceSectionConfig } from '../types';
import { MarketingMedia } from './marketing-media';

interface MarketingServiceSectionProps {
  section: MarketingServiceSectionConfig;
  priority?: boolean;
}

export function MarketingServiceSection({
  section,
  priority = false,
}: MarketingServiceSectionProps) {
  return (
    <Container
      marketing
      className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:gap-14 lg:py-14"
    >
      <div
        className={cn(
          'order-2',
          section.reversed ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        <div className="mb-3 text-brand-600">
          {createElement(section.icon, {
            size: 36,
            strokeWidth: 1.6,
            'aria-hidden': true,
          })}
        </div>
        <h2 className="text-xl font-extrabold text-ink-950 sm:text-2xl">
          {section.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-ink-600">
          {section.description}
        </p>
        <Link
          href={section.ctaHref}
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {section.ctaLabel}
          <span aria-hidden> ›</span>
        </Link>
      </div>

      <div
        className={cn(
          'order-1',
          section.reversed ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        <MarketingMedia
          src={section.imageSrc}
          alt={section.imageAlt}
          kind={section.mediaKind}
          priority={priority}
        />
      </div>
    </Container>
  );
}
