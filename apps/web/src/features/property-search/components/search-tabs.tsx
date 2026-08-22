import { uiLabels } from '@/config/labels';
import {
  searchModeOptions,
  transactionOptions,
  type SearchMode,
} from '@/config/property-types';
import { cn } from '@/lib/utils/cn';

interface SearchTabsProps {
  value: SearchMode;
  onChange: (value: SearchMode) => void;
  idPrefix?: string;
  variant?: 'default' | 'hero';
}

export function SearchTabs({
  value,
  onChange,
  idPrefix = 'search-transaction',
  variant = 'default',
}: SearchTabsProps) {
  const options = variant === 'hero' ? searchModeOptions : transactionOptions;

  if (variant === 'hero') {
    return (
      <div
        className="grid grid-cols-3 border-b border-black/10"
        role="tablist"
        aria-label={uiLabels.searchNav}
      >
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              id={`${idPrefix}-${option.value}`}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                'relative h-12 whitespace-nowrap text-[15px] font-semibold transition-colors sm:h-11 lg:h-12',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset',
                selected ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900 sm:text-ink-600',
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              <span
                className={cn(
                  'absolute inset-x-3 bottom-0 h-[2.5px] bg-brand-600 transition-opacity sm:inset-x-8 sm:h-[3px] sm:rounded-full',
                  selected ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="inline-flex rounded-lg bg-surface-100 p-1"
      role="tablist"
      aria-label={uiLabels.searchNav}
    >
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            id={`${idPrefix}-${option.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              'min-h-9 min-w-20 rounded-md px-3 text-sm font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              selected
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-ink-600 hover:text-ink-900',
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
