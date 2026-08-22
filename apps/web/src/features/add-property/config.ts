import type {
  ListingAmenityId,
  ListingDraftStep,
  ListingRegistrationStatus,
  ListingViewType,
} from './types';
import type { FinishingType, PropertyType } from '@/types';

export const LISTING_STEPS: {
  id: ListingDraftStep;
  label: string;
}[] = [
  { id: 'basic', label: 'المعلومات الأساسية' },
  { id: 'details', label: 'تفاصيل العقار والمزايا' },
  { id: 'price', label: 'سعر العقار' },
  { id: 'description', label: 'وصف العقار' },
  { id: 'media', label: 'الفيديوهات والصور' },
  { id: 'publish', label: 'النشر' },
];

export const listingCopy = {
  continue: 'متابعة',
  chooseSection: 'اختر القسم',
  sale: 'للبيع',
  rent: 'للإيجار',
  propertyType: 'نوع العقار',
  propertyTypePlaceholder: 'اختر نوع العقار',
  location: 'الموقع',
  locationPlaceholder: 'ابحث',
  mapTitle: 'موقع العقار على الخريطة',
  feeNotice: (amount: number) => `سعر الإعلان لهذا الموقع ${amount.toLocaleString('en-US')} ج.م`,
  area: 'المساحة (بالمتر)',
  bedrooms: 'عدد الغرف',
  bathrooms: 'عدد الحمامات',
  floor: 'الدور',
  year: 'سنة البناء أو التسليم',
  views: 'الإطلالة',
  finishing: 'نوع التشطيب',
  registration: 'حالة التسجيل في الشهر العقاري',
  mortgage: 'عقارك قابل للتمويل العقاري؟',
  amenities: 'مزايا العقار',
  paymentMethod: 'طريقة الدفع',
  developer: 'من المطور',
  ownerCash: 'من المالك (نقداً)',
  ownerInstallments: 'من المالك (متبقي أقساط)',
  price: 'السعر',
  installmentTotal: 'سعر التقسيط الكلي',
  downPayment: 'المقدم',
  installmentDuration: 'مدة التقسيط',
  years: 'سنوات',
  months: 'شهور',
  monthlyInstallment: (amount: number) =>
    `القسط الشهري ${amount.toLocaleString('en-US')} ج.م/ شهر`,
  downPaymentPercent: (pct: number) => `نسبة المقدم: ${pct}%`,
  contractPrice: 'سعر العقد',
  overPrice: 'الزيادة المطلوبة - Over Price (اختياري)',
  maintenance: 'وديعة الصيانة (اختياري)',
  totalPaid: 'إجمالي المبلغ المدفوع',
  remainingPeriod: 'مدة التقسيط المتبقية',
  rentPrice: 'سعر الإيجار',
  descriptionTitle: 'وصف العقار',
  arTab: 'عربي',
  enTab: 'English',
  listingNameAr: 'اسم الإعلان',
  listingDescAr: 'وصف العقار',
  listingAddressAr: 'عنوان العقار',
  listingNameEn: 'Listing Name',
  listingDescEn: 'Listing Description',
  listingAddressEn: 'Property Address',
  autoGenerate: 'أنشئ تلقائي',
  autoGenerateEn: 'Auto Generate',
  mediaTitle: 'الفيديوهات والصور',
  photos: 'صور العقار',
  addPhotos: 'أضف الصور هنا',
  maxSize: 'أكبر حجم: 30 ميجابايت',
  videoUrl: 'رابط الفيديو (اختياري)',
  videoPlaceholder: 'أضف رابط الفيديو يوتيوب',
  publishTitle: 'نشر الإعلان',
  listingFeeLabel: 'تكلفة الإعلان',
  payNow: 'ادفع الآن',
  checkoutPaymentTitle: 'بيانات الدفع',
  checkoutSummaryTitle: 'ملخص الدفع',
  addCard: 'اضف بطاقة جديدة',
  totalDue: 'إجمالي المستحق',
  payAndPublish: 'ادفع وانشر إعلانك',
  tipsTitle: 'نصائح لإعلان أفضل',
  egp: 'جنيه مصري',
} as const;

