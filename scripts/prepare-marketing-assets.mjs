import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const out = 'public/assets/marketing-services';
mkdirSync(path.join(out, 'avatars'), { recursive: true });
mkdirSync(path.join(out, 'partners'), { recursive: true });

async function copyWebp(src, dest, w, h) {
  await sharp(src)
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log('wrote', dest);
}

const base = 'public/assets';

await copyWebp(`${base}/home/areas/new-cairo.webp`, `${out}/hero.webp`, 1400, 900);
await copyWebp(`${base}/home/know/experts.webp`, `${out}/service-01.webp`, 1200, 675);
await copyWebp(`${base}/valuation/wizard-hero.webp`, `${out}/service-02.webp`, 1200, 675);
await copyWebp(`${base}/home/know/guides.webp`, `${out}/service-03.webp`, 1200, 675);
await copyWebp(`${base}/home/know/compounds.webp`, `${out}/service-04.webp`, 1200, 675);
await copyWebp(`${base}/home/compounds/compound-01.webp`, `${out}/service-05.webp`, 1200, 675);
await copyWebp(`${base}/auth/auth-lifestyle.webp`, `${out}/service-06.webp`, 1200, 675);
await copyWebp(`${base}/home/know/prices.webp`, `${out}/service-07.webp`, 1200, 675);
await copyWebp(`${base}/home/know/neighborhoods.webp`, `${out}/service-08.webp`, 1200, 675);
await copyWebp(`${base}/home/know/faq.webp`, `${out}/service-09.webp`, 1200, 675);
await copyWebp(`${base}/home/app/phones.webp`, `${out}/video-poster.webp`, 1200, 675);
await copyWebp(`${base}/properties/property-01.webp`, `${out}/avatars/a1.webp`, 160, 160);
await copyWebp(`${base}/properties/property-05.webp`, `${out}/avatars/a2.webp`, 160, 160);
await copyWebp(`${base}/properties/property-09.webp`, `${out}/avatars/a3.webp`, 160, 160);

const partners = [
  ['northstar', 'نورث ستار'],
  ['orbit', 'أوربت'],
  ['horizon', 'هورايزون'],
  ['crest', 'كريست'],
  ['atlas', 'أطلس'],
  ['vertex', 'فيرتكس'],
  ['lumen', 'لومن'],
  ['prime', 'برايم'],
  ['nova', 'نوفا'],
  ['ridge', 'ريدج'],
  ['summit', 'سامت'],
  ['harbor', 'هاربر'],
  ['cedar', 'سيدار'],
  ['folio', 'فوليو'],
  ['canvas', 'كانفس'],
  ['bridge', 'بريدج'],
  ['pulse', 'بولس'],
  ['quartz', 'كوارتز'],
];

for (const [id, label] of partners) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="80" viewBox="0 0 220 80">
  <rect width="220" height="80" fill="#ffffff"/>
  <rect x="8" y="18" width="204" height="44" rx="6" fill="none" stroke="#9e9e9e" stroke-width="1.5"/>
  <text x="110" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#616161">${label}</text>
</svg>`;
  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(`${out}/partners/${id}.webp`);
}

console.log('partners done');
