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
  const trimmed = message.trim();
  return (
    trimmed.length > 0 &&
    trimmed !== 'NEXT_REDIRECT' &&
    trimmed !== 'NEXT_NOT_FOUND'
  );
}

export function getAdminErrorMessage(error: unknown): string {
  if (error instanceof AdminError) {
    if (error.code === 'SERVER' || error.code === 'NETWORK' || error.code === 'TIMEOUT') {
      return error.userMessage;
    }

    // Surface concrete validation / domain messages (e.g. DTO whitelist errors).
    if (error.code === 'VALIDATION') {
      if (isMeaningfulMessage(error.message) && error.message !== 'Validation failed') {
        return error.message;
      }
      if (error.details && typeof error.details === 'object') {
        const details = error.details as { errors?: unknown };
        if (Array.isArray(details.errors) && details.errors.length > 0) {
          const parts = details.errors
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim());
          if (parts.length > 0) {
            return parts.join(' — ');
          }
        }
      }
      if (isMeaningfulMessage(error.userMessage)) {
        return error.userMessage;
      }
    }

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
