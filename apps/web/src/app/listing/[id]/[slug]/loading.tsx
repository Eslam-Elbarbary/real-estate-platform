import { Container } from '@/components/ui/container';

function Block({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-100 ${className ?? ''}`} />;
}

export default function ListingLoading() {
  return (
    <Container wide className="pb-12 pt-4">
      <Block className="h-4 w-2/3 max-w-xl" />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="space-y-3">
          <Block className="h-10 w-56" />
          <Block className="h-8 w-[min(100%,36rem)]" />
          <Block className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Block className="h-12 w-32" />
          <Block className="h-12 w-28" />
        </div>
      </div>

      <Block className="mt-6 h-12 w-full" />

      <div className="mt-5 grid gap-2.5 lg:grid-cols-[1.35fr_1fr]">
        <Block className="min-h-[320px] lg:min-h-[420px]" />
        <div className="grid grid-cols-2 gap-2.5">
          <Block className="min-h-[150px] lg:min-h-[205px]" />
          <Block className="min-h-[150px] lg:min-h-[205px]" />
          <Block className="min-h-[150px] lg:min-h-[205px]" />
          <Block className="min-h-[150px] lg:min-h-[205px]" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Block className="h-6 w-64" />
        <Block className="h-4 w-80" />
        <div className="flex flex-wrap gap-4 pt-2">
          <Block className="h-5 w-24" />
          <Block className="h-5 w-24" />
          <Block className="h-5 w-24" />
          <Block className="h-5 w-28" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Block className="h-7 w-48" />
        <Block className="h-40 w-full" />
      </div>
    </Container>
  );
}
