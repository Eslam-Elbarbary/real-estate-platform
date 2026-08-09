import type {
  Compound,
  ListingSource,
  PricingPeriod,
  Property,
  PropertyType,
  TransactionType,
} from '@/types';
import { mockCompounds } from './compounds';

interface UnitSpec {
  propertyType: PropertyType;
  area: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  transactionType: TransactionType;
  listingSource: ListingSource;
  gardenArea?: number;
  paymentType?: Property['paymentType'];
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
}

function propertyTypeLabel(type: PropertyType): string {
  switch (type) {
    case 'studio':
      return 'ستوديو';
    case 'apartment':
      return 'شقة';
    case 'villa':
      return 'فيلا';
    case 'townhouse':
      return 'تاون هاوس';
    case 'chalet':
      return 'شاليه';
    case 'duplex':
      return 'دوبلكس';
    case 'penthouse':
      return 'بنتهاوس';
    default:
      return 'وحدة';
  }
}

function transactionLabel(transaction: TransactionType): string {
  return transaction === 'rent' ? 'للإيجار' : 'للبيع';
}

function buildImages(
  seed: number,
  title: string,
): Property['images'] {
  const count = 4 + (seed % 3);
  return Array.from({ length: count }, (_, order) => {
    const n = String(((seed + order) % 28) + 1).padStart(2, '0');
    return {
      id: `cu-img-${seed}-${order + 1}`,
      url: `/assets/compounds-directory/compound-${n}.webp`,
      alt: `${title} - صورة ${order + 1}`,
      isCover: order === 0,
      order: order + 1,
    };
  });
}

function buildProperty(
  compound: Compound,
  spec: UnitSpec,
  serial: number,
): Property {
  const id = `cu-${compound.slug}-${serial}`;
  const typeLabel = propertyTypeLabel(spec.propertyType);
  const txLabel = transactionLabel(spec.transactionType);
  const title = `${typeLabel} ${spec.area} م² ${txLabel} في ${compound.nameAr}`;
  const slug = `${spec.propertyType}-${spec.transactionType}-${compound.slug}-${serial}`;
  const pricingPeriod: PricingPeriod =
    spec.transactionType === 'rent' ? 'monthly' : 'one_time';
  const sellerType =
    spec.listingSource === 'developer'
      ? 'developer'
      : spec.listingSource === 'owner'
        ? 'owner'
        : 'broker';
  const sellerName =
    spec.listingSource === 'developer'
      ? compound.developerName
      : spec.listingSource === 'owner'
        ? 'مالك الوحدة'
        : 'وسيط عقاري معتمد';

  const paymentType =
    spec.paymentType ??
    (spec.transactionType === 'rent'
      ? 'cash'
      : spec.listingSource === 'developer'
        ? 'installment'
        : 'cash_or_installment');

  return {
    id,
    referenceNumber: `CU-${serial}`,
    slug,
    title,
    description: `${title} داخل كمبوند ${compound.nameAr}. الوحدة جزء من مخزون تجريبي مرتبط بالمشروع لعرض تفاصيل العقار والتواصل والمقارنة داخل المنصة.`,
    transactionType: spec.transactionType,
    propertyType: spec.propertyType,
    listingSource: spec.listingSource,
    price: spec.price,
    pricePerSqm: Math.round(spec.price / Math.max(spec.area, 1)),
    currency: 'EGP',
    pricingPeriod,
    area: spec.area,
    bedrooms: spec.bedrooms,
    bathrooms: spec.bathrooms,
    floor: spec.propertyType === 'villa' ? undefined : 1 + (serial % 8),
    finishingType: serial % 2 === 0 ? 'finished' : 'lux',
    paymentType,
    downPayment: spec.downPayment,
    installmentYears: spec.installmentYears,
    monthlyInstallment: spec.monthlyInstallment,
    deliveryYear:
      spec.listingSource === 'developer' ? 2027 + (serial % 3) : undefined,
    gardenArea: spec.gardenArea,
    location: {
      countrySlug: 'egypt',
      countryName: 'مصر',
      governorateSlug: compound.governorateSlug,
      governorateName: compound.governorateName,
      citySlug: compound.citySlug,
      cityName: compound.cityName,
      areaSlug: compound.areaSlug,
      areaName: compound.areaName,
      latitude: compound.latitude + (serial % 7) * 0.0003,
      longitude: compound.longitude + (serial % 5) * 0.0003,
    },
    compoundId: compound.id,
    compoundSlug: compound.slug,
    compoundName: compound.nameAr,
    compoundDescription: compound.shortDescription ?? compound.description,
    developerId: compound.developerId,
    developerName: compound.developerName,
    images: buildImages(serial, title),
    seller: {
      id: `seller-${compound.slug}-${spec.listingSource}-${serial}`,
      name: sellerName,
      type: sellerType,
      phone: compound.phone ?? '+201000001000',
      whatsapp: compound.whatsapp ?? compound.phone,
      isVerified: true,
      listingCount: 8 + (serial % 12),
    },
    amenities: compound.amenities,
    features:
      spec.gardenArea && spec.gardenArea > 0
        ? ['حديقة خاصة', 'تشطيب حديث']
        : ['تشطيب حديث', 'إطلالة مفتوحة'],
    verificationState: 'verified',
    views: 120 + serial * 3,
    favoritesCount: 4 + (serial % 9),
    searchAppearances: 80 + serial * 2,
    createdAt: new Date(Date.UTC(2026, 2, 1 + (serial % 20))).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 5, 1 + (serial % 20))).toISOString(),
  };
}

