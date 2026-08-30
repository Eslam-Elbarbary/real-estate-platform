export type AdminErrorCode =
  | 'UNKNOWN'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER';

export class AdminError extends Error {
  readonly code: AdminErrorCode;
  readonly status?: number;
  readonly details?: unknown;
  readonly userMessage: string;

  constructor(options: {
    code: AdminErrorCode;
    message: string;
    userMessage?: string;
    status?: number;
    details?: unknown;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = 'AdminError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
    this.userMessage = options.userMessage ?? options.message;
  }
}

const DEFAULT_USER_MESSAGES: Record<AdminErrorCode, string> = {
  UNKNOWN: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
  NETWORK: 'تعذر الاتصال بالخادم. تحقق من الشبكة ثم أعد المحاولة.',
  TIMEOUT: 'انتهت مهلة الطلب. حاول مرة أخرى.',
  UNAUTHORIZED: 'يجب تسجيل الدخول للمتابعة.',
  FORBIDDEN: 'ليست لديك صلاحية لتنفيذ هذا الإجراء.',
  NOT_FOUND: 'العنصر المطلوب غير موجود.',
  VALIDATION: 'البيانات المدخلة غير صالحة.',
  CONFLICT: 'تعارض في البيانات. حدّث الصفحة وحاول مرة أخرى.',
  RATE_LIMITED: 'عدد المحاولات كبير. انتظر قليلاً ثم أعد المحاولة.',
  SERVER: 'حدث خطأ في الخادم. حاول لاحقًا.',
};

export function getUserFacingErrorMessage(error: unknown): string {
  if (error instanceof AdminError) {
    return error.userMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return DEFAULT_USER_MESSAGES.UNKNOWN;
}

export function createAdminError(
  code: AdminErrorCode,
  options?: {
    message?: string;
    userMessage?: string;
    status?: number;
    details?: unknown;
    cause?: unknown;
  },
): AdminError {
  const fallback = DEFAULT_USER_MESSAGES[code];
  return new AdminError({
    code,
    message: options?.message ?? fallback,
    userMessage: options?.userMessage ?? fallback,
    status: options?.status,
    details: options?.details,
    cause: options?.cause,
  });
}

export function mapHttpStatusToErrorCode(status: number): AdminErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'VALIDATION';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'SERVER';
  if (status >= 400) return 'VALIDATION';
  return 'UNKNOWN';
}

export function toAdminError(error: unknown): AdminError {
  if (error instanceof AdminError) {
    return error;
  }

  if (error instanceof TypeError) {
    return createAdminError('NETWORK', {
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return createAdminError('UNKNOWN', {
      message: error.message,
      cause: error,
    });
  }

  return createAdminError('UNKNOWN', {
    details: error,
  });
}
