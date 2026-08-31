import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-100', className)}
      aria-hidden
    />
  );
}

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="جاري التحميل">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <SkeletonBlock className="h-8 w-48 max-w-full" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-10 w-36 shrink-0" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-9 w-20" />
              <SkeletonBlock className="h-3 w-full max-w-[12rem]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="space-y-2 pb-4">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-28" />
        </CardHeader>
        <CardContent className="space-y-3 p-0 pb-4">
          <div className="border-b border-border px-4 pb-3">
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-4 w-full" />
              ))}
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-4">
              <SkeletonBlock className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
