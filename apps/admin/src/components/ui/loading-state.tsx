import type { HTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function LoadingState({
  className,
  label = 'جاري التحميل…',
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-white px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      <LoaderCircle
        className="size-6 animate-spin text-brand-600"
        aria-hidden
      />
      <p className="text-sm text-ink-600">{label}</p>
    </div>
  );
}
