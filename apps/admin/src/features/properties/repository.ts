import 'server-only';

import { logPropertyCreateInDev } from '@/lib/dev/property-create-log';
import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';
import type {
  AdminPropertiesFilters,
  AdminPropertiesListResult,
  AdminPropertyActionResult,
  AdminPropertyDetails,
  AdminPropertyImage,
  AdminPropertyStatusCounts,
  AttachPropertyMediaInput,
  CreatePropertyInput,
  Property,
  ReorderPropertyMediaInput,
  UpdatePropertyInput,
} from './types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    counts?: AdminPropertyStatusCounts;
  };
}

const PROPERTIES_PATH = '/api/v1/admin/properties';

function emptyStatusCounts(): AdminPropertyStatusCounts {
  return {
    ALL: 0,
    DRAFT: 0,
    PENDING_REVIEW: 0,
    PENDING_PAYMENT: 0,
    PUBLISHED: 0,
    REJECTED: 0,
    ARCHIVED: 0,
    EXPIRED: 0,
  };
}

function parseCounts(
  value: AdminPropertyStatusCounts | undefined,
): AdminPropertyStatusCounts {
  if (!value || typeof value.ALL !== 'number') {
    return emptyStatusCounts();
  }

  return {
    ALL: value.ALL,
    DRAFT: value.DRAFT ?? 0,
    PENDING_REVIEW: value.PENDING_REVIEW ?? 0,
    PENDING_PAYMENT: value.PENDING_PAYMENT ?? 0,
    PUBLISHED: value.PUBLISHED ?? 0,
    REJECTED: value.REJECTED ?? 0,
    ARCHIVED: value.ARCHIVED ?? 0,
    EXPIRED: value.EXPIRED ?? 0,
  };
}

function parseMediaListResponse(
  response: ApiEnvelope<AdminPropertyImage[]>,
  userMessage: string,
): AdminPropertyImage[] {
  if (!response.success || !Array.isArray(response.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property media list response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

function parseMediaItemResponse(
  response: ApiEnvelope<AdminPropertyImage>,
  userMessage: string,
): AdminPropertyImage {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property media response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function fetchAdminProperties(
  filters: AdminPropertiesFilters,
): Promise<AdminPropertiesListResult> {
  const response = await authenticatedApiClient.get<ApiEnvelope<Property[]>>(PROPERTIES_PATH, {
    query: {
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
    },
  });

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid properties list response',
      userMessage: 'تعذر تحميل قائمة العقارات.',
      details: response.data,
    });
  }

  const meta = response.data.meta;
  if (
    !meta ||
    typeof meta.page !== 'number' ||
    typeof meta.limit !== 'number' ||
    typeof meta.total !== 'number' ||
    typeof meta.totalPages !== 'number'
  ) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid properties pagination meta',
      userMessage: 'تعذر تحميل قائمة العقارات.',
      details: response.data,
    });
  }

  return {
    items: response.data.data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages,
      counts: parseCounts(meta.counts),
    },
  };
}

export async function getPropertyDetails(
  id: string,
): Promise<AdminPropertyDetails> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPropertyDetails>>(
    `${PROPERTIES_PATH}/${id}`,
  );

  if (!response.data.success || !response.data.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property details response',
      userMessage: 'تعذر تحميل تفاصيل العقار.',
      details: response.data,
    });
  }

  return response.data.data;
}

function parseActionResponse(
  response: ApiEnvelope<AdminPropertyActionResult>,
  userMessage: string,
): AdminPropertyActionResult {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property action response',
      userMessage,
      details: response,
    });
  }
  return response.data;
}

export async function approveProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/approve`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر اعتماد العقار.',
  );
}

export async function rejectProperty(
  id: string,
  reason: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/reject`,
    { reason },
  );

  return parseActionResponse(
    response.data,
    'تعذر رفض العقار.',
  );
}