function orchidInventory(compound: Compound): UnitSpec[] {
  const base = compound.startingPrice ?? 3_400_000;
  const specs: UnitSpec[] = [];

  // developer-sale: studio 3, apartment 5, villa 4 = 12
  for (const area of [72, 86, 95]) {
    specs.push({
      propertyType: 'studio',
      area,
      price: Math.round(base * (0.55 + area / 400)),
      bedrooms: 0,
      bathrooms: 1,
      transactionType: 'sale',
      listingSource: 'developer',
      paymentType: 'installment',
      downPayment: Math.round(base * 0.1),
      installmentYears: 8,
      monthlyInstallment: Math.round((base * 0.55) / 96),
    });
  }
  for (const area of [110, 125, 140, 155, 175]) {
    specs.push({
      propertyType: 'apartment',
      area,
      price: Math.round(base * (0.85 + area / 500)),
      bedrooms: area >= 140 ? 3 : 2,
      bathrooms: area >= 155 ? 3 : 2,
      transactionType: 'sale',
      listingSource: 'developer',
      paymentType: 'installment',
      downPayment: Math.round(base * 0.12),
      installmentYears: 7,
      monthlyInstallment: Math.round((base * 0.9) / 84),
      gardenArea: area >= 155 ? 18 : undefined,
    });
  }
  for (const area of [220, 260, 300, 340]) {
    specs.push({
      propertyType: 'villa',
      area,
      price: Math.round(base * (2.1 + area / 400)),
      bedrooms: area >= 300 ? 5 : 4,
      bathrooms: 4,
      transactionType: 'sale',
      listingSource: 'developer',
      paymentType: 'installment',
      downPayment: Math.round(base * 0.15),
      installmentYears: 8,
      monthlyInstallment: Math.round((base * 2) / 96),
    });
  }

  // advertiser-sale: townhouse 5, studio 3, garden apt 4 = 12
  for (const area of [170, 185, 200, 215, 230]) {
    specs.push({
      propertyType: 'townhouse',
      area,
      price: Math.round(base * (1.55 + area / 600)),
      bedrooms: 3,
      bathrooms: 3,
      transactionType: 'sale',
      listingSource: serialListingSource(area),
    });
  }
  for (const area of [78, 88, 98]) {
    specs.push({
      propertyType: 'studio',
      area,
      price: Math.round(base * (0.48 + area / 450)),
      bedrooms: 0,
      bathrooms: 1,
      transactionType: 'sale',
      listingSource: 'broker',
    });
  }
  for (const area of [118, 132, 148, 162]) {
    specs.push({
      propertyType: 'apartment',
      area,
      price: Math.round(base * (0.9 + area / 550)),
      bedrooms: 3,
      bathrooms: 2,
      transactionType: 'sale',
      listingSource: area % 20 === 2 ? 'owner' : 'broker',
      gardenArea: 22 + (area % 10),
    });
  }

  // advertiser-rent: studio 2, garden apt 2, apartment 3 = 7
  for (const area of [75, 90]) {
    specs.push({
      propertyType: 'studio',
      area,
      price: 18_000 + area * 40,
      bedrooms: 0,
      bathrooms: 1,
      transactionType: 'rent',
      listingSource: 'broker',
      paymentType: 'cash',
    });
  }
  for (const area of [120, 145]) {
    specs.push({
      propertyType: 'apartment',
      area,
      price: 22_000 + area * 35,
      bedrooms: 2,
      bathrooms: 2,
      transactionType: 'rent',
      listingSource: 'owner',
      paymentType: 'cash',
      gardenArea: 20,
    });
  }
  for (const area of [130, 150, 170]) {
    specs.push({
      propertyType: 'apartment',
      area,
      price: 24_000 + area * 30,
      bedrooms: area >= 150 ? 3 : 2,
      bathrooms: 2,
      transactionType: 'rent',
      listingSource: 'broker',
      paymentType: 'cash',
    });
  }

  return specs;
}

