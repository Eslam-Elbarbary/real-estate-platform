import 'server-only';

import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type { MediaAsset, MediaFilters, MediaListResult } from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DeleteMediaResponse {
  message: string;
}

const MEDIA_PATH = '/api/v1/admin/media';

function parseListMeta(response: ApiEnvelope<MediaAsset[]>): MediaListResult['meta'] {
  const meta = response.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid media pagination meta',
      userMessage: 'تعذر تحميل مكتبة الوسائط.',
      details: response,
    });
  }

  return {
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages: meta.totalPages,
  };
}

function parseMediaAsset(asset: MediaAsset): MediaAsset {
  if (!asset?.id || !asset.url) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid media asset response',
      userMessage: 'تعذر قراءة بيانات الوسائط.',
      details: asset,
    });
  }

  return asset;
}

export async function getMedia(filters: MediaFilters): Promise<MediaListResult> {
  const response = await authenticatedApiClient.get<ApiEnvelope<MediaAsset[]>>(MEDIA_PATH, {
    query: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      folder: filters.folder,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid media list response',
      userMessage: 'تعذر تحميل مكتبة الوسائط.',
      details: response.data,
    });
  }

  return {
    items: response.data.data.map(parseMediaAsset),
    meta: parseListMeta(response.data),
  };
}

export async function uploadMedia(
  files: File[],
  folder?: string,
): Promise<MediaAsset[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file, file.name);
  }

  if (folder?.trim()) {
    formData.append('folder', folder.trim());
  }

  const response = await authenticatedApiClient.postForm<MediaAsset[]>(
    `${MEDIA_PATH}/upload`,
    formData,
  );

  if (!Array.isArray(response.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid media upload response',
      userMessage: 'تعذر رفع الملفات.',
      details: response.data,
    });
  }

  return response.data.map(parseMediaAsset);
}

export async function deleteMedia(id: string): Promise<{ message: string }> {
  const response = await authenticatedApiClient.delete<DeleteMediaResponse>(
    `${MEDIA_PATH}/${id}`,
  );

  if (!response.data?.message) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid media delete response',
      userMessage: 'تعذر حذف الصورة.',
      details: response.data,
    });
  }

  return { message: response.data.message };
}
