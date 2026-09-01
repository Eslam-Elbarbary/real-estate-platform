/**
 * Detects Next.js navigation errors that must be re-thrown and not handled.
 */
export function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false;
  }

  const digest = (error as { digest: unknown }).digest;
  return (
    typeof digest === 'string' &&
    (digest.startsWith('NEXT_REDIRECT') || digest.startsWith('NEXT_NOT_FOUND'))
  );
}
