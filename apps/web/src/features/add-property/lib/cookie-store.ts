import { deflateSync, inflateSync } from 'node:zlib';

export const SAFE_COOKIE_MAX_CHARS = 3500;
export const BROWSER_COOKIE_MAX_CHARS = 4096;
const MAX_CHUNKS = 24;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const COMPRESSED_PREFIX = 'z1.';

export class ListingDraftStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ListingDraftStorageError';
  }
}

export interface DraftCookieJar {
  get(name: string): { value: string } | undefined;
  getAll(): Array<{ name: string; value: string }>;
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: 'lax' | 'strict' | 'none';
      path?: string;
      secure?: boolean;
      maxAge?: number;
    },
  ): void;
  delete(name: string): void;
}

export const listingDraftCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: COOKIE_MAX_AGE,
};

/** Chromium counts cookie name + value characters (typically after encoding). */
export function cookieNameValueSize(name: string, value: string): number {
  return name.length + encodeURIComponent(value).length;
}

export function assertCookieFits(name: string, value: string): void {
  const size = cookieNameValueSize(name, value);
  if (size > SAFE_COOKIE_MAX_CHARS) {
    throw new ListingDraftStorageError(
      `تعذر حفظ المسودة: حجم الكوكي (${size}) يتجاوز الحد الآمن`,
    );
  }
}

function decodeCookieValue(raw: string): string {
  if (!raw.includes('%')) return raw;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function toBase64Url(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string): Buffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, 'base64');
}

function encodeStoredPayload(value: string): string {
  const compressed = deflateSync(Buffer.from(value, 'utf8'));
  return COMPRESSED_PREFIX + toBase64Url(compressed);
}

function decodeStoredPayload(value: string): string {
  if (!value.startsWith(COMPRESSED_PREFIX)) return value;
  const body = value.slice(COMPRESSED_PREFIX.length);
  return inflateSync(fromBase64Url(body)).toString('utf8');
}

function maxPrefixFittingBudget(value: string, budget: number): number {
  if (budget <= 0) return 0;
  let low = 0;
  let high = value.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const encoded = encodeURIComponent(value.slice(0, mid)).length;
    if (encoded <= budget) low = mid;
    else high = mid - 1;
  }
  return low;
}

function splitValueForCookie(baseName: string, value: string): string[] {
  const chunks: string[] = [];
  let remaining = value;
  while (remaining.length > 0) {
    if (chunks.length >= MAX_CHUNKS) {
      throw new ListingDraftStorageError(
        'تعذر حفظ المسودة: المحتوى أكبر من المساحة المتاحة',
      );
    }
    const chunkName = `${baseName}__${chunks.length}`;
    const budget = SAFE_COOKIE_MAX_CHARS - chunkName.length;
    const take = maxPrefixFittingBudget(remaining, budget);
    if (take <= 0) {
      throw new ListingDraftStorageError(
        'تعذر حفظ المسودة: اسم الكوكي طويل جداً',
      );
    }
    chunks.push(remaining.slice(0, take));
    remaining = remaining.slice(take);
  }
  return chunks.length > 0 ? chunks : [''];
}

function deleteChunkFamily(jar: DraftCookieJar, baseName: string): void {
  jar.delete(baseName);
  jar.delete(`${baseName}__meta`);
  for (let i = 0; i < MAX_CHUNKS; i += 1) {
    jar.delete(`${baseName}__${i}`);
  }
}

export function deleteChunkedCookie(jar: DraftCookieJar, baseName: string): void {
  deleteChunkFamily(jar, baseName);
}

export function readChunkedCookie(
  jar: DraftCookieJar,
  baseName: string,
): string | undefined {
  const metaRaw = jar.get(`${baseName}__meta`)?.value;
  if (metaRaw) {
    try {
      const meta = JSON.parse(decodeCookieValue(metaRaw)) as { n?: number };
      const count = typeof meta.n === 'number' ? meta.n : 0;
      if (count < 1) return undefined;
      const parts: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const piece = jar.get(`${baseName}__${i}`)?.value;
        if (piece == null) return undefined;
        parts.push(decodeCookieValue(piece));
      }
      return decodeStoredPayload(parts.join(''));
    } catch {
      return undefined;
    }
  }
  const single = jar.get(baseName)?.value;
  return single == null ? undefined : decodeStoredPayload(decodeCookieValue(single));
}

export function writeChunkedCookie(
  jar: DraftCookieJar,
  baseName: string,
  value: string,
): void {
  const packed = encodeStoredPayload(value);
  const existingMeta = jar.get(`${baseName}__meta`)?.value;
  let previousChunks = 0;
  if (existingMeta) {
    try {
      const meta = JSON.parse(decodeCookieValue(existingMeta)) as { n?: number };
      previousChunks = typeof meta.n === 'number' ? meta.n : 0;
    } catch {
      previousChunks = 0;
    }
  }

  const encodedSingle = cookieNameValueSize(baseName, packed);
  if (encodedSingle <= SAFE_COOKIE_MAX_CHARS) {
    assertCookieFits(baseName, packed);
    jar.set(baseName, packed, listingDraftCookieOptions);
    jar.delete(`${baseName}__meta`);
    const stale = Math.max(previousChunks, 8);
    for (let i = 0; i < stale; i += 1) {
      jar.delete(`${baseName}__${i}`);
    }
    return;
  }

  const chunks = splitValueForCookie(baseName, packed);
  const meta = JSON.stringify({ n: chunks.length });
  assertCookieFits(`${baseName}__meta`, meta);
  jar.delete(baseName);
  jar.set(`${baseName}__meta`, meta, listingDraftCookieOptions);
  chunks.forEach((chunk, index) => {
    const name = `${baseName}__${index}`;
    assertCookieFits(name, chunk);
    jar.set(name, chunk, listingDraftCookieOptions);
  });
  for (let i = chunks.length; i < Math.max(previousChunks, chunks.length); i += 1) {
    jar.delete(`${baseName}__${i}`);
  }
}

export function parseJsonCookie<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  const attempts = [raw];
  if (raw.includes('%')) {
    try {
      attempts.push(decodeURIComponent(raw));
    } catch {
      // already decoded
    }
  }
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // try next
    }
  }
  return fallback;
}

export function listCookiesByPrefix(
  jar: DraftCookieJar,
  prefix: string,
): Array<{ name: string; value: string }> {
  return jar.getAll().filter((cookie) => cookie.name.startsWith(prefix));
}

export function createMemoryDraftCookieJar(): DraftCookieJar {
  const map = new Map<string, string>();
  return {
    get(name) {
      const value = map.get(name);
      return value == null ? undefined : { value };
    },
    getAll() {
      return [...map.entries()].map(([name, value]) => ({ name, value }));
    },
    set(name, value) {
      map.set(name, value);
    },
    delete(name) {
      map.delete(name);
    },
  };
}
