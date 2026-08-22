const confidenceFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

/** Formats confidence 0–100 without floating junk (e.g. 48.2 or 48). */
export function formatConfidence(score: number): string {
  const bounded = Math.min(100, Math.max(0, score));
  const rounded =
    Math.abs(bounded - Math.round(bounded)) < 0.05
      ? Math.round(bounded)
      : Math.round(bounded * 10) / 10;
  return `${confidenceFormatter.format(rounded)}%`;
}

/** ROI / percentage with up to N decimals, no float junk. */
export function formatPercent(value: number, fractionDigits = 2): string {
  const factor = 10 ** fractionDigits;
  const rounded = Math.round(value * factor) / factor;
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(rounded)}%`;
}

export function calculateRoiPercent(
  currentValue: number,
  purchasePrice: number,
): number | null {
  if (!Number.isFinite(purchasePrice) || purchasePrice <= 0) return null;
  if (!Number.isFinite(currentValue)) return null;
  return ((currentValue - purchasePrice) / purchasePrice) * 100;
}

export function formatCompactMillions(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded = Math.round(millions * 10) / 10;
    return `${rounded.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`;
  }
  return String(Math.round(value));
}

export function formatStepProgress(current: number, total: number): {
  label: string;
  percent: number;
} {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 1), safeTotal);
  const percent = Math.round((safeCurrent / safeTotal) * 100);
  return {
    label: `خطوة ${safeCurrent} من ${safeTotal}`,
    percent,
  };
}
