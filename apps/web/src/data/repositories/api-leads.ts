import 'server-only';

import { postAuthedJson } from '@/lib/api/client';

export type PropertyLeadType = 'PHONE' | 'WHATSAPP' | 'CONTACT_FORM';

export interface CreatePropertyLeadInput {
  type: PropertyLeadType;
  message?: string;
}

export interface PropertyLeadCreatedDto {
  id: string;
  type: PropertyLeadType;
  status: string;
  message: string | null;
  propertyId: string;
  createdAt: string;
}

export async function createPropertyLeadFromApi(
  propertyId: string,
  input: CreatePropertyLeadInput,
  accessToken: string,
): Promise<PropertyLeadCreatedDto> {
  return postAuthedJson<PropertyLeadCreatedDto, CreatePropertyLeadInput>(
    `/api/v1/properties/${encodeURIComponent(propertyId)}/leads`,
    input,
    accessToken,
  );
}
