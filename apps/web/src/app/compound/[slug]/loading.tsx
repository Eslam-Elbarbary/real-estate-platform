import { Container } from '@/components/ui/container';

export default function CompoundDetailsLoading() {
  return (
    <Container compoundDetails className="animate-pulse pb-10 pt-4">
      <div className="h-3 w-64 rounded bg-surface-200" />

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,32%)]">
        <div>
          <div className="aspect-[1.65] w-full rounded-[12px] bg-surface-200" />
          <div className="mt-4 h-3 w-40 rounded bg-surface-200" />
          <div className="mt-3 h-7 w-3/4 rounded bg-surface-200" />
          <div className="mt-3 h-4 w-1/2 rounded bg-surface-200" />
          <div className="mt-3 h-5 w-56 rounded bg-surface-200" />
        </div>
        <div className="space-y-3">
          <div className="h-10 rounded-md bg-surface-200" />
          <div className="h-11 rounded-md bg-surface-200" />
          <div className="h-11 rounded-md bg-surface-200" />
          <div className="h-56 rounded-xl bg-surface-200" />
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <div className="h-6 w-40 rounded bg-surface-200" />
        <div className="h-28 rounded-lg bg-surface-200" />
        <div className="h-28 rounded-lg bg-surface-200" />
      </div>

      <div className="mt-10 space-y-3">
        <div className="h-6 w-36 rounded bg-surface-200" />
        <div className="h-40 rounded bg-surface-200" />
      </div>
    </Container>
  );
}
