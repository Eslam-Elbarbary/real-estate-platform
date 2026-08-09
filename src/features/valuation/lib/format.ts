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
