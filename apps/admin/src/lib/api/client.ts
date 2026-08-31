import { env } from '@/config/env';
import {
  AdminError,
  createAdminError,
  mapHttpStatusToErrorCode,
  toAdminError,
} from '@/lib/errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: HeadersInit;
  /** Bearer access token when auth is wired. */
  accessToken?: string | null;
  signal?: AbortSignal;
  /** Request timeout in milliseconds. Defaults to 30s. */
  timeoutMs?: number;
  /** Skip automatic access-token refresh on 401. */
  skipRefresh?: boolean;
  /** @internal Ensures a failed request is retried at most once after refresh. */
  _retried?: boolean;
}

export interface ApiSuccess<T> {
  data: T;
  status: number;
}

interface NestErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function buildUrl(path: string, query?: ApiRequestOptions['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, ensureTrailingSlash(env.apiBaseUrl));

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function ensureTrailingSlash(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const nestBody = body as NestErrorBody;
  if (Array.isArray(nestBody.message)) {
    return nestBody.message.filter(Boolean).join(' — ') || fallback;
  }

  if (typeof nestBody.message === 'string' && nestBody.message.trim()) {
    return nestBody.message;
  }

  if (typeof nestBody.error === 'string' && nestBody.error.trim()) {
    return nestBody.error;
  }

  return fallback;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : null;
}

async function performApiRequest<T>(
  options: ApiRequestOptions,
): Promise<ApiSuccess<T>> {
  const {
    method = 'GET',
    path,
    query,
    body,
    headers,
    accessToken,
    signal,
    timeoutMs = 30_000,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const requestHeaders = new Headers(headers);
    if (body !== undefined && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
    if (!requestHeaders.has('Accept')) {
      requestHeaders.set('Accept', 'application/json');
    }

    const response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    const parsed = await parseBody(response);

    if (!response.ok) {
      const code = mapHttpStatusToErrorCode(response.status);
      const message = extractErrorMessage(
        parsed,
        `Request failed with status ${response.status}`,
      );

      throw createAdminError(code, {
        message,
        status: response.status,
        details: parsed,
      });
    }

    return {
      data: parsed as T,
      status: response.status,
    };
  } catch (error) {
    const isAbort =
      (error instanceof DOMException && error.name === 'AbortError') ||
      (error instanceof Error && error.name === 'AbortError');

    if (isAbort) {
      if (signal?.aborted) {
        throw createAdminError('UNKNOWN', {
          message: 'Request aborted',
          userMessage: 'تم إلغاء الطلب.',
          cause: error,
        });
      }

      throw createAdminError('TIMEOUT', {
        message: 'Request timed out',
        cause: error,
      });
    }

    throw toAdminError(error);
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);
  }
}

function shouldAttemptRefresh(
  error: unknown,
  options: ApiRequestOptions,
): boolean {
  if (options.skipRefresh || options._retried) {
    return false;
  }

  if (!(error instanceof AdminError) || error.code !== 'UNAUTHORIZED') {
    return false;
  }

  return Boolean(options.accessToken);
}

async function retryWithRefreshedToken<T>(
  options: ApiRequestOptions,
): Promise<ApiSuccess<T>> {
  if (typeof window !== 'undefined') {
    throw createAdminError('UNAUTHORIZED');
  }

  const { refreshAdminSessionAction } = await import('@/features/auth/actions');
  const accessToken = await refreshAdminSessionAction();

  if (!accessToken) {
    throw createAdminError('UNAUTHORIZED');
  }

  return performApiRequest<T>({
    ...options,
    accessToken,
    _retried: true,
  });
}

/**
 * Low-level HTTP client for the NestJS API.
 * Repositories should call this — UI must not.
 */
export async function apiRequest<T>(
  options: ApiRequestOptions,
): Promise<ApiSuccess<T>> {
  try {
    return await performApiRequest<T>(options);
  } catch (error) {
    if (shouldAttemptRefresh(error, options)) {
      return retryWithRefreshedToken<T>(options);
    }

    throw error;
  }
}

export const apiClient = {
  get: <T>(
    path: string,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => apiRequest<T>({ ...options, method: 'GET', path }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => apiRequest<T>({ ...options, method: 'POST', path, body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => apiRequest<T>({ ...options, method: 'PUT', path, body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => apiRequest<T>({ ...options, method: 'PATCH', path, body }),

  delete: <T>(
    path: string,
    options?: Omit<ApiRequestOptions, 'method' | 'path' | 'body'>,
  ) => apiRequest<T>({ ...options, method: 'DELETE', path }),
};
