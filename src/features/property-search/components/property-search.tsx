import { getLocationOptions } from '@/features/locations';
import { cn } from '@/lib/utils/cn';
import type { TransactionType } from '@/types';
import {
  PropertySearchForm,
  type PropertySearchVariant,
} from './property-search-form';

interface PropertySearchProps {
  variant?: PropertySearchVariant;
  className?: string;
  initialTransactionType?: TransactionType;
}

export async function PropertySearch({
  variant = 'default',
  className,
  initialTransactionType,
}: PropertySearchProps) {
  const locations = await getLocationOptions();

  return (
    <PropertySearchForm
      locations={locations}
      variant={variant}
      className={cn(className)}
      initialTransactionType={initialTransactionType}
    />
  );
}
