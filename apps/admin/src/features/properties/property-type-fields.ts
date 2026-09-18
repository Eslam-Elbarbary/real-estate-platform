/**
 * Re-export shared property-type field rules for admin wizard.
 * Source of truth: @repo/types
 */
export {
  CLEARABLE_DETAIL_FIELDS,
  DEFAULT_PROPERTY_TYPE_FIELDS,
  PROPERTY_TYPE_FIELD_RULES,
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
  normalizePropertyTypeCode,
  type PropertyDetailField as WizardDetailField,
  type PropertyTypeFieldConfig,
} from '@repo/types';
