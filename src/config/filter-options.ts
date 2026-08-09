export interface FilterChipOption {
  value: string;
  label: string;
}

/** Centralized property-type chips for advanced search. */
export const filterPropertyTypeOptions: FilterChipOption[] = [
  { value: 'all', label: 'عقارات' },
  { value: 'apartment', label: 'شقق' },
  { value: 'furnished_apartment', label: 'شقق مفروشة' },
  { value: 'chalet', label: 'شاليهات' },
  { value: 'villa', label: 'فلل' },
  { value: 'land', label: 'أراضي' },
  { value: 'building', label: 'مباني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'office', label: 'إداري' },
  { value: 'medical', label: 'طبي' },
  { value: 'other', label: 'عقارات أخرى' },
];

export const filterPaymentOptions: FilterChipOption[] = [
  { value: 'cash', label: 'نقدًا' },
  { value: 'installment', label: 'تقسيط' },
  { value: 'remaining_installments', label: 'متبقي أقساط' },
];

export const filterViewOptions: FilterChipOption[] = [
  { value: 'all', label: 'كل الخيارات' },
  { value: 'main_street', label: 'شارع رئيسي' },
  { value: 'side_street', label: 'شارع فرعي' },
  { value: 'corner', label: 'ناصية' },
  { value: 'rear', label: 'خلفي' },
  { value: 'garden', label: 'حديقة' },
  { value: 'pool', label: 'حمام سباحة' },
  { value: 'sea', label: 'البحر' },
  { value: 'nile', label: 'النيل' },
  { value: 'golf', label: 'جولف' },
  { value: 'plaza', label: 'بلازا' },
  { value: 'club', label: 'نادي' },
  { value: 'lake', label: 'بحيرة' },
  { value: 'other', label: 'أخرى' },
];

/** Mock distribution bars for the price histogram (visual only). */
export const PRICE_HISTOGRAM_BARS = [
  12, 18, 28, 45, 62, 78, 90, 85, 72, 58, 44, 36, 30, 24, 20, 16, 14, 12, 10,
  8, 7, 6, 5, 4, 3, 3, 2, 2, 1, 1,
] as const;

export const AREA_HISTOGRAM_BARS = [
  8, 14, 22, 36, 55, 70, 82, 76, 64, 50, 40, 32, 26, 20, 16, 12, 10, 8, 6, 5,
  4, 3, 2, 2,
] as const;

export const FILTER_PRICE_BOUNDS = {
  min: 100_000,
  max: 500_000_000,
} as const;

export const FILTER_AREA_BOUNDS = {
  min: 10,
  max: 5_000,
} as const;

export const DOMAIN_PROPERTY_TYPES = [
  'apartment',
  'villa',
  'townhouse',
  'duplex',
  'penthouse',
  'studio',
  'chalet',
  'office',
  'shop',
  'land',
] as const;
