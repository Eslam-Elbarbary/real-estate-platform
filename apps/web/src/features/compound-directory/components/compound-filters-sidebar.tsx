'use client';

import { uiLabels } from '@/config/labels';
import type { CompoundSearchAggregations, CompoundSearchFilters } from '@/types';
import {
  compoundConstructionStatusOptions,
  compoundFinishingOptions,
  compoundLocationFilterOptions,
  compoundPaymentOptions,
  compoundPriceLevelOptions,
  compoundPropertyTypeFilterOptions,
  compoundPropertyTypeLabel,
} from '../lib/filter-options';
import {
  hrefForConstructionStatus,
  hrefForFinishingToggle,
  hrefForLocationToggle,
  hrefForPaymentToggle,
  hrefForPriceLevel,
  hrefForPropertyTypeToggle,
} from '../lib/toggle-filter';
import { CompoundFilterSection } from './compound-filter-section';
import { FilterCheckboxRow } from './filter-checkbox-row';

interface CompoundFiltersSidebarProps {
  filters: CompoundSearchFilters;
  aggregations: CompoundSearchAggregations;
  className?: string;
}

export function CompoundFiltersSidebar({
  filters,
  aggregations,
  className,
}: CompoundFiltersSidebarProps) {
  return (
    <aside className={className}>
      <p className="mb-1.5 text-[13px] font-bold leading-5 text-ink-900">
        {uiLabels.compoundsFilterResults}
      </p>

      <CompoundFilterSection
        title={uiLabels.compoundsFilterLocations}
        defaultOpen
      >
        {compoundLocationFilterOptions.map((option) => (
          <FilterCheckboxRow
            key={option.slug}
            label={option.label}
            count={aggregations.locations[option.slug] ?? 0}
            checked={Boolean(filters.locationSlugs?.includes(option.slug))}
            href={hrefForLocationToggle(filters, option.slug)}
            hasChildren={
              option.slug === 'cairo' ||
              option.slug === 'giza' ||
              option.slug === 'new-cairo' ||
              option.slug === 'north-coast' ||
              option.slug === 'new-administrative-capital'
            }
          />
        ))}
      </CompoundFilterSection>

      <CompoundFilterSection
        title={uiLabels.compoundsFilterPropertyTypes}
        defaultOpen
      >
        {compoundPropertyTypeFilterOptions.map((type) => (
          <FilterCheckboxRow
            key={type}
            label={compoundPropertyTypeLabel(type)}
            count={aggregations.propertyTypes[type] ?? 0}
            checked={Boolean(filters.propertyTypes?.includes(type))}
            href={hrefForPropertyTypeToggle(filters, type)}
          />
        ))}
      </CompoundFilterSection>

      <CompoundFilterSection title={uiLabels.compoundsFilterPriceLevel}>
        {compoundPriceLevelOptions.map((option) => (
          <FilterCheckboxRow
            key={option.value}
            label={option.label}
            count={aggregations.priceLevels[option.value] ?? 0}
            checked={filters.priceLevel === option.value}
            href={hrefForPriceLevel(filters, option.value)}
          />
        ))}
      </CompoundFilterSection>

      <CompoundFilterSection title={uiLabels.compoundsFilterConstruction}>
        {compoundConstructionStatusOptions.map((option) => (
          <FilterCheckboxRow
            key={option.value}
            label={option.label}
            count={aggregations.constructionStatuses[option.value] ?? 0}
            checked={filters.constructionStatus === option.value}
            href={hrefForConstructionStatus(filters, option.value)}
          />
        ))}
      </CompoundFilterSection>

      <CompoundFilterSection title={uiLabels.compoundsFilterFinishing}>
        {compoundFinishingOptions.map((option) => (
          <FilterCheckboxRow
            key={option.value}
            label={option.label}
            count={aggregations.finishingTypes[option.value] ?? 0}
            checked={Boolean(filters.finishingTypes?.includes(option.value))}
            href={hrefForFinishingToggle(filters, option.value)}
          />
        ))}
      </CompoundFilterSection>

      <CompoundFilterSection title={uiLabels.compoundsFilterPayment}>
        {compoundPaymentOptions.map((option) => (
          <FilterCheckboxRow
            key={option.value}
            label={option.label}
            count={aggregations.paymentMethods[option.value] ?? 0}
            checked={Boolean(filters.paymentMethods?.includes(option.value))}
            href={hrefForPaymentToggle(filters, option.value)}
          />
        ))}
      </CompoundFilterSection>
    </aside>
  );
}
