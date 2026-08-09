import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompoundsDirectoryLoading() {
  return (
    <Container directory className="pb-12 pt-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-7 w-80" />
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-36 rounded-md" />
        ))}
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="rounded-xl border border-border p-4">
            <Skeleton className="mb-3 h-5 w-28" />
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="mb-2 h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-[52px] w-full rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
