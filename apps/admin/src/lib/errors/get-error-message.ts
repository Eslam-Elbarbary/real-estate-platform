import { AdminError, type AdminErrorCode } from './admin-error';

const CODE_MESSAGES: Partial<Record<AdminErrorCode, string>> = {
  UNAUTHORIZED: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.',
  FORBIDDEN: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
  NOT_FOUND: 'العنصر المطلوب غير موجود.',
  VALIDATION: 'تحقق من البيانات المدخلة.',
  TIMEOUT: 'انتهت مهلة الاتصال بالخادم.',
  UNKNOWN: 'حدث خطأ غير متوقع، حاول مرة أخرى.',
};

const FALLBACK_MESSAGE = CODE_MESSAGES.UNKNOWN!;

function isMeaningfulMessage(message: string): boolean {
  return message.trim().length > 0;
}

export function getAdminErrorMessage(error: unknown): string {
  if (error instanceof AdminError) {
    return CODE_MESSAGES[error.code] ?? error.userMessage;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    if (isMeaningfulMessage(message)) {
      return message;
    }
  }

  if (typeof error === 'string') {
    const message = error.trim();
    if (isMeaningfulMessage(message)) {
      return message;
    }
  }

  return FALLBACK_MESSAGE;
}
