import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { routes } from '@/config/routes';
import { marketIndexCopy } from '../config';

export function MarketIndexHeader() {
  return (
    <header className="mb-8">
      <AdviceBreadcrumb
        items={[
          { label: marketIndexCopy.breadcrumbHome, href: routes.home },
          { label: marketIndexCopy.breadcrumbKnow, href: routes.advice.root },
          { label: marketIndexCopy.breadcrumbIndex, href: routes.marketIndex.root },
        ]}
      />
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-extrabold text-ink-950">
          {marketIndexCopy.heading}
        </h1>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
          {marketIndexCopy.badge}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
        {marketIndexCopy.intro}
      </p>
    </header>
  );
}
