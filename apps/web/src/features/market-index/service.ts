import type { PageSeoInput } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { MARKET_INDEX_PAGE_SIZE, marketIndexCopy } from './config';
import {
  getMarketIndexRepository,
  type MarketIndexRepository,
} from './repository';
import type {
  MarketIndexDetailsView,
  MarketIndexEntry,
  MarketIndexFilters,
  MarketIndexListResult,
} from './types';

export class MarketIndexService {
  constructor(
    private readonly repository: MarketIndexRepository = getMarketIndexRepository(),
  ) {}

  async list(filters: MarketIndexFilters): Promise<MarketIndexListResult> {
    const all = await this.repository.listEntries();
    const filtered = filters.year
      ? all.filter((item) => item.year === filters.year)
      : all;
    const pageSize = MARKET_INDEX_PAGE_SIZE;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
    const page = Math.min(Math.max(filters.page, 1), totalPages);
    const start = (page - 1) * pageSize;
    const latest = all[0] ?? null;

    return {
      items: filtered.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
      filters: { ...filters, page },
      archive: await this.repository.getArchive(),
      summary: latest
        ? { latest, totalEntries: all.length }
        : null,
    };
  }

  async getDetails(
    year: number,
    month: number,
  ): Promise<MarketIndexDetailsView | null> {
    const entry = await this.repository.getByPeriod(year, month);
    if (!entry) return null;
    const { previous, next } = await this.repository.getAdjacent(year, month);
    return {
      entry,
      previous,
      next,
      archive: await this.repository.getArchive(),
    };
  }

  async listPeriods(): Promise<Pick<MarketIndexEntry, 'year' | 'month'>[]> {
    const all = await this.repository.listEntries();
    return all.map((item) => ({ year: item.year, month: item.month }));
  }

  buildListingMetadata(filters: MarketIndexFilters): PageSeoInput {
    const yearSuffix = filters.year ? ` — ${filters.year}` : '';
    return {
      title: `${marketIndexCopy.seoTitle}${yearSuffix}`,
      description: marketIndexCopy.seoDescription,
      path: routes.marketIndex.root,
    };
  }

  buildMonthMetadata(entry: MarketIndexEntry): PageSeoInput {
    return {
      title: entry.seoTitle ?? entry.title,
      description: entry.seoDescription ?? entry.shortDescription,
      path: routes.marketIndex.month(entry.year, entry.month),
      type: 'article',
    };
  }
}

let service: MarketIndexService | undefined;

export function getMarketIndexService(): MarketIndexService {
  service ??= new MarketIndexService();
  return service;
}
