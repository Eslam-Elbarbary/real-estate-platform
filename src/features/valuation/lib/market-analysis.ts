import type {
  ValuationMarketAnalysis,
  ValuationPriceHistoryPoint,
  ValuationRequest,
  ValuationResult,
  ValuationDemandLabel,
} from '../types';

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function demandLabel(percentage: number): ValuationDemandLabel {
  if (percentage <= 39) return 'منخفض';
  if (percentage <= 74) return 'متوسط';
  return 'مرتفع';
}

const MONTH_LABELS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
] as const;

/**
 * Deterministic demo market analysis for owned-property reports.
 * Same request/result always yields the same analysis.
 */
export function buildMockValuationMarketAnalysis(
  request: ValuationRequest,
  result: ValuationResult,
): ValuationMarketAnalysis {
  const key = [
    result.id,
    request.goal,
    request.location.slug,
    request.propertyType,
    request.area ?? 0,
    request.purchasePrice ?? 0,
    request.purchaseDate ?? '',
    Math.round(result.estimatedPrice),
  ].join('|');

  const hash = stableHash(key);
  const sampleSize = 80 + (hash % 121); // 80–200
  const demandPercentage = 25 + (hash % 66); // 25–90

  const endValue = result.estimatedPrice;
  const startBase =
    request.purchasePrice && request.purchasePrice > 0
      ? Math.min(request.purchasePrice, endValue) * 0.85 +
        Math.max(request.purchasePrice, endValue) * 0.05
      : endValue * 0.72;

  const priceHistory: ValuationPriceHistoryPoint[] = [];
  const endMonthIndex = 7; // August-ish anchor for stable labels
  for (let i = 0; i < 12; i += 1) {
    const t = i / 11;
    const wave = ((hash >> (i % 8)) & 7) / 7;
    const progress = t * t * (0.55 + wave * 0.2) + t * (0.45 - wave * 0.1);
    const value = Math.round(startBase + (endValue - startBase) * progress);
    const monthIndex = (endMonthIndex - 11 + i + 12 * 3) % 12;
    priceHistory.push({
      month: MONTH_LABELS[monthIndex],
      value: i === 11 ? endValue : Math.max(1, value),
    });
  }

  const first = priceHistory[0]?.value ?? endValue;
  const annualChangePercent =
    first > 0 ? ((endValue - first) / first) * 100 : 0;

  return {
    sampleSize,
    demand: {
      percentage: demandPercentage,
      label: demandLabel(demandPercentage),
    },
    priceHistory,
    annualChangePercent,
  };
}
