/**
 * Copies local compound photography into public/assets/compounds-directory.
 * Compound records themselves are built in TypeScript via createMockCompound
 * (src/data/mock/compounds.ts) — do not regenerate the TS data from this script.
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';

const outDir = 'public/assets/compounds-directory';
mkdirSync(outDir, { recursive: true });

const propertyAssets = readdirSync('public/assets/properties')
  .filter((name) => name.endsWith('.webp'))
  .sort();
const homeCompounds = readdirSync('public/assets/home/compounds')
  .filter((name) => name.endsWith('.webp'))
  .sort();

const preferred = homeCompounds.map((name) =>
  path.join('public/assets/home/compounds', name),
);
const fallback = propertyAssets.map((name) =>
  path.join('public/assets/properties', name),
);
const sourceImages =
  preferred.length >= 12 ? preferred : [...preferred, ...fallback];

const assetTarget = 28;
for (let i = 0; i < assetTarget; i += 1) {
  const dest = path.join(
    outDir,
    `compound-${String(i + 1).padStart(2, '0')}.webp`,
  );
  copyFileSync(sourceImages[i % sourceImages.length], dest);
}

const assetCount = readdirSync(outDir).filter((n) => n.endsWith('.webp')).length;
console.log('synced', assetCount, 'compound directory assets');
