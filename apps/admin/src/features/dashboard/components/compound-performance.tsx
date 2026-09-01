import Link from 'next/link';
import { ArrowUpLeft, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { AdminDashboardTopCompound } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface CompoundPerformanceProps {
  compounds: AdminDashboardTopCompound[];
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

const RANK_STYLES = [
  'bg-[#0F172A] text-white',
  'bg-accent-500/20 text-accent-900 ring-1 ring-accent-500/30',
  'bg-surface-100 text-ink-700 ring-1 ring-border/70',
];

export function CompoundPerformance({ compounds }: CompoundPerformanceProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          أداء السوق
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          أفضل المجمعات
        </h2>
        <p className="text-sm text-ink-500">ترتيب المجمعات حسب الأداء</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {compounds.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        ) : (
          <ol className="space-y-3">
            {compounds.map((compound, index) => {
              const rankStyle = RANK_STYLES[index] ?? RANK_STYLES[2];
              const isTopRank = index === 0;

              return (
                <li key={compound.id}>
                  <Link
                    href={routes.compounds.details(compound.id)}
                    className={cn(
                      'group block rounded-xl border px-4 py-4 transition-all hover:shadow-sm',
                      isTopRank
                        ? 'border-accent-500/25 bg-gradient-to-br from-white to-accent-500/5'
                        : 'border-border/70 bg-white hover:border-accent-500/20',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                          rankStyle,
                        )}
                      >
                        {formatCount(index + 1)}
                      </span>
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0F172A]/5 text-[#0F172A] ring-1 ring-border/60">
                        <MapPin className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink-900">
                              {compound.nameAr ?? compound.nameEn}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-ink-500">
                              {compound.developerName ?? '—'}
                            </p>
                          </div>
                          <ArrowUpLeft
                            className="size-4 shrink-0 text-ink-300 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
                            aria-hidden
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="font-medium text-ink-600">
                            {formatCount(compound.totalListings)} عقار
                          </span>
                          <span className="font-semibold text-accent-700">
                            {formatCount(compound.publishedPropertyCount)} منشور
                          </span>
                          {compound.locationName ? (
                            <span className="inline-flex items-center gap-1 text-ink-500">
                              <MapPin
                                className="size-3"
                                style={{ color: luxuryMutedColors.gold }}
                                aria-hidden
                              />
                              {compound.locationName}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
