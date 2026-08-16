import { cookies } from 'next/headers';
import { DEMO_PROPERTY_IMAGES } from './config';
import {
  deleteChunkedCookie,
  ListingDraftStorageError,
  parseJsonCookie,
  readChunkedCookie,
  writeChunkedCookie,
  type DraftCookieJar,
} from './lib/cookie-store';
import type {
  ListingDescriptionDraft,
  ListingDetailsDraft,
  ListingDraft,
  ListingDraftStep,
  ListingMediaDraft,
  ListingPricingDraft,
} from './types';

/** Legacy oversized collection cookie — migrated then deleted. */
export const LISTING_DRAFTS_COOKIE = 'demo_listing_drafts';
export const LISTING_DRAFTS_INDEX_COOKIE = 'demo_listing_drafts_index';

const STEP_KEYS = ['basic', 'details', 'price', 'description', 'media'] as const;
type StoredStepKey = (typeof STEP_KEYS)[number];

const createInFlight = new Map<string, Promise<ListingDraft>>();

interface DraftIndexEntry {
  id: string;
  ownerUserId: string;
  status: ListingDraft['status'];
  currentStep: ListingDraftStep;
  createdAt: string;
  updatedAt: string;
}

interface StoredBasic {
  transaction: ListingDraft['transaction'];
  propertyType: ListingDraft['propertyType'];
  locationId?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
}