export async function archiveProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/archive`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر أرشفة العقار.',
  );
}

export async function publishProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/publish`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر نشر العقار.',
  );
}

export async function unpublishProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/unpublish`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر إلغاء نشر العقار.',
  );
}

export async function restoreProperty(
  id: string,
): Promise<AdminPropertyActionResult> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyActionResult>>(
    `${PROPERTIES_PATH}/${id}/restore`,
    undefined,
  );

  return parseActionResponse(
    response.data,
    'تعذر استعادة العقار.',
  );
}

function parsePropertyDetailsResponse(
  response: ApiEnvelope<AdminPropertyDetails>,
  userMessage: string,
): AdminPropertyDetails {
  if (!response.success || !response.data?.id) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property response',
      userMessage,
      details: response,
    });
  }

  return response.data;
}

export async function createProperty(
  input: CreatePropertyInput,
): Promise<AdminPropertyDetails> {
  logPropertyCreateInDev('api-request', {
    path: PROPERTIES_PATH,
    ownerId: input.ownerId,
    title: input.title,
    areaId: input.areaId,
    imageCount: input.images?.length ?? 0,
  });

  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyDetails>>(
    PROPERTIES_PATH,
    input,
  );

  const created = parsePropertyDetailsResponse(response.data, 'تعذر إنشاء العقار.');

  logPropertyCreateInDev('api-response', {
    status: response.status,
    id: created.id,
    propertyStatus: created.status,
    title: created.title,
  });

  return created;
}

export async function updateProperty(
  id: string,
  input: UpdatePropertyInput,
): Promise<AdminPropertyDetails> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPropertyDetails>>(
    `${PROPERTIES_PATH}/${id}`,
    input,
  );

  return parsePropertyDetailsResponse(response.data, 'تعذر تحديث العقار.');
}

export async function listPropertyMedia(
  propertyId: string,
): Promise<AdminPropertyImage[]> {
  const response = await authenticatedApiClient.get<ApiEnvelope<AdminPropertyImage[]>>(
    `${PROPERTIES_PATH}/${propertyId}/media`,
  );

  return parseMediaListResponse(response.data, 'تعذر تحميل وسائط العقار.');
}

export async function attachPropertyMedia(
  propertyId: string,
  input: AttachPropertyMediaInput,
): Promise<AdminPropertyImage> {
  const response = await authenticatedApiClient.post<ApiEnvelope<AdminPropertyImage>>(
    `${PROPERTIES_PATH}/${propertyId}/media`,
    input,
  );

  return parseMediaItemResponse(response.data, 'تعذر إرفاق الوسائط بالعقار.');
}

export async function reorderPropertyMedia(
  propertyId: string,
  input: ReorderPropertyMediaInput,
): Promise<AdminPropertyImage[]> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPropertyImage[]>>(
    `${PROPERTIES_PATH}/${propertyId}/media/reorder`,
    input,
  );

  return parseMediaListResponse(response.data, 'تعذر إعادة ترتيب الوسائط.');
}

export async function setPrimaryPropertyMedia(
  propertyId: string,
  imageId: string,
): Promise<AdminPropertyImage> {
  const response = await authenticatedApiClient.patch<ApiEnvelope<AdminPropertyImage>>(
    `${PROPERTIES_PATH}/${propertyId}/media/${imageId}/primary`,
    {},
  );

  return parseMediaItemResponse(response.data, 'تعذر تعيين الصورة الرئيسية.');
}

export async function deletePropertyMedia(
  propertyId: string,
  imageId: string,
): Promise<void> {
  const response = await authenticatedApiClient.delete<ApiEnvelope<unknown>>(
    `${PROPERTIES_PATH}/${propertyId}/media/${imageId}`,
  );

  if (!response.data.success) {
    throw createAdminError('UNKNOWN', {
      message: 'Invalid property media delete response',
      userMessage: 'تعذر حذف الوسائط.',
      details: response.data,
    });
  }
}
