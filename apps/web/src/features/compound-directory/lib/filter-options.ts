import { getPropertyTypeLabel } from '@/config/property-types';
import { uiLabels } from '@/config/labels';
import type {
  CompoundConstructionStatus,
  CompoundPaymentMethod,
  CompoundPriceLevel,
  FinishingType,
  PropertyType,
} from '@/types';

export const compoundLocationFilterOptions = [
  { slug: 'north-coast', label: 'الساحل الشمالي' },
  { slug: 'alexandria', label: 'الإسكندرية' },
  { slug: 'cairo', label: 'القاهرة' },
  { slug: 'new-administrative-capital', label: 'العاصمة الإدارية الجديدة' },
  { slug: 'giza', label: 'الجيزة' },
  { slug: 'new-cairo', label: 'القاهرة الجديدة' },
  { slug: 'sheikh-zayed', label: 'الشيخ زايد' },
  { slug: '6th-october', label: '٦ أكتوبر' },
  { slug: 'fifth-settlement', label: 'التجمع الخامس' },
  { slug: 'r7', label: 'R7' },
  { slug: 'downtown-new-cairo', label: 'الداون تاون' },
  { slug: 'ras-el-hekma', label: 'رأس الحكمة' },
] as const;

export const popularLocationChips = [
  {
    slugs: ['cairo', 'new-cairo'],
    label: 'كمبوندات القاهرة الجديدة',
  },
  {
    slugs: ['giza', '6th-october'],
    label: 'كمبوندات 6 أكتوبر',
  },
  {
    slugs: ['cairo', 'new-cairo', 'downtown-new-cairo'],
    label: 'كمبوندات الداون تاون',
  },
  {
    slugs: ['giza', 'sheikh-zayed'],
    label: 'كمبوندات الشيخ زايد',
  },
  {
    slugs: ['cairo', 'new-administrative-capital', 'r7'],
    label: 'كمبوندات R7',
  },
  {
    slugs: ['north-coast'],
    label: 'كمبوندات الساحل الشمالي',
  },
  {
    slugs: ['alexandria'],
    label: 'كمبوندات الإسكندرية',
  },
  {
    slugs: ['cairo', 'new-cairo', 'fifth-settlement'],
    label: 'كمبوندات التجمع الخامس',
  },
] as const;

export const compoundPropertyTypeFilterOptions: PropertyType[] = [
  'apartment',
  'chalet',
  'villa',
  'shop',
  'office',
];

export function compoundPropertyTypeLabel(type: PropertyType): string {
  switch (type) {
    case 'apartment':
      return 'شقق';
    case 'chalet':
      return 'شاليهات';
    case 'villa':
      return 'فلل';
    case 'shop':
      return 'تجاري';
    case 'office':
      return 'إداري';
    case 'townhouse':
      return 'تاون هاوس';
    default:
      return getPropertyTypeLabel(type);
  }
}

export const compoundPriceLevelOptions: Array<{
  value: CompoundPriceLevel;
  label: string;
}> = [
  { value: 'economy', label: 'اقتصادي' },
  { value: 'mid', label: 'متوسط' },
  { value: 'premium', label: 'مميز' },
  { value: 'luxury', label: 'فاخر' },
];

export const compoundConstructionStatusOptions: Array<{
  value: CompoundConstructionStatus;
  label: string;
}> = [
  { value: 'planning', label: 'قيد التخطيط' },
  { value: 'under_construction', label: 'قيد الإنشاء' },
  { value: 'ready', label: 'جاهز للتسليم' },
  { value: 'delivered', label: 'تم التسليم' },
];

export const compoundFinishingOptions: Array<{
  value: FinishingType;
  label: string;
}> = [
  { value: 'semi_finished', label: uiLabels.finishingSemi },
  { value: 'finished', label: uiLabels.finishingFinished },
  { value: 'lux', label: uiLabels.finishingLux },
  { value: 'super_lux', label: uiLabels.finishingSuperLux },
];

export const compoundPaymentOptions: Array<{
  value: CompoundPaymentMethod;
  label: string;
}> = [
  { value: 'cash', label: uiLabels.paymentCash },
  { value: 'installment', label: uiLabels.paymentInstallment },
  { value: 'cash_or_installment', label: uiLabels.paymentCashOrInstallment },
];

export const compoundSortOptions = [
  { value: 'recommended' as const, label: uiLabels.sortRecommended },
  { value: 'newest' as const, label: uiLabels.sortNewest },
  { value: 'price_low' as const, label: uiLabels.sortPriceAsc },
  { value: 'price_high' as const, label: uiLabels.sortPriceDesc },
];
