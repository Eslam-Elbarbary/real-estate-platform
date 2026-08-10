import { cookies } from 'next/headers';
import type { ListingDraft, ListingDraftStep } from './types';

export const LISTING_DRAFTS_COOKIE = 'demo_listing_drafts';

function parseDrafts(raw: string | undefined): ListingDraft[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ListingDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
  getDraft(id: string): Promise<ListingDraft | null>;
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

  async getDraft(id: string): Promise<ListingDraft | null> {
    return (await this.readAll()).find((d) => d.id === id) ?? null;
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
    const id = `LD-${Date.now().toString(36).toUpperCase()}`;
    const draft = createEmptyDraft(userId, id);
    return this.saveDraft(draft);
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