function serialListingSource(seed: number): ListingSource {
  return seed % 40 === 0 ? 'owner' : 'broker';
}

function standardInventory(compound: Compound, index: number): UnitSpec[] {
  const base = compound.startingPrice ?? 2_500_000;
  const mode = index % 4;
  const specs: UnitSpec[] = [];

  // Always developer sale apartments + villas
  for (const area of [105, 128, 150]) {
    specs.push({
      propertyType: 'apartment',
      area,
      price: Math.round(base * (0.9 + area / 500)),
      bedrooms: area >= 140 ? 3 : 2,
      bathrooms: 2,
      transactionType: 'sale',
      listingSource: 'developer',
      paymentType: 'installment',
      downPayment: Math.round(base * 0.1),
      installmentYears: 7,
      monthlyInstallment: Math.round(base / 90),
    });
  }
  for (const area of [240, 290]) {
    specs.push({
      propertyType: 'villa',
      area,
      price: Math.round(base * (2.2 + area / 400)),
      bedrooms: 4,
      bathrooms: 4,
      transactionType: 'sale',
      listingSource: 'developer',
      paymentType: 'installment',
      downPayment: Math.round(base * 0.15),
      installmentYears: 8,
      monthlyInstallment: Math.round((base * 2) / 96),
    });
  }

  if (mode !== 0) {
    for (const area of [112, 138]) {
      specs.push({
        propertyType: 'apartment',
        area,
        price: Math.round(base * (0.85 + area / 520)),
        bedrooms: 2,
        bathrooms: 2,
        transactionType: 'sale',
        listingSource: 'broker',
      });
    }
    specs.push({
      propertyType: 'townhouse',
      area: 190,
      price: Math.round(base * 1.7),
      bedrooms: 3,
      bathrooms: 3,
      transactionType: 'sale',
      listingSource: 'owner',
    });
  }

  if (mode === 2 || mode === 3) {
    for (const area of [95, 125, 140]) {
      specs.push({
        propertyType: area < 100 ? 'studio' : 'apartment',
        area,
        price: 16_000 + area * 45,
        bedrooms: area < 100 ? 0 : 2,
        bathrooms: area < 100 ? 1 : 2,
        transactionType: 'rent',
        listingSource: area % 2 === 0 ? 'broker' : 'owner',
        paymentType: 'cash',
      });
    }
  }

  if (mode === 3) {
    specs.push({
      propertyType: 'chalet',
      area: 110,
      price: Math.round(base * 1.1),
      bedrooms: 2,
      bathrooms: 2,
      transactionType: 'sale',
      listingSource: 'developer',
    });
  }

  return specs;
}

/** Property listings that back Compound Details unit rows. */
export function buildCompoundUnitListings(): Property[] {
  const listings: Property[] = [];
  let serial = 5000;

  for (const [index, compound] of mockCompounds.entries()) {
    const specs =
      compound.slug === 'orchid-park'
        ? orchidInventory(compound)
        : standardInventory(compound, index);

    for (const spec of specs) {
      listings.push(buildProperty(compound, spec, serial));
      serial += 1;
    }
  }

  return listings;
}

export function normalizeSeedProperty(property: Property): Property {
  const listingSource: ListingSource =
    property.listingSource ??
    (property.seller.type === 'developer'
      ? 'developer'
      : property.seller.type === 'owner'
        ? 'owner'
        : 'broker');
  const pricingPeriod: PricingPeriod =
    property.pricingPeriod ??
    (property.transactionType === 'rent' ? 'monthly' : 'one_time');

  return {
    ...property,
    listingSource,
    pricingPeriod,
  };
}
