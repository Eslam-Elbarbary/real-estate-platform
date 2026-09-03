function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    return undefined;
  }
  return value.trim();
}

export const env = {
  apiBaseUrl: readEnv('NEXT_PUBLIC_API_URL') ?? 'http://localhost:4000',
} as const;
