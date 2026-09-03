export type ApiErrorCode =
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';

export class ApiRequestError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly userMessage: string;

  constructor(options: {
    code: ApiErrorCode;
    message: string;
    userMessage: string;
    status?: number;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = 'ApiRequestError';
    this.code = options.code;
    this.status = options.status;
    this.userMessage = options.userMessage;
  }
}

function isNetworkFailure(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('fetch failed') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('network')
  );
}

export function mapUploadError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.userMessage;
  }

  if (error instanceof TypeError || (error instanceof Error && isNetworkFailure(error))) {
    return 'تعذر الاتصال بالخادم. تأكد من تشغيل خدمة الـ API ثم أعد المحاولة.';
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'فشل رفع الصورة. حاول مرة أخرى.';
}

export function createApiErrorFromResponse(
  status: number,
  body: unknown,
  fallback: string,
): ApiRequestError {
  const message = extractNestMessage(body, fallback);

  if (status === 401) {
    return new ApiRequestError({
      code: 'UNAUTHORIZED',
      message,
      userMessage: 'انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.',
      status,
    });
  }

  if (status === 400 || status === 413 || status === 422) {
    const lower = message.toLowerCase();
    if (lower.includes('large') || lower.includes('size') || lower.includes('limit')) {
      return new ApiRequestError({
        code: 'VALIDATION',
        message,
        userMessage: 'حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.',
        status,
      });
    }

    if (lower.includes('type') || lower.includes('mime') || lower.includes('format')) {
      return new ApiRequestError({
        code: 'VALIDATION',
        message,
        userMessage: 'صيغة الملف غير مدعومة. استخدم JPG أو PNG أو WebP.',
        status,
      });
    }

    return new ApiRequestError({
      code: 'VALIDATION',
      message,
      userMessage: message || 'الملف غير صالح.',
      status,
    });
  }

  if (status >= 500) {
    return new ApiRequestError({
      code: 'SERVER',
      message,
      userMessage: 'فشل رفع الصورة. حاول مرة أخرى.',
      status,
    });
  }

  return new ApiRequestError({
    code: 'UNKNOWN',
    message,
    userMessage: message || 'فشل رفع الصورة.',
    status,
  });
}

function extractNestMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const nest = body as { message?: string | string[] };
  if (Array.isArray(nest.message)) {
    return nest.message.filter(Boolean).join(' — ') || fallback;
  }

  if (typeof nest.message === 'string' && nest.message.trim()) {
    return nest.message;
  }

  return fallback;
}
