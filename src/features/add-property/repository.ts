import { cookies } from 'next/headers';
import type { ListingDraft, ListingDraftStep } from './types';

export const LISTING_DRAFTS_COOKIE = 'demo_listing_drafts';

const createInFlight = new Map<string, Promise<ListingDraft>>();

function parseDrafts(raw: string | undefined): ListingDraft[] {
  if (!raw) return [];
  const attempts = [raw];
  if (raw.includes('%')) {
    try {
      attempts.push(decodeURIComponent(raw));
    } catch {
      // Cookie may already be decoded JSON.
    }
  }
  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate) as ListingDraft[];
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is ListingDraft =>
            Boolean(item && typeof item === 'object' && typeof item.id === 'string'),
        );
      }
    } catch {
      // Try the next encoding.
    }
  }
  return [];
}

function emptyDescription() {
  return {
    ar: { title: '', description: '', address: '' },
    en: { title: '', description: '', address: '' },
  };
}

export function createEmptyDraft(userId: string, id: string): ListingDraft {
  const now = new Date().toISOString();
  return {
    id,
    ownerUserId: userId,
    transaction: 'sale',
    propertyType: null,
    details: {
      views: [],
      amenities: [],
      mortgageEligible: false,
    },
    pricing: { mode: null },
    description: emptyDescription(),
    media: { images: [] },
    currentStep: 'basic',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

export interface ListingDraftRepository {
  listByUser(userId: string): Promise<ListingDraft[]>;
  getById(id: string): Promise<ListingDraft | null>;
  getDraft(id: string): Promise<ListingDraft | null>;
  getIncompleteDraft(userId: string): Promise<ListingDraft | null>;
  saveDraft(draft: ListingDraft): Promise<ListingDraft>;
  createDraft(userId: string): Promise<ListingDraft>;
}

export class CookieListingDraftRepository implements ListingDraftRepository {
  private async readAll(): Promise<ListingDraft[]> {
    const jar = await cookies();
    return parseDrafts(jar.get(LISTING_DRAFTS_COOKIE)?.value);
  }

  private async writeAll(drafts: ListingDraft[]): Promise<void> {
    const jar = await cookies();
    jar.set(LISTING_DRAFTS_COOKIE, JSON.stringify(drafts), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async listByUser(userId: string): Promise<ListingDraft[]> {
    return (await this.readAll()).filter(
      (d) => d.ownerUserId === userId && d.status !== 'published',
    );
  }

  async getById(id: string): Promise<ListingDraft | null> {
    return (await this.readAll()).find((d) => d.id === id) ?? null;
  }

  async getDraft(id: string): Promise<ListingDraft | null> {
    return this.getById(id);
  }

  async getIncompleteDraft(userId: string): Promise<ListingDraft | null> {
    const drafts = await this.listByUser(userId);
    const incomplete = drafts
      .filter((draft) => draft.status !== 'published')
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    return incomplete[0] ?? null;
  }

  async saveDraft(draft: ListingDraft): Promise<ListingDraft> {
    const all = await this.readAll();
    const next = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    const index = all.findIndex((d) => d.id === draft.id);
    if (index >= 0) all[index] = next;
    else all.unshift(next);
    await this.writeAll(all);
    return next;
  }

  async createDraft(userId: string): Promise<ListingDraft> {
    const existing = await this.getIncompleteDraft(userId);
    if (existing) return existing;

    const pending = createInFlight.get(userId);
    if (pending) return pending;

    const job = this.createFreshDraft(userId).finally(() => {
      createInFlight.delete(userId);
    });
    createInFlight.set(userId, job);
    return job;
  }

  private async createFreshDraft(userId: string): Promise<ListingDraft> {
    const existing = await this.getIncompleteDraft(userId);
    if (existing) return existing;
    const id = `LD-${Date.now().toString(36).toUpperCase()}`;
    const draft = createEmptyDraft(userId, id);
    const saved = await this.saveDraft(draft);
    const stored = await this.getById(saved.id);
    if (!stored) {
      throw new Error('LISTING_DRAFT_PERSISTENCE_FAILED');
    }
    return stored;
  }
}

let repository: ListingDraftRepository | null = null;

export function getListingDraftRepository(): ListingDraftRepository {
  if (!repository) repository = new CookieListingDraftRepository();
  return repository;
}

export function nextStepAfter(step: ListingDraftStep): ListingDraftStep | 'checkout' {
  const order: Array<ListingDraftStep | 'checkout'> = [
    'basic',
    'details',
    'price',
    'description',
    'media',
    'publish',
    'checkout',
  ];
  const index = order.indexOf(step);
  return order[Math.min(index + 1, order.length - 1)];
}
