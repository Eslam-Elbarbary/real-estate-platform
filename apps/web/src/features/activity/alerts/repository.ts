import { cookies } from 'next/headers';
import type { CreatePropertyAlertInput, PropertyAlert } from '../types';

export const ALERTS_COOKIE = 'demo_alerts';

/** Deterministic fictional seed alerts — not screenshot PII. */
export const SEED_ALERTS: PropertyAlert[] = [
  {
    id: 'alert-seed-alex-rent',
    locations: [
      { id: 'loc-alexandria', slug: 'alexandria', label: 'الإسكندرية' },
    ],
    transaction: 'rent',
    propertyType: 'apartment',
    minPrice: 3_500,
    maxPrice: 8_000,
    minArea: 80,
    maxArea: 140,
    enabled: true,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'alert-seed-new-cairo-sale',
    locations: [
      {
        id: 'loc-new-cairo',
        slug: 'new-cairo',
        label: 'القاهرة الجديدة - التجمع الخامس',
      },
    ],
    transaction: 'sale',
    propertyType: 'villa',
    minPrice: 8_000_000,
    maxPrice: 18_000_000,
    minArea: 200,
    maxArea: 400,
    enabled: true,
    createdAt: '2026-06-15T10:00:00.000Z',
  },
  {
    id: 'alert-seed-zayed-apartment',
    locations: [
      { id: 'loc-sheikh-zayed', slug: 'sheikh-zayed', label: 'الشيخ زايد' },
    ],
    transaction: 'sale',
    propertyType: 'apartment',
    minPrice: 3_000_000,
    maxPrice: 6_500_000,
    enabled: false,
    createdAt: '2026-07-02T10:00:00.000Z',
  },
];

function parseAlerts(raw: string | undefined): PropertyAlert[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PropertyAlert[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeAlerts(session: PropertyAlert[]): PropertyAlert[] {
  const byId = new Map<string, PropertyAlert>();
  for (const item of SEED_ALERTS) byId.set(item.id, item);
  for (const item of session) byId.set(item.id, item);
  return [...byId.values()].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export interface AlertsRepository {
  list(userId: string): Promise<PropertyAlert[]>;
  create(userId: string, input: CreatePropertyAlertInput): Promise<PropertyAlert>;
  setEnabled(userId: string, id: string, enabled: boolean): Promise<PropertyAlert | null>;
}

export class CookieAlertsRepository implements AlertsRepository {
  private async readSession(): Promise<PropertyAlert[]> {
    const jar = await cookies();
    return parseAlerts(jar.get(ALERTS_COOKIE)?.value);
  }

  private async writeSession(alerts: PropertyAlert[]): Promise<void> {
    const jar = await cookies();
    jar.set(ALERTS_COOKIE, JSON.stringify(alerts), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async list(_userId: string): Promise<PropertyAlert[]> {
    void _userId;
    return mergeAlerts(await this.readSession());
  }

  async create(
    _userId: string,
    input: CreatePropertyAlertInput,
  ): Promise<PropertyAlert> {
    void _userId;
    const fingerprint = [
      input.locations.map((l) => l.slug).join('_'),
      input.propertyType,
      input.transaction,
      String(input.minPrice ?? 0),
      String(input.maxPrice ?? 0),
    ].join('-');
    const id = `alert-${fingerprint.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 48)}`;
    const alert: PropertyAlert = {
      id,
      ...input,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    const session = await this.readSession();
    const next = [alert, ...session.filter((item) => item.id !== id)];
    await this.writeSession(next);
    return alert;
  }

  async setEnabled(
    _userId: string,
    id: string,
    enabled: boolean,
  ): Promise<PropertyAlert | null> {
    void _userId;
    const merged = mergeAlerts(await this.readSession());
    const current = merged.find((item) => item.id === id);
    if (!current) return null;
    const updated = { ...current, enabled };
    const session = await this.readSession();
    const nextSession = [
      updated,
      ...session.filter((item) => item.id !== id),
    ];
    await this.writeSession(nextSession);
    return updated;
  }
}

let alertsRepository: AlertsRepository | null = null;

export function getAlertsRepository(): AlertsRepository {
  if (!alertsRepository) alertsRepository = new CookieAlertsRepository();
  return alertsRepository;
}
