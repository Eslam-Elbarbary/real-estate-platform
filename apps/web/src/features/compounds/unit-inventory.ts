import { getPropertyTypeLabel } from '@/config/property-types';
import { getPropertyRepository } from '@/data/repositories';
import type {
  CompoundUnitsView,
  PricingPeriod,
  PropertyType,
  TransactionType,
} from '@/types';
import {
  pickDefaultCompoundUnitsView,
  propertyToCompoundUnitsView,
} from '@/features/compound-details/lib/units-view';

export interface CompoundUnitListingRow {
  propertyId: string;
  slug: string;
  area: number;
  price: number;
  currency: 'EGP';
  transactionType: TransactionType;
  pricingPeriod?: PricingPeriod;
  hasGarden?: boolean;
}

export interface CompoundUnitListingGroup {
  id: string;
  view: CompoundUnitsView;
  propertyType: PropertyType;
  label: string;
  units: CompoundUnitListingRow[];
}

export interface CompoundUnitInventory {
  availableViews: CompoundUnitsView[];
  defaultView: CompoundUnitsView | null;
  groups: CompoundUnitListingGroup[];
}

function groupLabel(type: PropertyType, hasGarden: boolean): string {
  if (type === 'apartment' && hasGarden) {
    return 'شقة بحديقة';
  }
  switch (type) {
    case 'apartment':
      return 'شقق';
    case 'villa':
      return 'فلل';
    case 'studio':
      return 'ستوديو';
    case 'townhouse':
      return 'تاون هاوس';
    case 'chalet':
      return 'شاليهات';
    default:
      return getPropertyTypeLabel(type);
  }
}

export async function getCompoundUnitInventory(
  compoundId: string,
): Promise<CompoundUnitInventory> {
  const properties = await getPropertyRepository().findByCompound({
    compoundId,
  });

  const groupsMap = new Map<string, CompoundUnitListingGroup>();
  const available = new Set<CompoundUnitsView>();

  for (const property of properties) {
    const listingSource =
      property.listingSource ??
      (property.seller.type === 'developer'
        ? 'developer'
        : property.seller.type === 'owner'
          ? 'owner'
          : 'broker');
    const view = propertyToCompoundUnitsView({
      transactionType: property.transactionType,
      listingSource,
    });
    if (!view) continue;

    available.add(view);
    const hasGarden = Boolean(property.gardenArea && property.gardenArea > 0);
    const label = groupLabel(property.propertyType, hasGarden);
    const key = `${view}:${property.propertyType}:${hasGarden ? 'garden' : 'plain'}`;

    let group = groupsMap.get(key);
    if (!group) {
      group = {
        id: key,
        view,
        propertyType: property.propertyType,
        label,
        units: [],
      };
      groupsMap.set(key, group);
    }

    group.units.push({
      propertyId: property.id,
      slug: property.slug,
      area: property.area,
      price: property.price,
      currency: property.currency,
      transactionType: property.transactionType,
      pricingPeriod: property.pricingPeriod,
      hasGarden,
    });
  }

  const groups = [...groupsMap.values()].map((group) => ({
    ...group,
    units: group.units.sort((a, b) => a.area - b.area),
  }));

  // Stable order by tab priority, then label.
  const viewOrder: CompoundUnitsView[] = [
    'developer-sale',
    'advertiser-sale',
    'advertiser-rent',
  ];
  groups.sort((a, b) => {
    const viewDiff = viewOrder.indexOf(a.view) - viewOrder.indexOf(b.view);
    if (viewDiff !== 0) return viewDiff;
    return a.label.localeCompare(b.label, 'ar');
  });

  const availableViews = viewOrder.filter((view) => available.has(view));

  return {
    availableViews,
    defaultView: pickDefaultCompoundUnitsView(availableViews),
    groups,
  };
}
