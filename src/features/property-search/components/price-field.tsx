import { uiLabels } from '@/config/labels';
import {
  RENT_PRICE_SUGGESTIONS,
  SALE_PRICE_SUGGESTIONS,
} from '@/config/search';
import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import type { TransactionType } from '@/types';

interface PriceFieldProps {
  transactionType: TransactionType;
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  className?: string;
}

function parsePriceInput(value: string): number | undefined {
  const normalized = value.replace(/[^\d]/g, '');
  if (!normalized) {
    return undefined;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

function displayPrice(value: number | undefined): string {
  return value ? String(value) : '';
}

export function PriceField({
  transactionType,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  className,
}: PriceFieldProps) {
  const suggestions =
    transactionType === 'rent' ? RENT_PRICE_SUGGESTIONS : SALE_PRICE_SUGGESTIONS;

  return (
    <div className={cn('flex min-w-0 flex-[1.2] flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-ink-500">نطاق السعر</span>
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0" htmlFor="search-min-price">
          <span className="sr-only">{uiLabels.minPrice}</span>
          <input
            id="search-min-price"
            inputMode="numeric"
            placeholder={uiLabels.minPrice}
            value={displayPrice(minPrice)}
            onChange={(event) => onMinPriceChange(parsePriceInput(event.target.value))}
            className={cn(
              'h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
            )}
            list="search-price-suggestions"
          />
        </label>
        <label className="min-w-0" htmlFor="search-max-price">
          <span className="sr-only">{uiLabels.maxPrice}</span>
          <input
            id="search-max-price"
            inputMode="numeric"
            placeholder={uiLabels.maxPrice}
            value={displayPrice(maxPrice)}
            onChange={(event) => onMaxPriceChange(parsePriceInput(event.target.value))}
            className={cn(
              'h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
            )}
            list="search-price-suggestions"
          />
        </label>
      </div>
      <datalist id="search-price-suggestions">
        {suggestions.map((amount) => (
          <option key={amount} value={amount} label={formatCurrency(amount)} />
        ))}
      </datalist>
      {(minPrice || maxPrice) && (
        <p className="truncate text-xs text-ink-500">
          {minPrice ? formatCurrency(minPrice) : '—'}
          {' — '}
          {maxPrice ? formatCurrency(maxPrice) : '—'}
        </p>
      )}
    </div>
  );
}
