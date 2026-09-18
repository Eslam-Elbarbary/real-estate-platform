import { getSearchLocationOptions } from '@/features/locations/api-options';
import { fetchPropertyTypes } from '@/features/properties/api/catalogs';
import { toCatalogPropertyTypeOptions } from '@/features/properties/lib/property-type-options';
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
  let locations: Awaited<ReturnType<typeof getSearchLocationOptions>> = [];
  let propertyTypeOptions: ReturnType<typeof toCatalogPropertyTypeOptions> = [];
  try {
    const [locationOptions, propertyTypes] = await Promise.all([
      getSearchLocationOptions(),
      fetchPropertyTypes(),
    ]);
    locations = locationOptions;
    propertyTypeOptions = toCatalogPropertyTypeOptions(propertyTypes);
  } catch {
    locations = [];
    propertyTypeOptions = [];
  }

  return (
    <PropertySearchForm
      locations={locations}
      propertyTypeOptions={propertyTypeOptions}
      variant={variant}
      className={cn(className)}
      initialTransactionType={initialTransactionType}
    />
  );
}
