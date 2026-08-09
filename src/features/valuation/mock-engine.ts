import type { PropertyType } from '@/types';
import type {
  ValuationFinishing,
  ValuationRequest,
  ValuationResult,
  ValuationView,
} from './types';

const LOCATION_BASE_RATE: Record<string, number> = {
  'new-cairo': 48_000,
  'sheikh-zayed': 52_000,
  '6th-october': 36_000,
  'nasr-city': 42_000,
  alexandria: 28_000,
  'ain-sokhna': 24_000,
  'north-coast': 30_000,
  default: 35_000,
};

const PROPERTY_TYPE_MULTIPLIER: Record<PropertyType, number> = {
  apartment: 1,
  studio: 0.95,
  villa: 1.35,
  townhouse: 1.22,
  duplex: 1.18,
  penthouse: 1.4,
  chalet: 1.12,
  office: 0.92,
  shop: 1.05,
  land: 0.55,
};

const FINISHING_MULTIPLIER: Record<ValuationFinishing, number> = {
  unfinished: 0.78,
  semi_finished: 0.88,
  finished: 1,
  lux: 1.08,
  super_lux: 1.16,
  extra_super_lux: 1.24,
};

const VIEW_MULTIPLIER: Record<ValuationView, number> = {
  nile: 1.18,
  golf: 1.14,
  lake: 1.12,
  plaza: 1.08,
  club: 1.1,
  rear: 0.94,
  garden: 1.06,
  pool: 1.09,
  sea: 1.2,
  corner: 1.07,
  side_street: 0.98,
  main_street: 1.04,
  other: 1,
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function locationRate(slug: string): number {
  return LOCATION_BASE_RATE[slug] ?? LOCATION_BASE_RATE.default;
}

/**
 * Deterministic demo valuation engine — not a scientific appraisal model.
 */
export class MockValuationEngine {
  calculate(request: ValuationRequest): Omit<
    ValuationResult,
    'id' | 'createdAt' | 'updatedAt'
  > {
    const area = Math.max(request.area ?? 100, 20);
    const base = locationRate(request.location.slug);
    const typeMul = PROPERTY_TYPE_MULTIPLIER[request.propertyType] ?? 1;
    const finishMul = request.finishing
      ? FINISHING_MULTIPLIER[request.finishing]
      : 1;
    const viewMul = request.view ? VIEW_MULTIPLIER[request.view] : 1;
    const bedAdj = 1 + Math.min(request.bedrooms ?? 0, 6) * 0.015;
    const bathAdj = 1 + Math.min(request.bathrooms ?? 0, 5) * 0.01;

    let meterPrice = base * typeMul * finishMul * viewMul * bedAdj * bathAdj;

    if (
      request.goal === 'owned-property' &&
      request.purchasePrice &&
      request.purchaseDate
    ) {
      const [yearStr, monthStr] = request.purchaseDate.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);
      const yearsHeld = Math.max(
        0,
        (new Date().getFullYear() - year) +
          (new Date().getMonth() + 1 - month) / 12,
      );
      const historicalMeter = request.purchasePrice / area;
      const appreciated = historicalMeter * (1 + yearsHeld * 0.08);
      meterPrice = meterPrice * 0.7 + appreciated * 0.3;
    }

    if (request.currentOwnerEstimate && request.currentOwnerEstimate > 0) {
      const ownerMeter = request.currentOwnerEstimate / area;
      meterPrice = meterPrice * 0.85 + ownerMeter * 0.15;
    }

    const estimatedPrice = roundToNearest(meterPrice * area, 5_000);
    const averagePricePerSquareMeter = roundToNearest(estimatedPrice / area, 100);

    const fingerprint = hashString(
      [
        request.goal,
        request.location.slug,
        request.propertyType,
        request.view ?? '',
        request.finishing ?? '',
        String(area),
        String(request.bedrooms ?? 0),
        String(request.bathrooms ?? 0),
        String(request.purchasePrice ?? 0),
        request.purchaseDate ?? '',
        String(request.currentOwnerEstimate ?? 0),
      ].join('|'),
    );

    const confidenceScore = clamp(42 + (fingerprint % 41) + (area % 7) * 0.1, 0, 100);
    const spread = 0.08 + ((fingerprint % 5) / 100);
    const priceRange = {
      min: roundToNearest(estimatedPrice * (1 - spread), 5_000),
      max: roundToNearest(estimatedPrice * (1 + spread), 5_000),
    };

    return {
      request,
      estimatedPrice,
      averagePricePerSquareMeter,
      confidenceScore: Math.round(confidenceScore * 10) / 10,
      priceRange,
    };
  }
}
