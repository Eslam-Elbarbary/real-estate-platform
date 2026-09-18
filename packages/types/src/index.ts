/**
 * Shared TypeScript types / rules for web, admin, and api.
 */
export type Id = string;

export {
  CLEARABLE_DETAIL_FIELDS,
  DEFAULT_PROPERTY_TYPE_FIELDS,
  PROPERTY_TYPE_FIELD_RULES,
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
  normalizePropertyTypeCode,
  type PropertyDetailField,
  type PropertyTypeFieldConfig,
} from './property-type-fields';

export {
  buildLocationSummaryLabel,
  isPropertyLocationComplete,
  type PropertyLocationInput,
  type PropertyLocationNamedRef,
  type PropertyLocationSummary,
} from './property-location';
