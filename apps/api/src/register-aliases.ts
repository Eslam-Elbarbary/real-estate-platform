import { addAliases } from 'module-alias';
import { join } from 'path';

// dist/main.js and src/main.ts both sit one level under the api root, so
// this resolves to apps/api/prisma in both the dev (tsc watch) and prod build.
addAliases({
  '@/prisma': join(__dirname, '..', 'prisma'),
});
