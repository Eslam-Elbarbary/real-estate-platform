import { randomBytes } from 'crypto';

/** Build a URL-safe slug base from a display title. */
export function slugifyTitle(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug.length > 0 ? slug : 'property';
}

/** Temporary unique slug for brand-new drafts (before a title exists). */
export function createTemporaryDraftSlug(): string {
  return `draft-${randomBytes(8).toString('hex')}`;
}
