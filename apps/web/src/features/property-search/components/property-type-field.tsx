import { uiLabels } from '@/config/labels';
import { propertyTypeOptions } from '@/config/property-types';
import { cn } from '@/lib/utils/cn';
import type { PropertyType } from '@/types';

interface PropertyTypeFieldProps {
  id?: string;
  value?: PropertyType;
  onChange: (value: PropertyType | undefined) => void;
  className?: string;
}

export function PropertyTypeField({
  id = 'property-type',
  value,
  onChange,
  className,
}: PropertyTypeFieldProps) {
  return (
    <label className={cn('flex min-w-0 flex-1 flex-col gap-1.5', className)} htmlFor={id}>
      <span className="text-xs font-medium text-ink-500">{uiLabels.propertyType}</span>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next ? (next as PropertyType) : undefined);
        }}
        className={cn(
          'h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink-900',
          'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
        )}
      >
        <option value="">{uiLabels.allPropertyTypes}</option>
        {propertyTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
