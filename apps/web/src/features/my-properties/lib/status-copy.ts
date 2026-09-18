import type { ApiPropertyStatus } from '@/types/api/my-property';
import { myPropertiesCopy } from '../config/copy';

export function ownerStatusTitle(status: ApiPropertyStatus): string {
  switch (status) {
    case 'PENDING_REVIEW':
      return 'إعلانك قيد المراجعة';
    case 'PENDING_PAYMENT':
      return 'يرجى إكمال الدفع';
    case 'PUBLISHED':
      return 'الإعلان منشور';
    case 'REJECTED':
      return 'تم رفض الإعلان';
    case 'DRAFT':
      return 'مسودة غير مكتملة';
    case 'ARCHIVED':
      return 'الإعلان مؤرشف';
    case 'EXPIRED':
      return 'انتهى الإعلان';
    default:
      return myPropertiesCopy.statusPageTitle;
  }
}

export function ownerStatusBody(status: ApiPropertyStatus): string {
  switch (status) {
    case 'PENDING_REVIEW':
      return 'إعلانك الآن لدى الإدارة للمراجعة. لن يظهر في نتائج البحث قبل الموافقة.';
    case 'PENDING_PAYMENT':
      return 'تم اختيار باقة النشر. أكمل الدفع لإرسال الإعلان للمراجعة.';
    case 'PUBLISHED':
      return 'إعلانك ظاهر للباحثين. يمكنك فتح صفحة الإعلان العامة من هنا.';
    case 'REJECTED':
      return 'راجع سبب الرفض وعدّل بيانات الإعلان ثم أعد الإرسال.';
    case 'DRAFT':
      return 'يمكنك استكمال بيانات الإعلان من حيث توقفت.';
    case 'ARCHIVED':
      return 'هذا الإعلان غير نشط حاليًا.';
    case 'EXPIRED':
      return 'انتهت مدة نشر هذا الإعلان. يمكنك التجديد لاحقًا عند توفر الخيار.';
    default:
      return 'اطلع على تفاصيل إعلانك.';
  }
}

export function ownerStatusBadgeLabel(status: ApiPropertyStatus): string {
  switch (status) {
    case 'PENDING_PAYMENT':
      return myPropertiesCopy.pendingPaymentBadge;
    case 'PENDING_REVIEW':
      return myPropertiesCopy.pendingReviewBadge;
    case 'PUBLISHED':
      return myPropertiesCopy.statusBadges.published;
    case 'REJECTED':
      return myPropertiesCopy.statusBadges.rejected;
    case 'EXPIRED':
      return myPropertiesCopy.statusBadges.expired;
    case 'ARCHIVED':
      return myPropertiesCopy.statusBadges.deleted;
    case 'DRAFT':
      return myPropertiesCopy.statusBadges.draft;
    default:
      return status;
  }
}

export function ownerNextActionLabel(status: ApiPropertyStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'استكمل بيانات الإعلان';
    case 'PENDING_PAYMENT':
      return 'أكمل الدفع للمتابعة';
    case 'PENDING_REVIEW':
      return 'انتظر نتيجة المراجعة';
    case 'REJECTED':
      return 'عدّل الإعلان ثم أعد الإرسال';
    case 'PUBLISHED':
      return 'عرض الإعلان المنشور';
    case 'EXPIRED':
      return 'التجديد غير متاح حاليًا';
    case 'ARCHIVED':
      return 'لا يوجد إجراء مطلوب';
    default:
      return '—';
  }
}

export function timelineEventLabel(
  toStatus: ApiPropertyStatus,
  fromStatus: ApiPropertyStatus | null,
): string {
  switch (toStatus) {
    case 'PENDING_PAYMENT':
      return 'بانتظار الدفع';
    case 'PENDING_REVIEW':
      return fromStatus === 'PENDING_PAYMENT'
        ? 'تم الدفع وإرسال للمراجعة'
        : 'أُرسل للمراجعة';
    case 'PUBLISHED':
      return 'تم النشر';
    case 'REJECTED':
      return 'تم الرفض';
    case 'ARCHIVED':
      return 'تمت الأرشفة';
    case 'EXPIRED':
      return 'انتهى النشر';
    case 'DRAFT':
      return fromStatus === 'PUBLISHED' ? 'تم إلغاء النشر' : 'مسودة';
    default:
      return 'تغيير الحالة';
  }
}
