import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type { AdminBanner, BannerFormInput, BannerPosition } from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = '/api/v1/admin/banners';

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

export async function listAdminBanners(
  position?: BannerPosition,
): Promise<AdminBanner[]> {
  const query = position ? `?position=${encodeURIComponent(position)}` : '';
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminBanner[]>>(
    `${BASE}${query}`,
  );
  return unwrap(response.data, 'تعذر تحميل البنرات.');
}

export async function createAdminBanner(
  input: BannerFormInput,
): Promise<AdminBanner> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminBanner>>(
    BASE,
    toPayload(input),
  );
  return unwrap(response.data, 'تعذر إنشاء البنر.');
}

export async function updateAdminBanner(
  id: string,
  input: Partial<BannerFormInput>,
): Promise<AdminBanner> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminBanner>>(
    `${BASE}/${id}`,
    toPayload(input),
  );
  return unwrap(response.data, 'تعذر تحديث البنر.');
}

export async function deleteAdminBanner(id: string): Promise<void> {
  await authenticatedApiClient.delete(`${BASE}/${id}`);
}

export async function reorderAdminBanners(
  items: Array<{ id: string; sortOrder: number }>,
): Promise<AdminBanner[]> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminBanner[]>>(
    `${BASE}/reorder`,
    { items },
  );
  return unwrap(response.data, 'تعذر إعادة ترتيب البنرات.');
}

function toPayload(input: Partial<BannerFormInput>) {
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) {
    payload.description = input.description.trim() || null;
  }
  if (input.imageUrl !== undefined) payload.imageUrl = input.imageUrl;
  if (input.mobileImageUrl !== undefined) {
    payload.mobileImageUrl = input.mobileImageUrl.trim() || null;
  }
  if (input.buttonText !== undefined) {
    payload.buttonText = input.buttonText.trim() || null;
  }
  if (input.buttonUrl !== undefined) {
    payload.buttonUrl = input.buttonUrl.trim() || null;
  }
  if (input.position !== undefined) payload.position = input.position;
  if (input.sortOrder !== undefined) payload.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) payload.isActive = input.isActive;
  return payload;
}
