import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();

async function download(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'EgyptHomesAssetPipeline/1.0',
      Accept: 'image/*,*/*',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed ${response.status}: ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function saveWebp(buffer, relativePath, { width, height } = {}) {
  const absolute = join(root, relativePath);
  mkdirSync(dirname(absolute), { recursive: true });

  let pipeline = sharp(buffer).rotate();
  if (width || height) {
    pipeline = pipeline.resize({
      width,
      height,
      fit: 'cover',
      position: 'centre',
    });
  }

  await pipeline.webp({ quality: 82 }).toFile(absolute);
  console.log('saved', relativePath);
}

/** Licensed Unsplash photography for property cards (Unsplash License). */
const assets = [
  'photo-1502672260266-1c1ef2d93688',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1600607687939-ce8a6c25118c',
  'photo-1522708323590-d24dbb6b0267',
  'photo-1605276374104-dee2a0ed3cd6',
  'photo-1493809842364-78817add7ffb',
  'photo-1600566753190-17f0baa2a6c3',
  'photo-1600210492486-724fe5c67fb0',
  'photo-1497366216548-37526070297c',
  'photo-1600585154340-be6161a56a0c',
  'photo-1600596542815-ffad4c1539a9',
  'photo-1613490493576-7fde63acd811',
  'photo-1600585154526-990dced4db0d',
  'photo-1560185127-6ed189bf02f4',
  'photo-1512917774080-9991f1c4c750',
  'photo-1570129477492-45c003edd2be',
  'photo-1600607687644-c7171b42498f',
  'photo-1600566753086-00f18fb6b3ea',
  'photo-1484154218962-a197022b5858',
  'photo-1505693416388-ac5ce068fe85',
  'photo-1560448204-603b3fc33ddc',
  'photo-1600585152220-90363fe7e115',
  'photo-1449844908441-8829872d2607',
  'photo-1554995207-c18c203602cb',
].map((id, index) => ({
  urls: [
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`,
  ],
  path: `public/assets/properties/property-${String(index + 1).padStart(2, '0')}.webp`,
  width: 1200,
  height: 900,
}));

async function fetchFirst(urls) {
  let lastError;
  for (const url of urls) {
    try {
      return await download(url);
    } catch (error) {
      lastError = error;
      console.warn(String(error.message || error));
    }
  }
  throw lastError;
}

async function main() {
  const force = process.env.FORCE === '1';

  for (const asset of assets) {
    if (!force && existsSync(join(root, asset.path))) {
      console.log('skip existing (stable baseline)', asset.path);
      continue;
    }

    const buffer = await fetchFirst(asset.urls);
    await saveWebp(buffer, asset.path, {
      width: asset.width,
      height: asset.height,
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