function emptyDescription(): ListingDescriptionDraft {
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

export function listingStepCookieName(draftId: string, step: StoredStepKey): string {
  return `demo_listing_${draftId}_${step}`;
}

function isLightweightPreviewUrl(url: string): boolean {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return false;
  return url.length < 400;
}

function sanitizeMedia(media: ListingMediaDraft): ListingMediaDraft {
  return {
    videoUrl: media.videoUrl,
    images: media.images.map((img, index) => ({
      id: img.id,
      previewUrl: isLightweightPreviewUrl(img.previewUrl)
        ? img.previewUrl
        : DEMO_PROPERTY_IMAGES[index % DEMO_PROPERTY_IMAGES.length],
      name: img.name.slice(0, 80),
      size: img.size,
      order: img.order,
      isCover: img.isCover,
    })),
  };
}

function toIndexEntry(draft: ListingDraft): DraftIndexEntry {
  return {
    id: draft.id,
    ownerUserId: draft.ownerUserId,
    status: draft.status,
    currentStep: draft.currentStep,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };
}

function sliceBasic(draft: ListingDraft): StoredBasic {
  return {
    transaction: draft.transaction,
    propertyType: draft.propertyType,
    locationId: draft.locationId,
    locationLabel: draft.locationLabel,
    latitude: draft.latitude,
    longitude: draft.longitude,
  };
}

function parseLegacyDrafts(raw: string | undefined): ListingDraft[] {
  if (!raw) return [];
  const parsed = parseJsonCookie<unknown>(raw, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is ListingDraft =>
      Boolean(item && typeof item === 'object' && typeof (item as ListingDraft).id === 'string'),
  );
}

export interface ListingDraftRepository {
  listByUser(userId: string): Promise<ListingDraft[]>;
  getById(id: string): Promise<ListingDraft | null>;
  getDraft(id: string): Promise<ListingDraft | null>;
  getIncompleteDraft(userId: string): Promise<ListingDraft | null>;
  saveDraft(draft: ListingDraft): Promise<ListingDraft>;
  createDraft(userId: string): Promise<ListingDraft>;
  deleteDraft(id: string): Promise<void>;
}

export class CookieListingDraftRepository implements ListingDraftRepository {
  private migrated = false;

  private async jar(): Promise<DraftCookieJar> {
    return (await cookies()) as unknown as DraftCookieJar;
  }

  private async migrateLegacyIfNeeded(jar: DraftCookieJar): Promise<void> {
    if (this.migrated) return;
    this.migrated = true;
    const legacy = jar.get(LISTING_DRAFTS_COOKIE)?.value;
    if (!legacy) return;

    const drafts = parseLegacyDrafts(legacy);
    try {
      if (drafts.length > 0) {
        const index = parseJsonCookie<DraftIndexEntry[]>(
          readChunkedCookie(jar, LISTING_DRAFTS_INDEX_COOKIE),
          [],
        );
        const byId = new Map(index.map((entry) => [entry.id, entry]));
        for (const draft of drafts) {
          if (byId.has(draft.id)) continue;
          this.writeDraftParts(jar, draft);
          byId.set(draft.id, toIndexEntry(draft));
        }
        writeChunkedCookie(
          jar,
          LISTING_DRAFTS_INDEX_COOKIE,
          JSON.stringify([...byId.values()]),
        );
      }
    } catch {
      // Unreadable or unsafe legacy payload: drop only the obsolete cookie.
    }
    jar.delete(LISTING_DRAFTS_COOKIE);
  }

  private readIndex(jar: DraftCookieJar): DraftIndexEntry[] {
    const parsed = parseJsonCookie<DraftIndexEntry[]>(
      readChunkedCookie(jar, LISTING_DRAFTS_INDEX_COOKIE),
      [],
    );
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string');
  }

  private writeIndex(jar: DraftCookieJar, entries: DraftIndexEntry[]): void {
    writeChunkedCookie(jar, LISTING_DRAFTS_INDEX_COOKIE, JSON.stringify(entries));
  }

  private writeDraftParts(jar: DraftCookieJar, draft: ListingDraft): void {
    writeChunkedCookie(
      jar,
      listingStepCookieName(draft.id, 'basic'),
      JSON.stringify(sliceBasic(draft)),
    );
    writeChunkedCookie(
      jar,
      listingStepCookieName(draft.id, 'details'),
      JSON.stringify(draft.details),
    );
    writeChunkedCookie(
      jar,
      listingStepCookieName(draft.id, 'price'),
      JSON.stringify(draft.pricing),
    );
    writeChunkedCookie(
      jar,
      listingStepCookieName(draft.id, 'description'),
      JSON.stringify(draft.description),
    );
    writeChunkedCookie(
      jar,
      listingStepCookieName(draft.id, 'media'),
      JSON.stringify(sanitizeMedia(draft.media)),
    );
  }

  private deleteDraftParts(jar: DraftCookieJar, id: string): void {
    for (const step of STEP_KEYS) {
      deleteChunkedCookie(jar, listingStepCookieName(id, step));
    }
  }

  private hydrate(jar: DraftCookieJar, entry: DraftIndexEntry): ListingDraft {
    const draft = createEmptyDraft(entry.ownerUserId, entry.id);
    draft.status = entry.status;
    draft.currentStep = entry.currentStep;
    draft.createdAt = entry.createdAt;
    draft.updatedAt = entry.updatedAt;

    const basic = parseJsonCookie<StoredBasic | null>(
      readChunkedCookie(jar, listingStepCookieName(entry.id, 'basic')),
      null,
    );
    if (basic) {
      draft.transaction = basic.transaction ?? draft.transaction;
      draft.propertyType = basic.propertyType ?? draft.propertyType;
      draft.locationId = basic.locationId;
      draft.locationLabel = basic.locationLabel;
      draft.latitude = basic.latitude;
      draft.longitude = basic.longitude;
    }

    const details = parseJsonCookie<ListingDetailsDraft | null>(
      readChunkedCookie(jar, listingStepCookieName(entry.id, 'details')),
      null,
    );
    if (details) draft.details = { ...draft.details, ...details };

    const pricing = parseJsonCookie<ListingPricingDraft | null>(
      readChunkedCookie(jar, listingStepCookieName(entry.id, 'price')),
      null,
    );
    if (pricing) draft.pricing = pricing;

    const description = parseJsonCookie<ListingDescriptionDraft | null>(
      readChunkedCookie(jar, listingStepCookieName(entry.id, 'description')),
      null,
    );
    if (description) {
      draft.description = {
        ar: { ...emptyDescription().ar, ...description.ar },
        en: { ...emptyDescription().en, ...description.en },
      };
    }

    const media = parseJsonCookie<ListingMediaDraft | null>(
      readChunkedCookie(jar, listingStepCookieName(entry.id, 'media')),
      null,
    );
    if (media) draft.media = sanitizeMedia({ images: media.images ?? [], videoUrl: media.videoUrl });

    return draft;
  }

  async listByUser(userId: string): Promise<ListingDraft[]> {
    const jar = await this.jar();
    await this.migrateLegacyIfNeeded(jar);
    return this.readIndex(jar)
      .filter((entry) => entry.ownerUserId === userId && entry.status !== 'published')
      .map((entry) => this.hydrate(jar, entry));
  }

  async getById(id: string): Promise<ListingDraft | null> {
    const jar = await this.jar();
    await this.migrateLegacyIfNeeded(jar);
    const entry = this.readIndex(jar).find((item) => item.id === id);
    if (!entry) return null;
    return this.hydrate(jar, entry);
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
    const jar = await this.jar();
    await this.migrateLegacyIfNeeded(jar);
    const next: ListingDraft = {
      ...draft,
      media: sanitizeMedia(draft.media),
      updatedAt: new Date().toISOString(),
    };
    const index = this.readIndex(jar);
    const entry = toIndexEntry(next);
    const existing = index.findIndex((item) => item.id === next.id);
    if (existing >= 0) index[existing] = entry;
    else index.unshift(entry);
    this.writeDraftParts(jar, next);
    this.writeIndex(jar, index);
    const stored = this.hydrate(jar, entry);
    if (!stored) {
      throw new ListingDraftStorageError('LISTING_DRAFT_PERSISTENCE_FAILED');
    }
    return stored;
  }

  async deleteDraft(id: string): Promise<void> {
    const jar = await this.jar();
    await this.migrateLegacyIfNeeded(jar);
    this.writeIndex(
      jar,
      this.readIndex(jar).filter((entry) => entry.id !== id),
    );
    this.deleteDraftParts(jar, id);
    jar.delete(LISTING_DRAFTS_COOKIE);
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
      throw new ListingDraftStorageError('LISTING_DRAFT_PERSISTENCE_FAILED');
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

export { ListingDraftStorageError };
