import { cookies } from 'next/headers';
import type {
  PropertyPortfolioItem,
  ValuationRequest,
  ValuationResult,
} from './types';
import { MockValuationEngine } from './mock-engine';

export const VALUATION_STORE_COOKIE = 'demo_valuations';

const SEED_RESULTS: ValuationResult[] = [
  {
    id: 'val-seed-nasr-apartment',
    request: {
      goal: 'price-inquiry',
      location: {
        slug: 'new-cairo',
        name: 'القاهرة الجديدة - التجمع الخامس',
        citySlug: 'new-cairo',
        governorateSlug: 'greater-cairo',
      },
      propertyType: 'apartment',
      view: 'garden',
      finishing: 'lux',
      area: 145,
      bedrooms: 3,
      bathrooms: 2,
    },
    estimatedPrice: 6_960_000,
    averagePricePerSquareMeter: 48_000,
    confidenceScore: 71.2,
    priceRange: { min: 6_400_000, max: 7_520_000 },
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'val-seed-zayed-villa',
    request: {
      goal: 'owned-property',
      location: {
        slug: 'sheikh-zayed',
        name: 'الشيخ زايد',
        citySlug: 'sheikh-zayed',
        governorateSlug: 'giza',
      },
      propertyType: 'villa',
      view: 'golf',
      finishing: 'super_lux',
      area: 320,
      bedrooms: 5,
      bathrooms: 4,
      purchasePrice: 9_500_000,
      purchaseDate: '2019-03',
      currentOwnerEstimate: 18_000_000,
    },
    estimatedPrice: 18_240_000,
    averagePricePerSquareMeter: 57_000,
    confidenceScore: 68.5,
    priceRange: { min: 16_700_000, max: 19_800_000 },
    createdAt: '2026-05-02T10:00:00.000Z',
    updatedAt: '2026-07-20T10:00:00.000Z',
  },
];

export interface ValuationRepository {
  listValuations(): Promise<ValuationResult[]>;
  listPortfolio(): Promise<PropertyPortfolioItem[]>;
  findById(id: string): Promise<ValuationResult | null>;
  createFromRequest(request: ValuationRequest): Promise<ValuationResult>;
}

function toPortfolioItem(result: ValuationResult): PropertyPortfolioItem {
  return {
    id: `portfolio-${result.id}`,
    valuationId: result.id,
    locationLabel: result.request.location.name,
    propertyType: result.request.propertyType,
    averagePricePerSquareMeter: result.averagePricePerSquareMeter,
    estimatedPrice: result.estimatedPrice,
    updatedAt: result.updatedAt,
  };
}

function parseStore(raw: string | undefined): ValuationResult[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ValuationResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeResults(sessionResults: ValuationResult[]): ValuationResult[] {
  const byId = new Map<string, ValuationResult>();
  for (const item of SEED_RESULTS) byId.set(item.id, item);
  for (const item of sessionResults) byId.set(item.id, item);
  return [...byId.values()].sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );
}

export class CookieValuationRepository implements ValuationRepository {
  private readonly engine = new MockValuationEngine();

  private async readSessionResults(): Promise<ValuationResult[]> {
    const jar = await cookies();
    return parseStore(jar.get(VALUATION_STORE_COOKIE)?.value);
  }

  private async writeSessionResults(results: ValuationResult[]): Promise<void> {
    const jar = await cookies();
    jar.set(VALUATION_STORE_COOKIE, JSON.stringify(results), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async listValuations(): Promise<ValuationResult[]> {
    const sessionResults = await this.readSessionResults();
    // All saved valuations appear under التقييمات; owned ones also surface in portfolio.
    return mergeResults(sessionResults);
  }

  async listPortfolio(): Promise<PropertyPortfolioItem[]> {
    const sessionResults = await this.readSessionResults();
    return mergeResults(sessionResults)
      .filter((item) => item.request.goal === 'owned-property')
      .map(toPortfolioItem);
  }

  async findById(id: string): Promise<ValuationResult | null> {
    const sessionResults = await this.readSessionResults();
    return mergeResults(sessionResults).find((item) => item.id === id) ?? null;
  }

  async createFromRequest(request: ValuationRequest): Promise<ValuationResult> {
    const computed = this.engine.calculate(request);
    const now = new Date().toISOString();
    const fingerprint = [
      request.goal,
      request.location.slug,
      request.propertyType,
      String(request.area ?? 0),
      String(computed.estimatedPrice),
    ].join('-');
    const id = `val-${fingerprint.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 48)}`;

    const result: ValuationResult = {
      id,
      ...computed,
      createdAt: now,
      updatedAt: now,
    };

    const existing = await this.readSessionResults();
    const next = [result, ...existing.filter((item) => item.id !== id)];
    await this.writeSessionResults(next);
    return result;
  }
}

let valuationRepository: ValuationRepository | null = null;

export function getValuationRepository(): ValuationRepository {
  if (!valuationRepository) {
    valuationRepository = new CookieValuationRepository();
  }
  return valuationRepository;
}

/** Pure engine access for client-side analysis preview before persist. */
export function calculateDeterministicValuation(request: ValuationRequest) {
  return new MockValuationEngine().calculate(request);
}
