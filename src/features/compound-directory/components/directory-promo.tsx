import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';

export function DirectoryPromo() {
  return (
    <aside className="mt-8 flex flex-col gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold text-ink-900">
          {uiLabels.compoundsPromoTitle}
        </p>
        <p className="mt-0.5 text-[12px] leading-5 text-ink-700">
          {uiLabels.compoundsPromoBody}
        </p>
      </div>
      <Link
        href={routes.addListing}
        className={getButtonClassName({
          className: 'h-9 shrink-0 px-4 text-[13px] font-bold',
        })}
      >
        {uiLabels.compoundsPromoCta}
      </Link>
    </aside>
  );
}