export const listingViewOptions: { value: ListingViewType; label: string }[] = [
  { value: 'main_street', label: 'شارع رئيسي' },
  { value: 'side_street', label: 'شارع فرعي' },
  { value: 'corner', label: 'ناصية' },
  { value: 'rear', label: 'خلفي' },
  { value: 'garden', label: 'حديقة' },
  { value: 'nile', label: 'النيل' },
  { value: 'lake', label: 'بحيرة' },
  { value: 'pool', label: 'حمام سباحة' },
  { value: 'sea', label: 'بحر' },
  { value: 'plaza', label: 'بلازا' },
  { value: 'golf', label: 'جولف' },
  { value: 'club', label: 'نادي' },
  { value: 'other', label: 'أخرى' },
];

export const listingFinishingOptions: {
  value: FinishingType | 'extra_super_lux';
  label: string;
}[] = [
  { value: 'extra_super_lux', label: 'اكسترا سوبر لوكس' },
  { value: 'super_lux', label: 'سوبر لوكس' },
  { value: 'lux', label: 'لوكس' },
  { value: 'semi_finished', label: 'نصف تشطيب' },
  { value: 'unfinished', label: 'بدون تشطيب' },
];

export const listingRegistrationOptions: {
  value: ListingRegistrationStatus;
  label: string;
}[] = [
  { value: 'registered', label: 'مسجل' },
  { value: 'registerable', label: 'قابل للتسجيل' },
  { value: 'urban_communities', label: 'مسجل بهيئة المجتمعات العمرانية' },
  { value: 'unsure', label: 'لست متأكدًا' },
];

export const listingAmenityOptions: {
  value: ListingAmenityId;
  label: string;
}[] = [
  { value: 'security', label: 'أمن' },
  { value: 'elevator', label: 'مصعد' },
  { value: 'landline', label: 'هاتف أرضي' },
  { value: 'private_garden', label: 'حديقة خاصة' },
  { value: 'natural_gas', label: 'عداد غاز طبيعي' },
  { value: 'balcony', label: 'شرفة' },
  { value: 'maid_room', label: 'غرفة خدم' },
  { value: 'covered_garage', label: 'جراج مغطى' },
  { value: 'kitchen_appliances', label: 'أجهزة مطبخ' },
  { value: 'kids_area', label: 'منطقة ألعاب للأطفال' },
  { value: 'ac', label: 'تكييف' },
  { value: 'water_meter', label: 'عداد مياه' },
  { value: 'pool', label: 'حمام سباحة' },
  { value: 'electricity_meter', label: 'عداد كهرباء' },
  { value: 'pets_allowed', label: 'مسموح بالحيوانات الأليفة' },
];

export const DEMO_PROPERTY_IMAGES = [
  '/assets/properties/property-01.webp',
  '/assets/properties/property-02.webp',
  '/assets/properties/property-03.webp',
  '/assets/properties/property-04.webp',
  '/assets/properties/property-05.webp',
] as const;

/** Residential-style fields visibility by property type. */
export function detailsFieldVisibility(propertyType: PropertyType | null): {
  bedrooms: boolean;
  bathrooms: boolean;
  floor: boolean;
  views: boolean;
  finishing: boolean;
} {
  if (!propertyType) {
    return {
      bedrooms: true,
      bathrooms: true,
      floor: true,
      views: true,
      finishing: true,
    };
  }
  if (propertyType === 'land') {
    return {
      bedrooms: false,
      bathrooms: false,
      floor: false,
      views: false,
      finishing: false,
    };
  }
  if (propertyType === 'office' || propertyType === 'shop') {
    return {
      bedrooms: false,
      bathrooms: true,
      floor: true,
      views: true,
      finishing: true,
    };
  }
  return {
    bedrooms: true,
    bathrooms: true,
    floor: true,
    views: true,
    finishing: true,
  };
}
