import { authenticatedApiClient } from '@/lib/api/authenticated-request';
import { createAdminError } from '@/lib/errors';

export type PropertyContactSource = 'OWNER' | 'CUSTOM';
export type PropertyContactType = 'OWNER' | 'AGENT' | 'COMPANY';

export interface PropertyContactDto {
  propertyId: string;
  source: PropertyContactSource;
  contactType: PropertyContactType;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}

export interface UpsertPropertyContactInput {
  source: PropertyContactSource;
  contactType?: PropertyContactType;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

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

export async function getPropertyContact(
  propertyId: string,
): Promise<PropertyContactDto> {
  const response = await authenticatedApiClient.get<
    ApiEnvelope<PropertyContactDto>
  >(`/api/v1/admin/properties/${encodeURIComponent(propertyId)}/contact`);
  return unwrap(response.data, 'تعذر تحميل بيانات التواصل.');
}

export async function updatePropertyContact(
  propertyId: string,
  input: UpsertPropertyContactInput,
): Promise<PropertyContactDto> {
  const response = await authenticatedApiClient.put<
    ApiEnvelope<PropertyContactDto>
  >(`/api/v1/admin/properties/${encodeURIComponent(propertyId)}/contact`, input);
  return unwrap(response.data, 'تعذر حفظ بيانات التواصل.');
}
