import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPlatformSettings,
  UpdatePlatformSettingsInput,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = '/api/v1/admin/settings';

function unwrap<T>(response: ApiEnvelope<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw createAdminError('UNKNOWN', {
      message: fallback,
      userMessage: fallback,
      details: response,
    });
  }
  return response.data;
}

export async function getAdminPlatformSettings(): Promise<AdminPlatformSettings> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPlatformSettings>>(BASE);
  return unwrap(response.data, 'تعذر تحميل إعدادات الموقع.');
}

export async function updateAdminPlatformSettings(
  input: UpdatePlatformSettingsInput,
): Promise<AdminPlatformSettings> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPlatformSettings>>(
    BASE,
    input,
  );
  return unwrap(response.data, 'تعذر حفظ إعدادات الموقع.');
}
