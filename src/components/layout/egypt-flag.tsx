import { cn } from '@/lib/utils/cn';

interface EgyptFlagProps {
  className?: string;
}

export function EgyptFlag({ className }: EgyptFlagProps) {
  return (
    <svg
      viewBox="0 0 21 15"
      className={cn('size-4 shrink-0 rounded-[1px] shadow-sm', className)}
      aria-hidden
      focusable="false"
    >
      <rect width="21" height="5" y="0" fill="#CE1126" />
      <rect width="21" height="5" y="5" fill="#FFFFFF" />
      <rect width="21" height="5" y="10" fill="#000000" />
      <path
        d="M10.5 6.1c-.55.2-.9.7-.9 1.25 0 .7.55 1.25 1.25 1.25s1.25-.55 1.25-1.25c0-.55-.35-1.05-.9-1.25"
        fill="#C09300"
      />
    </svg>
  );
}
