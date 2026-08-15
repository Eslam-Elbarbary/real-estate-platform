export type MarketIndexPeriod = {
  year: number;
  month: number;
};

export type MarketIndexPoint = {
  label: string;
  value: number;
};

export type MarketIndexEntry = {
  id: string;
  slug: string;
  year: number;
  month: number;
  title: string;
  shortDescription: string;
  content: string[];
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  chartPoints: MarketIndexPoint[];
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type MarketIndexArchiveItem = {
  year: number;
  month: number;
  label: string;
  href: string;
};

export type MarketIndexArchiveGroup = {
  year: number;
  items: MarketIndexArchiveItem[];
};

export type MarketIndexSummary = {
  latest: MarketIndexEntry;
  totalEntries: number;
};

export type MarketIndexFilters = {
  page: number;
  year?: number;
};

export type MarketIndexListResult = {
  items: MarketIndexEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: MarketIndexFilters;
  archive: MarketIndexArchiveGroup[];
  summary: MarketIndexSummary | null;
};

export type MarketIndexDetailsView = {
  entry: MarketIndexEntry;
  previous: MarketIndexEntry | null;
  next: MarketIndexEntry | null;
  archive: MarketIndexArchiveGroup[];
};
