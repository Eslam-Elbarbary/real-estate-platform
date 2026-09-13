import type {
  ApiPropertyStatus,
  MyPropertyDto,
} from '@/types/api/my-property';
import type { CatalogTypeDto } from '@/types/api/public-property';
import type { PropertyType, TransactionType } from '@/types';
import type { ManagedListing, ManagedListingStatus } from '../types';

const PROPERTY_TYPES = new Set<PropertyType>([
  'apartment',
  'villa',
  'townhouse',
  'duplex',
  'penthouse',
  'studio',
  'chalet',
  'office',
  'shop',
  'land',
]);

export function toApiPropertyStatus(
  status: ManagedListingStatus,
): ApiPropertyStatus | ApiPropertyStatus[] {
  switch (status) {
    case 'published':
      return 'PUBLISHED';
    case 'rejected':
      return 'REJECTED';
    case 'expired':
      return 'EXPIRED';
    case 'pending':
      return ['PENDING_REVIEW', 'PENDING_PAYMENT'];
    case 'deleted':
      return 'ARCHIVED';
    case 'draft':
      return 'DRAFT';
    default:
      return 'PUBLISHED';
  }
}

export function fromApiPropertyStatus(
  status: ApiPropertyStatus,
): ManagedListingStatus {
  switch (status) {
    case 'PUBLISHED':
      return 'published';
    case 'REJECTED':
      return 'rejected';
    case 'EXPIRED':
      return 'expired';
    case 'PENDING_REVIEW':
    case 'PENDING_PAYMENT':
      return 'pending';
    case 'ARCHIVED':
      return 'deleted';
    case 'DRAFT':
      return 'draft';
    default:
      return 'draft';
  }
}

function resolvePropertyType(
  propertyTypeId: string | null,
  propertyTypes: CatalogTypeDto[],
): PropertyType | undefined {
  if (!propertyTypeId) {
    return undefined;
  }
  const match = propertyTypes.find((item) => item.id === propertyTypeId);
  if (!match) {
    return undefined;
  }
  const code = match.code.toLowerCase() as PropertyType;
  return PROPERTY_TYPES.has(code) ? code : undefined;
}

function resolveTransactionType(
  transactionTypeId: string | null,
  transactionTypes: CatalogTypeDto[],
): TransactionType | undefined {
  if (!transactionTypeId) {
    return undefined;
  }
  const match = transactionTypes.find((item) => item.id === transactionTypeId);
  if (!match) {
    return undefined;
  }
  return match.code.toUpperCase() === 'RENT' ? 'rent' : 'sale';
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function mapMyPropertyToManagedListing(
  dto: MyPropertyDto,
  catalogs: {
    propertyTypes: CatalogTypeDto[];
    transactionTypes: CatalogTypeDto[];
  },
): ManagedListing {
  const price = toNumber(dto.price);
  const propertyType = resolvePropertyType(
    dto.propertyTypeId,
    catalogs.propertyTypes,
  );
  const transaction = resolveTransactionType(
    dto.transactionTypeId,
    catalogs.transactionTypes,
  );

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title?.trim() || 'بدون عنوان',
    transaction,
    propertyType,
    locationLabel: dto.address?.trim() || '',
    priceEgp: price ?? undefined,
    status: fromApiPropertyStatus(dto.status),
    apiStatus: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    bedrooms: dto.bedrooms ?? undefined,
    bathrooms: dto.bathrooms ?? undefined,
    areaSqm: toNumber(dto.areaSqm) ?? undefined,
    publishedAt: dto.publishedAt ?? undefined,
    ...(fromApiPropertyStatus(dto.status) === 'draft'
      ? { draftStep: 'basic' as const }
      : {}),
    ...(dto.status === 'REJECTED'
      ? {
          rejectionReason:
            'تم رفض العقار. يرجى مراجعة بيانات العقار وتعديلها ثم إعادة الإرسال.',
        }
      : {}),
  };
}
