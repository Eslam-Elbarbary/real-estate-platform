export function logMediaUploadInDev(
  phase: string,
  details?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.info(`[admin:media-upload:${phase}]`, details ?? {});
}
