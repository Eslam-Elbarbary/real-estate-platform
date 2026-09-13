import 'server-only';

import { env } from '@/config/env';
import {
  ApiRequestError,
  createApiErrorFromResponse,
  mapUploadError,
} from './errors';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: unknown;
}

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ApiQueryValue = string | number | boolean | undefined | null;

function appendQuery(
  path: string,
  query?: Record<string, ApiQueryValue>,
): string {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params.set(key, String(value));
  }

  const qs = params.toString();
  if (!qs) {
    return path;
  }

  return path.includes('?') ? `${path}&${qs}` : `${path}?${qs}`;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = env.apiBaseUrl.endsWith('/') ? env.apiBaseUrl : `${env.apiBaseUrl}/`;
  return new URL(normalizedPath, base).toString();
}

export async function uploadMultipart<T>(
  path: string,
  formData: FormData,
  accessToken: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      body: formData,
      cache: 'no-store',
    });
  } catch (error) {
    throw new ApiRequestError({
      code: 'NETWORK',
      message: error instanceof Error ? error.message : 'Network request failed',
      userMessage: mapUploadError(error),
      cause: error,
    });
  }

  let parsed: unknown = null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    parsed = await response.json();
  }

  if (!response.ok) {
    throw createApiErrorFromResponse(
      response.status,
      parsed,
      `Upload failed with status ${response.status}`,
    );
  }

  const envelope = parsed as ApiEnvelope<T>;
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    return envelope.data;
  }

  return parsed as T;
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (error) {
    throw new ApiRequestError({
      code: 'NETWORK',
      message: error instanceof Error ? error.message : 'Network request failed',
      userMessage: mapUploadError(error),
      cause: error,
    });
  }

  const parsed = (await response.json()) as ApiEnvelope<TResponse>;

  if (!response.ok) {
    throw createApiErrorFromResponse(
      response.status,
      parsed,
      `Request failed with status ${response.status}`,
    );
  }

  return parsed.data;
}

export async function getJson<TResponse>(
  path: string,
  accessToken: string,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'GET',
    accessToken,
  });
}

/** Public GET that returns only `data` from the API envelope. */
export async function getPublicJson<TResponse>(
  path: string,
  query?: Record<string, ApiQueryValue>,
): Promise<TResponse> {
  return requestJson<TResponse>(appendQuery(path, query), {
    method: 'GET',
  });
}

/** Public GET that preserves pagination `meta` when present. */
export async function getPublicJsonWithMeta<
  TResponse,
  TMeta = ApiPaginationMeta,
>(
  path: string,
  query?: Record<string, ApiQueryValue>,
): Promise<{ data: TResponse; meta?: TMeta }> {
  return requestJsonWithMeta<TResponse, TMeta>(appendQuery(path, query), {
    method: 'GET',
  });
}

export async function postAuthedJson<TResponse, TBody>(
  path: string,
  body: TBody,
  accessToken: string,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'POST',
    accessToken,
    body,
  });
}

export async function patchAuthedJson<TResponse, TBody>(
  path: string,
  body: TBody,
  accessToken: string,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'PATCH',
    accessToken,
    body,
  });
}

export async function putAuthedJson<TResponse, TBody>(
  path: string,
  body: TBody,
  accessToken: string,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'PUT',
    accessToken,
    body,
  });
}

export async function deleteAuthedJson<TResponse>(
  path: string,
  accessToken: string,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'DELETE',
    accessToken,
  });
}

async function requestJson<TResponse>(
  path: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    accessToken?: string;
    body?: unknown;
  },
): Promise<TResponse> {
  const result = await requestJsonWithMeta<TResponse>(path, options);
  return result.data;
}

async function requestJsonWithMeta<TResponse, TMeta = ApiPaginationMeta>(
  path: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    accessToken?: string;
    body?: unknown;
  },
): Promise<{ data: TResponse; meta?: TMeta }> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method: options.method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });
  } catch (error) {
    throw new ApiRequestError({
      code: 'NETWORK',
      message: error instanceof Error ? error.message : 'Network request failed',
      userMessage: mapUploadError(error),
      cause: error,
    });
  }

  let parsed: unknown = null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    parsed = await response.json();
  }

  if (!response.ok) {
    throw createApiErrorFromResponse(
      response.status,
      parsed,
      `Request failed with status ${response.status}`,
    );
  }

  const envelope = parsed as ApiEnvelope<TResponse> & { meta?: TMeta };
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    return {
      data: envelope.data,
      meta: envelope.meta,
    };
  }

  return { data: parsed as TResponse };
}
