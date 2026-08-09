import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import QRCode from 'qrcode';

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

/** Licensed Unsplash photographs downloaded locally (Unsplash License). */
const assets = [
  {
    // Family / residential home scene (Unsplash License) — not commercial towers.
    urls: [
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=2400&q=80',
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=2400&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80',
    ],
    path: 'public/assets/home/hero/hero.webp',
    width: 1920,
    height: 860,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    ],
    path: 'public/assets/home/compounds/compound-01.webp',
    width: 900,
    height: 1200,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    ],
    path: 'public/assets/home/compounds/compound-02.webp',
    width: 900,
    height: 1200,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    ],
    path: 'public/assets/home/compounds/compound-03.webp',
    width: 900,
    height: 1200,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    ],
    path: 'public/assets/home/compounds/compound-04.webp',
    width: 900,
    height: 1200,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80',
    ],
    path: 'public/assets/home/compounds/compound-05.webp',
    width: 900,
    height: 1200,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/cairo.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66a52daf6a?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/alexandria.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/new-cairo.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/october.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/sheikh-zayed.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/north-coast.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/areas/ain-sokhna.webp',
    width: 800,
    height: 1100,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/neighborhoods.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/prices.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/experts.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/compounds.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/guides.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
    ],
    path: 'public/assets/home/know/faq.webp',
    width: 640,
    height: 640,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    ],
    path: 'public/assets/home/know/ai-phone.webp',
    width: 720,
    height: 900,
  },
  {
    urls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1600&q=80',
    ],
    path: 'public/assets/home/app/phones.webp',
    width: 1400,
    height: 1100,
  },
];

async function writeStoreBadges() {
  const googlePlay = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="646" height="250" viewBox="0 0 646 250" role="img" aria-label="Get it on Google Play">
  <rect width="646" height="250" rx="40" fill="#000"/>
  <path fill="#EA4335" d="M95 55l70 70-70 70V55z"/>
  <path fill="#FBBC04" d="M95 195l45-25 25-25-70-70v120z"/>
  <path fill="#4285F4" d="M205 125l-40 22-25-22 25-22 40 22z"/>
  <path fill="#34A853" d="M95 55l70 70-25 22-45-25V55z"/>
  <g fill="#fff" font-family="Arial, Helvetica, sans-serif">
    <text x="250" y="100" font-size="32">GET IT ON</text>
    <text x="250" y="160" font-size="52" font-weight="700">Google Play</text>
  </g>
</svg>`;

  const appStore = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="646" height="250" viewBox="0 0 646 250" role="img" aria-label="Download on the App Store">
  <rect width="646" height="250" rx="40" fill="#000"/>
  <path fill="#fff" d="M145 70c7-9 19-16 29-16 1 12-3 24-10 32-7 9-18 15-29 14-1-11 4-23 10-30zm10 40c15-1 26 8 35 8s17-8 34-8c6 0 21 1 31 15-28 15-24 55 5 68-7 16-15 31-28 42-11 10-24 22-42 21-17-1-23-11-43-11s-26 11-43 11c-18 0-31-13-42-23-23-20-41-57-34-92 8-38 42-58 72-58 17 0 34 12 43 12s27-15 46-12c-2 1-8 4-14 7z"/>
  <g fill="#fff" font-family="Arial, Helvetica, sans-serif">
    <text x="250" y="100" font-size="28">Download on the</text>
    <text x="250" y="160" font-size="52" font-weight="700">App Store</text>
  </g>
</svg>`;

  const googlePath = join(root, 'public/assets/home/app/google-play.svg');
  const applePath = join(root, 'public/assets/home/app/app-store.svg');
  mkdirSync(dirname(googlePath), { recursive: true });
  writeFileSync(googlePath, googlePlay, 'utf8');
  writeFileSync(applePath, appStore, 'utf8');
  console.log('saved store badges');
}

async function writeQr() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const path = join(root, 'public/assets/home/app/qr.webp');
  mkdirSync(dirname(path), { recursive: true });
  const png = await QRCode.toBuffer(siteUrl, {
    type: 'png',
    width: 512,
    margin: 2,
    color: { dark: '#121212', light: '#ffffff' },
  });
  await sharp(png).webp({ quality: 90 }).toFile(path);
  console.log('saved QR for', siteUrl);
}

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
  // Committed assets are the visual source of truth.
  // Only overwrite when FORCE=1 is explicitly set.
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

  await writeStoreBadges();
  await writeQr();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
