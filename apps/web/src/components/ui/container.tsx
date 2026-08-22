import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'main' | 'header' | 'footer';
  narrow?: boolean;
  /** Near full-bleed desktop width for search-results (≈1820–1860px @ 1920). */
  wide?: boolean;
  /** Narrower centered shell for Compounds Directory (~1260px). */
  directory?: boolean;
  /** Compound Details shell (~1050–1200px useful width). */
  compoundDetails?: boolean;
  /** Authenticated operational dashboards (~1100–1140px). */
  dashboard?: boolean;
  /** Public marketing-services landing (~1140px). */
  marketing?: boolean;
  /** Neighborhood / property-prices directory & details (~1180px). */
  neighborhood?: boolean;
  /** Ask Area / question details (~1080–1180px). */
  advice?: boolean;
  /** Market index editorial feed (~1100–1180px). */
  marketIndex?: boolean;
}

export function Container({
  as: Component = 'div',
  className,
  narrow = false,
  wide = false,
  directory = false,
  compoundDetails = false,
  dashboard = false,
  marketing = false,
  neighborhood = false,
  advice = false,
  marketIndex = false,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full',
        wide ||
          directory ||
          compoundDetails ||
          dashboard ||
          marketing ||
          neighborhood ||
          advice ||
          marketIndex
          ? 'px-6 sm:px-8 lg:px-8'
          : 'px-4 sm:px-6 lg:px-8',
        narrow
          ? 'max-w-3xl'
          : marketIndex
            ? 'max-w-[min(100%,var(--container-market-index))]'
            : advice
            ? 'max-w-[min(100%,var(--container-advice))]'
            : neighborhood
            ? 'max-w-[min(100%,var(--container-neighborhood))]'
            : marketing
              ? 'max-w-[min(100%,var(--container-marketing))]'
              : dashboard
                ? 'max-w-[min(100%,var(--container-dashboard))]'
                : compoundDetails
                  ? 'max-w-[min(100%,var(--container-compound-details))]'
                  : directory
                    ? 'max-w-[min(100%,var(--container-directory))]'
                    : wide
                      ? 'max-w-[min(100%,var(--container-wide))]'
                      : 'max-w-[min(100%,var(--container-max))]',
        className,
      )}
      {...props}
    />
  );
}
