export const activityCopy = {
  activityTitle: 'نشاطاتي',
  favorites: {
    title: 'مفضلاتي',
    seoDescription: 'العقارات المحفوظة في حسابك.',
    pill: 'العقارات المحفوظة',
    section: 'عقارات محفوظة',
    empty: 'ليس لديك أي عقارات محفوظة',
    cta: 'ابدأ بالإضافة الآن',
  },
  notes: {
    title: 'ملاحظاتي',
    seoDescription: 'ملاحظاتك على العقارات أثناء التصفح.',
    pill: 'ملاحظاتي',
    section: 'ملاحظاتي',
    empty: 'ليس لديك أي ملاحظات حتى الآن',
    cta: 'ابدأ بإضافة ملاحظة',
    modalTitle: 'إضافة ملاحظة',
    placeholder: 'اكتب ملاحظتك هنا…',
    save: 'حفظ',
    cancel: 'إلغاء',
    success: 'تم حفظ الملاحظة',
  },
  notifications: {
    title: 'الإشعارات',
    seoDescription: 'إشعارات حسابك العقاري.',
    empty: 'لا توجد اي إشعارات',
    promoTitle: 'دليل الكمبوندات',
    promoDescription:
      'حدد أولويات بحثك عن الكمبوندات واكتشف المشروعات الأنسب لك عبر تطبيق عقارات مصر.',
  },
  alerts: {
    title: 'تنبيهاتي',
    seoDescription: 'إدارة تنبيهات البحث العقاري.',
    regionsTitle: 'مناطق البحث',
    sidebarTitle: 'المنبه العقاري',
    sidebarHint:
      'سجل في هذه الخدمة لكي نرسل لك كلما يتم إضافة عقارات تناسبك.',
    location: 'المنطقة',
    type: 'النوع',
    section: 'القسم',
    minPrice: 'أقل سعر',
    maxPrice: 'أعلى سعر',
    minArea: 'أقل مساحة',
    maxArea: 'أكبر مساحة',
    subscribe: 'اشترك',
    success: 'تم إنشاء التنبيه بنجاح',
    enabled: 'مفعّل',
    disabled: 'متوقف',
    selectLocation: 'اختر منطقة',
    noLocations: 'اختر منطقة واحدة على الأقل',
  },
  profileAlert:
    'يرجى إكمال بياناتك الشخصية في صفحة الإعداد في أقرب وقت ممكن من الصفحة التالية',
  profileAlertCta: 'أكمل بياناتك',
} as const;

export const ALERT_AREA_OPTIONS = [
  50, 80, 100, 120, 150, 180, 200, 250, 300, 400, 500,
] as const;
