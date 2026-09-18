/**
 * Pure resume / entry decisions for /add-property.
 * API DRAFT list is the only source of truth.
 */

export type DraftSummary = {
  id: string;
  title: string | null;
  status: string;
  updatedAt: string;
};

export type AddPropertyEntryDecision =
  | { kind: 'create' }
  | { kind: 'resume_one'; draft: DraftSummary }
  | { kind: 'choose'; drafts: DraftSummary[] };

export function decideAddPropertyEntry(
  drafts: DraftSummary[],
): AddPropertyEntryDecision {
  const onlyDrafts = drafts
    .filter((item) => item.status === 'DRAFT')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (onlyDrafts.length === 0) {
    return { kind: 'create' };
  }
  if (onlyDrafts.length === 1) {
    return { kind: 'resume_one', draft: onlyDrafts[0]! };
  }
  return { kind: 'choose', drafts: onlyDrafts };
}

export function shouldAutoOpenWizardAfterSubmit(status: string): boolean {
  return status === 'DRAFT' || status === 'REJECTED' || status === 'PENDING_PAYMENT';
}
