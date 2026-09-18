import { Clock3 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

interface DashboardIntroProps {
  updatedAt: string;
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/** Compact home header — branding from siteConfig only. */
export function DashboardIntro({ updatedAt }: DashboardIntroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#1e293b]/20',
        'bg-gradient-to-br from-[#0F172A] to-[#1E293B]',
        'shadow-sm',
      )}
    >
      <div
        className="pointer-events-none absolute -start-16 -top-16 size-56 rounded-full bg-accent-500/12 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-3 p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-accent-500">
            {siteConfig.productName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock3 className="size-3.5 shrink-0 text-accent-500/80" aria-hidden />
            <span>آخر تحديث: {formatUpdatedAt(updatedAt)}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">
            {siteConfig.name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
            مركز تشغيل المنصة العقارية — راقب المهام العاجلة والمؤشرات ثم انتقل إلى التفاصيل.
          </p>
        </div>
      </div>
    </section>
  );
}
