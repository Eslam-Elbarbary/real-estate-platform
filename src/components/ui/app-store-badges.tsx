import Image from 'next/image';
import { appStoreLinks } from '@/config/app-links';
import { cn } from '@/lib/utils/cn';

interface AppStoreBadgesProps {
  className?: string;
  /** default ≈ 130–145px; sm ≈ 100–115px for footer */
  size?: 'default' | 'sm' | 'compact';
}

const sizeMap = {
  default: { width: 138, height: 41 },
  sm: { width: 108, height: 32 },
  compact: { width: 108, height: 32 },
} as const;

export function AppStoreBadges({
  className,
  size = 'default',
}: AppStoreBadgesProps) {
  const { width, height } = sizeMap[size];

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <a
        href={appStoreLinks.googlePlay.href}
        aria-label={appStoreLinks.googlePlay.label}
        className="inline-flex transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Image
          src={appStoreLinks.googlePlay.badgeSrc}
          alt={appStoreLinks.googlePlay.label}
          width={width}
          height={height}
          className="h-auto"
          style={{ width }}
        />
      </a>
      <a
        href={appStoreLinks.appStore.href}
        aria-label={appStoreLinks.appStore.label}
        className="inline-flex transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Image
          src={appStoreLinks.appStore.badgeSrc}
          alt={appStoreLinks.appStore.label}
          width={width}
          height={height}
          className="h-auto"
          style={{ width }}
        />
      </a>
    </div>
  );
}
