import type {
  CompoundUnitSource,
  CompoundUnitsView,
  ListingSource,
  TransactionType,
} from '@/types';

export const COMPOUND_UNITS_VIEWS = [
  'developer-sale',
  'advertiser-sale',
  'advertiser-rent',
] as const satisfies readonly CompoundUnitsView[];

export function parseCompoundUnitsView(
  value: string | null | undefined,
): CompoundUnitsView | null {
  if (
    value === 'developer-sale' ||
    value === 'advertiser-sale' ||
    value === 'advertiser-rent'
  ) {
    return value;
  }

  // Legacy query values from Phase 5B.
  if (value === 'developer') return 'developer-sale';
  if (value === 'resale') return 'advertiser-sale';

  return null;
}

export function compoundUnitsViewToFilter(view: CompoundUnitsView): {
  transactionType: TransactionType;
  source: CompoundUnitSource;
  listingSources: ListingSource[];
} {
  switch (view) {
    case 'developer-sale':
      return {
        transactionType: 'sale',
        source: 'developer',
        listingSources: ['developer'],
      };
    case 'advertiser-sale':
      return {
        transactionType: 'sale',
        source: 'advertiser',
        listingSources: ['broker', 'owner'],
      };
    case 'advertiser-rent':
      return {
        transactionType: 'rent',
        source: 'advertiser',
        listingSources: ['broker', 'owner'],
      };
  }
}

export function propertyToCompoundUnitsView(args: {
  transactionType: TransactionType;
  listingSource: ListingSource;
}): CompoundUnitsView | null {
  if (args.transactionType === 'sale' && args.listingSource === 'developer') {
    return 'developer-sale';
  }
  if (
    args.transactionType === 'sale' &&
    (args.listingSource === 'broker' || args.listingSource === 'owner')
  ) {
    return 'advertiser-sale';
  }
  if (
    args.transactionType === 'rent' &&
    (args.listingSource === 'broker' || args.listingSource === 'owner')
  ) {
    return 'advertiser-rent';
  }
  return null;
}

export function pickDefaultCompoundUnitsView(
  available: CompoundUnitsView[],
): CompoundUnitsView | null {
  for (const view of COMPOUND_UNITS_VIEWS) {
    if (available.includes(view)) {
      return view;
    }
  }
  return null;
}
