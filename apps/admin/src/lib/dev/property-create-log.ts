export function logPropertyCreateInDev(
  phase: string,
  details?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.info(`[admin:property-create:${phase}]`, details ?? {});
}
