import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

interface SearchPromoCardProps {
  className?: string;
}

/** Occupies exactly one grid cell with PropertyCard outer proportions. */
export function SearchPromoCard({ className }: SearchPromoCardProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-brand-200 bg-brand-50',
        className,
      )}
    >
      <div className="aspect-[3/2] xl:min-h-[250px] bg-gradient-to-br from-brand-50 via-[#eef7fc] to-accent-50" />
      <div className="flex flex-1 flex-col justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div>
          <p className="text-[11px] font-semibold text-brand-700">
            {siteConfig.name}
          </p>
          <h3 className="mt-1 text-[15px] font-bold leading-6 text-ink-900">
            {uiLabels.searchPromoTitle}
          </h3>
          <p className="mt-1.5 text-xs leading-5 text-ink-600">
            {uiLabels.searchPromoBody}
          </p>
        </div>
        <Link
          href={routes.addListing}
          className={getButtonClassName({
            variant: 'primary',
            size: 'medium',
            className: 'w-full justify-center',
          })}
        >
          {uiLabels.searchPromoCta}
        </Link>
      </div>
    </aside>
  );
}
