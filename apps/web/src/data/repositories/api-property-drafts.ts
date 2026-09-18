import 'server-only';

import {
  deleteAuthedJson,
  getJson,
  patchAuthedJson,
  postAuthedJson,
  putAuthedJson,
  uploadMultipart,
} from '@/lib/api/client';
import type {
  ApiPropertyStatus,
  ApiRentPeriod,
  MyPropertyDto,
  PropertyImageDto,
} from '@/types/api/my-property';

const DRAFTS_PATH = '/api/v1/properties/drafts';
const ME_PATH = '/api/v1/properties/me';

export interface CreateDraftBody {
  title?: string;
}

export interface UpdateBasicBody {
  title?: string;
  propertyTypeId?: string;
  transactionTypeId?: string;
}

export interface UpdateLocationBody {
  countryId?: string;
  cityId?: string;
  areaId?: string;
  districtId?: string | null;
  compoundId?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UpdateDetailsBody {
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  furnished?: boolean | null;
  finishingType?:
    | 'UNFINISHED'
    | 'SEMI_FINISHED'
    | 'FINISHED'
    | 'LUX'
    | 'SUPER_LUX'
    | null;
  rentPeriod?: ApiRentPeriod | null;
  propertyViewIds?: string[];
  legalStatusId?: string | null;
}

/** Fat PATCH body — only send fields the wizard owns. */
export interface UpdatePropertyBody {
  title?: string;
  description?: string;
  address?: string | null;
  price?: number | null;
  currency?: string;
  paymentType?: 'CASH' | 'INSTALLMENT' | 'CASH_OR_INSTALLMENT' | null;
  downPayment?: number | null;
  installmentYears?: number | null;
  monthlyInstallment?: number | null;
  rentPeriod?: ApiRentPeriod | null;
}

export interface SetFeaturesBody {
  featureIds: string[];
}

export interface ReorderMediaBody {
  images: Array<{ id: string; sortOrder: number }>;
}

export async function createPropertyDraft(
  accessToken: string,
  body: CreateDraftBody = {},
): Promise<MyPropertyDto> {
  return postAuthedJson<MyPropertyDto, CreateDraftBody>(
    DRAFTS_PATH,
    body,
    accessToken,
  );
}

export async function fetchMyPropertyById(
  accessToken: string,
  propertyId: string,
): Promise<MyPropertyDto> {
  return getJson<MyPropertyDto>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}`,
    accessToken,
  );
}

export async function fetchMyPropertiesList(
  accessToken: string,
  status?: ApiPropertyStatus,
): Promise<MyPropertyDto[]> {
  const path = status
    ? `${ME_PATH}?status=${encodeURIComponent(status)}`
    : ME_PATH;
  const data = await getJson<MyPropertyDto[]>(path, accessToken);
  return Array.isArray(data) ? data : [];
}

export async function deleteMyPropertyDraft(
  accessToken: string,
  propertyId: string,
): Promise<{ message: string }> {
  return deleteAuthedJson<{ message: string }>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}`,
    accessToken,
  );
}

export async function archiveMyProperty(
  accessToken: string,
  propertyId: string,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, Record<string, never>>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/archive`,
    {},
    accessToken,
  );
}

export async function restoreMyProperty(
  accessToken: string,
  propertyId: string,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, Record<string, never>>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/restore`,
    {},
    accessToken,
  );
}

export async function patchPropertyBasic(
  accessToken: string,
  propertyId: string,
  body: UpdateBasicBody,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, UpdateBasicBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/basic`,
    body,
    accessToken,
  );
}

export async function patchPropertyLocation(
  accessToken: string,
  propertyId: string,
  body: UpdateLocationBody,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, UpdateLocationBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/location`,
    body,
    accessToken,
  );
}

export async function patchPropertyDetails(
  accessToken: string,
  propertyId: string,
  body: UpdateDetailsBody,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, UpdateDetailsBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/details`,
    body,
    accessToken,
  );
}

export async function patchProperty(
  accessToken: string,
  propertyId: string,
  body: UpdatePropertyBody,
): Promise<MyPropertyDto> {
  return patchAuthedJson<MyPropertyDto, UpdatePropertyBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}`,
    body,
    accessToken,
  );
}

export async function putPropertyFeatures(
  accessToken: string,
  propertyId: string,
  body: SetFeaturesBody,
): Promise<MyPropertyDto> {
  return putAuthedJson<MyPropertyDto, SetFeaturesBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/features`,
    body,
    accessToken,
  );
}

export async function fetchPropertyMedia(
  accessToken: string,
  propertyId: string,
): Promise<PropertyImageDto[]> {
  const data = await getJson<PropertyImageDto[]>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/media`,
    accessToken,
  );
  return Array.isArray(data) ? data : [];
}

export async function uploadPropertyMedia(
  accessToken: string,
  propertyId: string,
  file: File,
): Promise<PropertyImageDto> {
  const formData = new FormData();
  formData.append('file', file);
  return uploadMultipart<PropertyImageDto>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/media`,
    formData,
    accessToken,
  );
}

export async function reorderPropertyMedia(
  accessToken: string,
  propertyId: string,
  body: ReorderMediaBody,
): Promise<PropertyImageDto[]> {
  const data = await patchAuthedJson<PropertyImageDto[], ReorderMediaBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/media/reorder`,
    body,
    accessToken,
  );
  return Array.isArray(data) ? data : [];
}

export async function setPrimaryPropertyMedia(
  accessToken: string,
  propertyId: string,
  imageId: string,
): Promise<PropertyImageDto> {
  return patchAuthedJson<PropertyImageDto, Record<string, never>>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/media/${encodeURIComponent(imageId)}/primary`,
    {},
    accessToken,
  );
}

export async function deletePropertyMedia(
  accessToken: string,
  propertyId: string,
  imageId: string,
): Promise<unknown> {
  return deleteAuthedJson(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/media/${encodeURIComponent(imageId)}`,
    accessToken,
  );
}

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

export interface UpsertPropertyContactBody {
  source: PropertyContactSource;
  contactType?: PropertyContactType;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

export async function fetchMyPropertyContact(
  accessToken: string,
  propertyId: string,
): Promise<PropertyContactDto> {
  return getJson<PropertyContactDto>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/contact`,
    accessToken,
  );
}

export async function upsertMyPropertyContact(
  accessToken: string,
  propertyId: string,
  body: UpsertPropertyContactBody,
): Promise<PropertyContactDto> {
  return putAuthedJson<PropertyContactDto, UpsertPropertyContactBody>(
    `${ME_PATH}/${encodeURIComponent(propertyId)}/contact`,
    body,
    accessToken,
  );
}
