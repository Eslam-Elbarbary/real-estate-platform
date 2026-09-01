import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { AdminDashboardTopDeveloper } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface DeveloperPerformanceProps {
  developers: AdminDashboardTopDeveloper[];
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function DeveloperLogo({ developer }: { developer: AdminDashboardTopDeveloper }) {
  if (developer.logoUrl) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
        <Image
          src={developer.logoUrl}
          alt=""
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
    );
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-700 ring-1 ring-accent-500/15">
      <Building2 className="size-5" aria-hidden />
    </div>
  );
}

export function DeveloperPerformance({ developers }: DeveloperPerformanceProps) {
  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          أداء السوق
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          أفضل المطورين
        </h2>
        <p className="text-sm text-ink-500">حسب حجم المخزون والنشر</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {developers.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        ) : (
          <ol className="space-y-3">
            {developers.map((developer, index) => (
              <li
                key={developer.id}
                className="rounded-xl border border-border/70 bg-white px-4 py-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
                    {formatCount(index + 1)}
                  </span>
                  <DeveloperLogo developer={developer} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink-900">
                      {developer.nameAr ?? developer.nameEn}
                    </p>
                    <div className="mt-2 grid gap-1 text-xs text-ink-500 sm:grid-cols-3">
                      <p>
                        <span className="font-bold text-ink-900">
                          {formatCount(developer.compoundCount)}
                        </span>{' '}
                        مشروع
                      </p>
                      <p>
                        <span className="font-bold text-ink-900">
                          {formatCount(developer.totalPropertyCount)}
                        </span>{' '}
                        عقار
                      </p>
                      <p>
                        <span className="font-bold text-accent-700">
                          {formatCount(developer.publishedPropertyCount)}
                        </span>{' '}
                        منشور
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end border-t border-border/60 pt-3">
                  <Link
                    href={routes.developers.details(developer.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700 transition-colors hover:text-accent-800"
                  >
                    عرض التفاصيل
                    <ArrowUpLeft className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
