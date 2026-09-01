import 'server-only';

import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { logAdminErrorInDev } from '@/lib/dev/admin-log';
import { AdminError, getUserFacingErrorMessage } from '@/lib/errors';
import { isNextNavigationError } from '@/lib/server/is-navigation-error';

const SESSION_EXPIRED_LOGOUT = '/api/auth/logout?reason=session-expired';

/**
 * Maps known Admin API failures to navigation outcomes in Server Components.
 * Re-throws unexpected errors for the route error boundary.
 */
export function handleAdminPageError(error: unknown): never {
  if (isNextNavigationError(error)) {
    throw error;
  }

  if (error instanceof AdminError) {
    logAdminErrorInDev('page', error, {
      userMessage: error.userMessage,
    });

    if (error.code === 'UNAUTHORIZED') {
      redirect(SESSION_EXPIRED_LOGOUT);
    }

    if (error.code === 'FORBIDDEN') {
      redirect(routes.forbidden);
    }

    throw new AdminError({
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      status: error.status,
      details: error.details,
      cause: error.cause,
    });
  }

  if (error instanceof Error && error.name === 'AdminError') {
    logAdminErrorInDev('page', error);
    throw error;
  }

  throw error;
}

export function getAdminPageErrorMessage(error: unknown): string {
  return getUserFacingErrorMessage(error);
}
