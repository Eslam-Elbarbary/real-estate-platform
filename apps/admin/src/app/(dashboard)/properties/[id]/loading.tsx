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

export default function PropertyDetailsLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="جاري تحميل تفاصيل العقار">
      <div className="sticky top-0 z-20 border-b border-border bg-white py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-8 w-72 max-w-full" />
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-6 w-20" />
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-6 w-28" />
            </div>
            <SkeletonBlock className="h-3 w-48" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-9 w-20" />
            <SkeletonBlock className="h-9 w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-4">
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <SkeletonBlock className="aspect-[16/9] w-full rounded-none rounded-t-xl" />
          <div className="flex gap-2 p-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="size-16 shrink-0 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-9 w-24" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
