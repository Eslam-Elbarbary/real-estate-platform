import type { ManagedListingStatus, ManagedListingSort } from '../types';

export const myPropertiesCopy = {
  title: 'عقاراتي',
  profileAlert:
    'يرجى إكمال بياناتك الشخصية في صفحة الإعداد في أقرب وقت ممكن من الصفحة التالية',
  profileAlertCta: 'أكمل بياناتك',
  showRating: 'أظهر التقييم',
  noRatingsYet: 'لا يوجد تقييمات بعد',
  engagementTitle: 'مستوى التفاعل',
  resultsBy: 'النتائج حسب :',
  allYourAds: 'كل إعلاناتك',
  searchTitle: 'ابحث في عقاراتك',
  searchPlaceholder: 'كلمة او رقم الاعلان',
  searchSubmit: 'ابحث',
  advancedSearch: 'بحث متقدم',
  cancel: 'الغاء',
  sortBy: 'الترتيب حسب :',
  advertiseCta: 'أعلن عن عقارك',
  publishedHint:
    'هذا القسم يعرض جميع العقارات المنشورة، يرجى ملاحظة أن العقارات تظل منشورة لمدة 6 أشهر بدءاً من تاريخ نشرها.',
  emptySearch:
    'لا يوجد لديك عقارات تطابق البحث. من فضلك قم بتغيير البحث وحاول مرة أخرى',
  listingIdLabel: 'رقم الإعلان',
  viewsLabel: 'المشاهدات',
  contactsLabel: 'محاولات الاتصال',
  demoActionDone: 'تم تنفيذ الإجراء التجريبي',
  confirmDeleteTitle: 'تأكيد حذف الإعلان',
  confirmRestoreTitle: 'استعادة الإعلان',
  confirmRepublishTitle: 'إعادة نشر الإعلان',
  confirmContinue: 'متابعة',
  confirmCancel: 'إلغاء',
  actions: {
    view: 'عرض الإعلان',
    edit: 'تعديل الإعلان',
    delete: 'حذف',
    restore: 'استعادة',
    republish: 'إعادة نشر',
    continueDraft: 'استكمال الإعلان',
  },
  empty: {
    published: 'لا توجد إعلانات منشورة',
    rejected: 'لا توجد إعلانات مرفوضة',
    expired: 'لا توجد إعلانات منتهية',
    pending: 'لا توجد إعلانات قيد الانتظار',
    deleted: 'لا توجد إعلانات محذوفة',
    draft: 'لا توجد مسودات',
  },
  statusLabels: {
    published: 'الإعلانات المنشورة',
    rejected: 'إعلانات مرفوضة',
    expired: 'الإعلانات المنتهية',
    pending: 'إعلانات قيد الانتظار',
    deleted: 'الإعلانات المحذوفة',
    draft: 'مسودات',
  } satisfies Record<ManagedListingStatus, string>,
  statusBadges: {
    published: 'منشور',
    rejected: 'مرفوض',
    expired: 'منتهي',
    pending: 'قيد المراجعة',
    deleted: 'محذوف',
    draft: 'مسودة',
  } satisfies Record<ManagedListingStatus, string>,
  metrics: {
    totalSearchAppearances: 'إجمالي الظهور في البحث',
    totalViews: 'إجمالي المشاهدات',
    totalContacts: 'إجمالي محاولات الاتصال',
    averageViewRate: 'متوسط نسبة المشاهدة',
    averageContactRate: 'متوسط نسبة الاتصال',
    averageContactCost: 'متوسط تكلفة الاتصال',
  },
  sortLabels: {
    newest: 'الأحدث',
    oldest: 'الأقدم',
    most_viewed: 'الأكثر مشاهدة',
    most_contacted: 'الأكثر تواصلاً',
  } satisfies Record<ManagedListingSort, string>,
  promo: {
    title: 'احصل على أفضل نتائج من منتجات عقارات مصر',
    description:
      'عزّز ظهور إعلاناتك ووصل إلى آلاف الباحثين عن العقارات عبر الباقات الإعلانية.',
  },
} as const;

export const STATUS_TAB_ORDER: ManagedListingStatus[] = [
  'published',
  'rejected',
  'expired',
  'pending',
  'deleted',
  'draft',
];
