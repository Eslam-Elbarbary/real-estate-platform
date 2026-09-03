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

async function requestJson<TResponse>(
  path: string,
  options: {
    method: 'GET' | 'POST' | 'PATCH';
    accessToken?: string;
    body?: unknown;
  },
): Promise<TResponse> {
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

  const envelope = parsed as ApiEnvelope<TResponse>;
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    return envelope.data;
  }

  return parsed as TResponse;
}
