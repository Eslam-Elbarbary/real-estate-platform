import { valuationCopy } from '../../config';
import { formatConfidence } from '../../lib/format';
import { cn } from '@/lib/utils/cn';

interface ValuationConfidenceCardProps {
  score: number;
  className?: string;
  compact?: boolean;
}

export function ValuationConfidenceCard({
  score,
  className,
  compact = false,
}: ValuationConfidenceCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-success-700/20 bg-success-50 text-center',
        compact ? 'px-4 py-3' : 'px-5 py-4',
        className,
      )}
      data-testid="valuation-confidence"
    >
      <p className="text-sm font-semibold text-ink-600">
        {valuationCopy.confidence}
      </p>
      <p
        className={cn(
          'mt-1 font-extrabold text-success-700',
          compact ? 'text-2xl' : 'text-3xl',
        )}
      >
        {formatConfidence(score)}
      </p>
    </div>
  );
}
