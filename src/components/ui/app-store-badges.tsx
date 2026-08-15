import { appStoreLinks } from '@/config/app-links';
import { cn } from '@/lib/utils/cn';

export type StoreBadgeSize = 'large' | 'compact' | 'default' | 'sm';

interface StoreBadgesProps {
  className?: string;
  size?: StoreBadgeSize;
}

const heightPx: Record<StoreBadgeSize, number> = {
  large: 54,
  default: 54,
  compact: 34,
  sm: 34,
};

function StoreBadgeImage({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: StoreBadgeSize;
}) {
  const height = heightPx[size];

  return (
    // Native img keeps SVG viewBox scaling intact (Next/Image + CSS width
    // was stretching the Apple mark independently of the badge).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={646}
      height={250}
      className="object-contain"
      style={{ height, width: 'auto' }}
    />
  );
}

export function StoreBadges({ className, size = 'large' }: StoreBadgesProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <a
        href={appStoreLinks.googlePlay.href}
        aria-label={appStoreLinks.googlePlay.label}
        className="inline-flex transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <StoreBadgeImage
          src={appStoreLinks.googlePlay.badgeSrc}
          alt={appStoreLinks.googlePlay.label}
          size={size}
        />
      </a>
      <a
        href={appStoreLinks.appStore.href}
        aria-label={appStoreLinks.appStore.label}
        className="inline-flex transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <StoreBadgeImage
          src={appStoreLinks.appStore.badgeSrc}
          alt={appStoreLinks.appStore.label}
          size={size}
        />
      </a>
    </div>
  );
}

/** @deprecated Use StoreBadges */
export function AppStoreBadges(props: StoreBadgesProps) {
  return <StoreBadges {...props} />;
}
