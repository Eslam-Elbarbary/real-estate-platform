export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  errors?: unknown;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export function buildSuccessResponse<T>(
  data: T,
  message = 'OK',
  path?: string,
  meta?: Record<string, unknown>,
): ApiSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString(),
    ...(path ? { path } : {}),
  };
}

export function buildErrorResponse(
  message: string,
  statusCode: number,
  path?: string,
  errors?: unknown,
): ApiErrorResponse {
  return {
    success: false,
    message,
    data: null,
    ...(errors !== undefined ? { errors } : {}),
    statusCode,
    timestamp: new Date().toISOString(),
    ...(path ? { path } : {}),
  };
}
