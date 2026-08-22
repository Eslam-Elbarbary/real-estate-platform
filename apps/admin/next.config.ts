import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(projectRoot, '../..');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
