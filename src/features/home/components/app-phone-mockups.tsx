import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

interface AppPhoneMockupsProps {
  className?: string;
}

function PhoneFrame({
  className,
  screen,
  label,
}: {
  className?: string;
  screen: 'search' | 'map' | 'listing';
  label: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[1.6rem] border-[5px] border-ink-900 bg-white shadow-lg',
        className,
      )}
      aria-hidden
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-ink-800/70" />
      <div className="mx-2 mt-2 flex-1 overflow-hidden rounded-xl bg-surface-50 p-2.5">
        {screen === 'search' ? (
          <div className="space-y-2">
            <div className="h-2.5 w-16 rounded bg-brand-200" />
            <div className="h-8 rounded-lg bg-white shadow-sm ring-1 ring-border" />
            <div className="h-16 rounded-lg bg-brand-50" />
            <div className="h-16 rounded-lg bg-white shadow-sm" />
          </div>
        ) : null}
        {screen === 'map' ? (
          <div className="flex h-full flex-col gap-2">
            <div className="relative flex-1 rounded-lg bg-brand-100">
              <span className="absolute start-3 top-3 size-3 rounded-full bg-brand-600" />
              <span className="absolute end-6 top-10 size-3 rounded-full bg-accent-500" />
              <span className="absolute start-1/2 top-1/2 size-3 -translate-x-1/2 rounded-full bg-brand-700" />
            </div>
            <div className="h-10 rounded-lg bg-white shadow-sm" />
          </div>
        ) : null}
        {screen === 'listing' ? (
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-brand-200" />
            <div className="h-2.5 w-20 rounded bg-ink-400/40" />
            <div className="h-2.5 w-14 rounded bg-ink-400/30" />
            <div className="mt-3 h-8 rounded-md bg-brand-600" />
          </div>
        ) : null}
        <p className="mt-2 text-center text-[10px] font-semibold text-ink-700">
          {label}
        </p>
      </div>
    </div>
  );
}

export function AppPhoneMockups({ className }: AppPhoneMockupsProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex h-[320px] w-full max-w-md items-end justify-center sm:h-[360px]',
        className,
      )}
      role="img"
      aria-label={`شاشات تطبيق ${siteConfig.shortName}`}
    >
      <PhoneFrame
        screen="map"
        label="خريطة"
        className="absolute start-[8%] bottom-4 z-0 h-[78%] w-[30%] -rotate-6 opacity-95"
      />
      <PhoneFrame
        screen="search"
        label="بحث"
        className="relative z-20 h-[92%] w-[34%] scale-105"
      />
      <PhoneFrame
        screen="listing"
        label="تفاصيل"
        className="absolute end-[8%] bottom-4 z-10 h-[78%] w-[30%] rotate-6 opacity-95"
      />
    </div>
  );
}
