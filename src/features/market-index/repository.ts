import { routes } from '@/config/routes';
import { arabicMonthName } from './config';
import { marketIndexDemoEntries } from './demo-data';
import type {
  MarketIndexArchiveGroup,
  MarketIndexEntry,
} from './types';

export interface MarketIndexRepository {
  listEntries(): Promise<MarketIndexEntry[]>;
  getByPeriod(year: number, month: number): Promise<MarketIndexEntry | null>;
  getArchive(): Promise<MarketIndexArchiveGroup[]>;
  getAdjacent(
    year: number,
    month: number,
  ): Promise<{ previous: MarketIndexEntry | null; next: MarketIndexEntry | null }>;
}

function sortedNewestFirst(): MarketIndexEntry[] {
  return [...marketIndexDemoEntries].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}

function sortedOldestFirst(): MarketIndexEntry[] {
  return [...marketIndexDemoEntries].sort((left, right) =>
    left.publishedAt.localeCompare(right.publishedAt),
  );
}

function buildArchive(entries: MarketIndexEntry[]): MarketIndexArchiveGroup[] {
  const groups = new Map<number, MarketIndexArchiveGroup>();
  for (const entry of entries) {
    const group = groups.get(entry.year) ?? { year: entry.year, items: [] };
    group.items.push({
      year: entry.year,
      month: entry.month,
      label: `${arabicMonthName(entry.month)} ${entry.year}`,
      href: routes.marketIndex.month(entry.year, entry.month),
    });
    groups.set(entry.year, group);
  }
  return [...groups.values()].sort((a, b) => b.year - a.year);
}

export class MockMarketIndexRepository implements MarketIndexRepository {
  async listEntries(): Promise<MarketIndexEntry[]> {
    return sortedNewestFirst();
  }

  async getByPeriod(year: number, month: number): Promise<MarketIndexEntry | null> {
    return (
      marketIndexDemoEntries.find(
        (item) => item.year === year && item.month === month,
      ) ?? null
    );
  }

  async getArchive(): Promise<MarketIndexArchiveGroup[]> {
    return buildArchive(sortedNewestFirst());
  }

  async getAdjacent(year: number, month: number) {
    const chronological = sortedOldestFirst();
    const index = chronological.findIndex(
      (item) => item.year === year && item.month === month,
    );
    if (index < 0) {
      return { previous: null, next: null };
    }
    return {
      previous: chronological[index - 1] ?? null,
      next: chronological[index + 1] ?? null,
    };
  }
}

let repository: MarketIndexRepository | undefined;

export function getMarketIndexRepository(): MarketIndexRepository {
  repository ??= new MockMarketIndexRepository();
  return repository;
}
