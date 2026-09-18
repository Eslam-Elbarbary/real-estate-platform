import type { Property } from './types';

export interface ClientPropertyFilters {
  propertyTypeId?: string;
  transactionTypeId?: string;
  location?: string;
  owner?: string;
  dateFrom?: string;
  dateTo?: string;
}

function matchesDateRange(
  iso: string,
  dateFrom?: string,
  dateTo?: string,
): boolean {
  const created = new Date(iso).getTime();
  if (!Number.isFinite(created)) {
    return true;
  }

  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`).getTime();
    if (Number.isFinite(from) && created < from) {
      return false;
    }
  }

  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59.999`).getTime();
    if (Number.isFinite(to) && created > to) {
      return false;
    }
  }

  return true;
}

/** Refine API page results for filters not yet supported by the list endpoint. */
export function applyClientPropertyFilters(
  items: Property[],
  filters: ClientPropertyFilters,
): Property[] {
  const locationQuery = filters.location?.trim().toLowerCase() ?? '';
  const ownerQuery = filters.owner?.trim().toLowerCase() ?? '';

  return items.filter((item) => {
    if (
      filters.propertyTypeId &&
      item.propertyType?.id !== filters.propertyTypeId
    ) {
      return false;
    }

    if (
      filters.transactionTypeId &&
      item.transactionType?.id !== filters.transactionTypeId
    ) {
      return false;
    }

    if (locationQuery) {
      const haystack = item.location.summary.toLowerCase();
      if (!haystack.includes(locationQuery)) {
        return false;
      }
    }

    if (ownerQuery) {
      const ownerHaystack = [
        item.owner.name ?? '',
        item.owner.email,
      ]
        .join(' ')
        .toLowerCase();
      if (!ownerHaystack.includes(ownerQuery)) {
        return false;
      }
    }

    if (!matchesDateRange(item.createdAt, filters.dateFrom, filters.dateTo)) {
      return false;
    }

    return true;
  });
}
