import type {
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
  { id: 'publish', label: 'مراجعة البيانات والباقة' },
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
  publishTitle: 'مراجعة البيانات والباقة',
  listingFeeLabel: 'تكلفة الإعلان',
  payNow: 'ادفع الآن',
  checkoutPaymentTitle: 'إتمام الدفع',
  checkoutSummaryTitle: 'ملخص الباقة',
  addCard: 'اضف بطاقة جديدة',
  totalDue: 'إجمالي المستحق',
  payAndPublish: 'ادفع وأرسل للمراجعة',
  tipsTitle: 'نصائح لإعلان أفضل',
  egp: 'جنيه مصري',
  completionTitle: 'اكتمال بيانات الإعلان',
  completionReady: 'بيانات الإعلان مكتملة ويمكن اختيار الباقة.',
  completionIncomplete: 'أكمل الحقول التالية قبل اختيار الباقة أو الإرسال.',
  plansTitle: 'اختر باقة النشر',
  selectPlan: 'اختيار هذه الباقة',
  planDuration: (days: number) => `المدة: ${days} يوم`,
  planFree: 'مجانية',
  submittedTitle: 'تم إرسال العقار للمراجعة',
  submittedBody:
    'إعلانك الآن في انتظار مراجعة الإدارة. لن يظهر في السوق قبل الموافقة.',
  viewMyProperties: 'عرض عقاراتي',
  viewPropertyStatus: 'عرض حالة العقار',
  waitingReviewTitle: 'الإعلان قيد المراجعة',
  waitingReviewBody: 'تم استلام إعلانك وهو الآن في انتظار موافقة الإدارة.',
  publishedTitle: 'الإعلان منشور',
  publishedBody: 'تمت الموافقة على إعلانك وهو ظاهر في السوق.',
  rejectedTitle: 'تم رفض العقار',
  rejectedBody:
    'تم رفض العقار. يرجى مراجعة بيانات العقار وتعديلها ثم إعادة الإرسال.',
  resubmit: 'إعادة الإرسال للمراجعة',
  editListing: 'تعديل الإعلان',
  paySubscription: 'إتمام الدفع',
  paymentSuccessTitle: 'تم الدفع بنجاح',
  paymentSuccessBody: 'تم إرسال العقار للمراجعة بعد إتمام الدفع.',
  pendingPaymentTitle: 'بانتظار الدفع',
  pendingPaymentBody: 'اختر باقة مدفوعة. أكمل الدفع لإرسال الإعلان للمراجعة.',
} as const;

export const completionFieldLabels: Record<string, string> = {
  title: 'عنوان الإعلان',
  propertyTypeId: 'نوع العقار',
  transactionTypeId: 'نوع العملية (بيع / إيجار)',
  areaId: 'المنطقة',
  price: 'السعر',
  images: 'صورة واحدةً على الأقل',
};

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

/** Legacy demo assets for unfinished publish/checkout cookie shell only. */
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
