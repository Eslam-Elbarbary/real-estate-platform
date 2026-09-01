import 'server-only';

import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { requestRefreshedAccessToken } from '@/features/auth/server-session';
import { getStoredAdminSession } from '@/features/auth/session';
import { logAdminSessionInDev } from '@/lib/dev/admin-session-log';
import { logAdminErrorInDev } from '@/lib/dev/admin-log';
import { AdminError, createAdminError } from '@/lib/errors';
import { isNextNavigationError } from '@/lib/server/is-navigation-error';
import {
  apiRequest,
  type ApiRequestOptions,
  type ApiSuccess,
} from './client';

type AuthenticatedRequestOptions = Omit<ApiRequestOptions, 'accessToken'> & {
  accessToken?: string | null;
};

const SESSION_EXPIRED_LOGOUT = '/api/auth/logout?reason=session-expired';

async function resolveAccessToken(
  explicitToken?: string | null,
  apiPath?: string,
): Promise<string> {
  if (explicitToken) {
    return explicitToken;
  }

  const session = await getStoredAdminSession();
  logAdminSessionInDev('auth:resolve-token', session
    ? {
        user: session.user,
        hasAccessToken: Boolean(session.accessToken),
        hasRefreshToken: Boolean(session.refreshToken),
      }
    : null, {
    path: apiPath,
  });

  if (!session?.accessToken) {
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin session required',
      userMessage: 'يجب تسجيل الدخول.',
    });
  }

  return session.accessToken;
}

function redirectToLoginAfterSessionExpired(): never {
  redirect(SESSION_EXPIRED_LOGOUT);
}

function redirectToForbidden(): never {
  redirect(routes.forbidden);
}

function rethrowIfNavigationError(error: unknown): void {
  if (isNextNavigationError(error)) {
    throw error;
  }
}

function handleAuthFailure(error: AdminError, context: string, extra?: Record<string, unknown>): never {
  logAdminErrorInDev(context, error, extra);

  if (error.code === 'UNAUTHORIZED') {
    redirectToLoginAfterSessionExpired();
  }

  if (error.code === 'FORBIDDEN') {
    redirectToForbidden();
  }

  throw error;
}

export async function authenticatedApiRequest<T>(
  options: AuthenticatedRequestOptions,
): Promise<ApiSuccess<T>> {
  let accessToken: string;

  try {
    accessToken = await resolveAccessToken(options.accessToken, options.path);
  } catch (error) {
    rethrowIfNavigationError(error);
    logAdminErrorInDev('auth:resolve-token', error, { path: options.path });
    if (error instanceof AdminError && error.code === 'UNAUTHORIZED') {
      redirectToLoginAfterSessionExpired();
    }
    throw error;
  }

  try {
    return await apiRequest<T>({
      ...options,
      accessToken,
    });
  } catch (error) {
    rethrowIfNavigationError(error);

    if (
      !(error instanceof AdminError) ||
      error.code !== 'UNAUTHORIZED' ||
      options._retried ||
      options.skipRefresh
    ) {
      if (error instanceof AdminError && (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN')) {
        handleAuthFailure(error, 'api:request', {
          path: options.path,
          method: options.method ?? 'GET',
          retried: options._retried ?? false,
        });
      }

      logAdminErrorInDev('api:request', error, {
        path: options.path,
        method: options.method ?? 'GET',
        retried: options._retried ?? false,
      });
      throw error;
    }

    logAdminErrorInDev('auth:refresh-retry', error, { path: options.path });

    const refreshedAccessToken = await requestRefreshedAccessToken();
    if (!refreshedAccessToken) {
      logAdminErrorInDev('auth:refresh-retry', new Error('Token refresh failed after 401'), {
        path: options.path,
        originalError: {
          code: error.code,
          message: error.message,
          status: error.status,
          details: error.details,
        },
      });
      redirectToLoginAfterSessionExpired();
    }

    try {
      return await apiRequest<T>({
        ...options,
        accessToken: refreshedAccessToken,
        _retried: true,
      });
    } catch (retryError) {
      rethrowIfNavigationError(retryError);

      if (retryError instanceof AdminError && (retryError.code === 'UNAUTHORIZED' || retryError.code === 'FORBIDDEN')) {
        handleAuthFailure(retryError, 'auth:refresh-retry', {
          path: options.path,
          phase: 'after-refresh',
        });
      }

      logAdminErrorInDev('auth:refresh-retry', retryError, {
        path: options.path,
        phase: 'after-refresh',
      });
      throw retryError;
    }
  }
}

export const authenticatedApiClient = {
  get: <T>(
    path: string,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => authenticatedApiRequest<T>({ ...options, method: 'GET', path }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body' | 'formData'>,
  ) => authenticatedApiRequest<T>({ ...options, method: 'POST', path, body }),

  postForm: <T>(
    path: string,
    formData: FormData,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body' | 'formData'>,
  ) =>
    authenticatedApiRequest<T>({
      ...options,
      method: 'POST',
      path,
      formData,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => authenticatedApiRequest<T>({ ...options, method: 'PUT', path, body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => authenticatedApiRequest<T>({ ...options, method: 'PATCH', path, body }),

  delete: <T>(
    path: string,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => authenticatedApiRequest<T>({ ...options, method: 'DELETE', path }),
};
