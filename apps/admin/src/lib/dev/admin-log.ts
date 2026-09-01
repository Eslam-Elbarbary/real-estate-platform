import { AdminError } from '@/lib/errors';

export function logAdminErrorInDev(
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (error instanceof AdminError) {
    console.error(`[admin:${context}]`, {
      code: error.code,
      message: error.message,
      status: error.status,
      userMessage: error.userMessage,
      details: error.details,
      ...extra,
    });
    return;
  }

  console.error(`[admin:${context}]`, error, extra);
}
