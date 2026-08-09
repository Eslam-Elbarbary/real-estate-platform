import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Skeleton className="aspect-[3/2] w-full rounded-none xl:min-h-[250px]" />
      <div className="space-y-2.5 p-4">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="flex h-[52px] border-t border-border">
        <Skeleton className="h-full flex-1 rounded-none" />
        <span className="w-px self-stretch bg-border" aria-hidden />
        <Skeleton className="h-full flex-1 rounded-none" />
      </div>
    </div>
  );
}

export function PropertyResultsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,var(--container-wide))] px-8 py-6 sm:px-10">
      <Skeleton className="mb-3 h-11 w-full rounded-xl" />
      <div className="mb-5 flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-11 flex-1 rounded-lg" />
        ))}
      </div>
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-2 h-7 w-48" />
      <Skeleton className="mb-5 h-4 w-28" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
