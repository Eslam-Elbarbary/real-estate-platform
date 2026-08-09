import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'public/assets/home/know');
mkdirSync(dir, { recursive: true });

const palette = {
  blue: '#0277BD',
  blueSoft: '#E1F2FB',
  orange: '#F9A825',
  ink: '#424242',
  surface: '#F5F5F5',
  white: '#FFFFFF',
};

function frame(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280" fill="none">
  <rect width="280" height="280" fill="${palette.surface}"/>
  ${inner}
</svg>`;
}

const illustrations = {
  'neighborhoods.svg': frame(`
    <circle cx="140" cy="150" r="70" fill="${palette.blueSoft}"/>
    <path d="M90 170 L140 110 L190 170 V200 H90 Z" fill="${palette.blue}"/>
    <rect x="125" y="155" width="30" height="45" rx="4" fill="${palette.white}"/>
    <circle cx="200" cy="95" r="18" fill="${palette.orange}"/>
    <path d="M200 82 v26 M187 95 h26" stroke="${palette.white}" stroke-width="4" stroke-linecap="round"/>
  `),
  'prices.svg': frame(`
    <rect x="70" y="70" width="140" height="140" rx="16" fill="${palette.blueSoft}"/>
    <path d="M95 175 L125 140 L155 155 L185 105" stroke="${palette.blue}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="185" cy="105" r="10" fill="${palette.orange}"/>
    <rect x="95" y="185" width="90" height="10" rx="5" fill="${palette.blue}" opacity="0.35"/>
  `),
  'experts.svg': frame(`
    <circle cx="115" cy="120" r="28" fill="${palette.blue}"/>
    <circle cx="165" cy="120" r="28" fill="${palette.orange}"/>
    <path d="M70 195c10-35 35-50 70-50s60 15 70 50" fill="${palette.blueSoft}"/>
    <circle cx="140" cy="95" r="10" fill="${palette.white}"/>
  `),
  'compounds.svg': frame(`
    <rect x="70" y="100" width="50" height="100" rx="6" fill="${palette.blue}"/>
    <rect x="128" y="80" width="55" height="120" rx="6" fill="${palette.blue}" opacity="0.85"/>
    <rect x="191" y="115" width="40" height="85" rx="6" fill="${palette.orange}"/>
    <rect x="82" y="115" width="12" height="12" fill="${palette.white}" opacity="0.9"/>
    <rect x="102" y="115" width="12" height="12" fill="${palette.white}" opacity="0.9"/>
    <rect x="82" y="140" width="12" height="12" fill="${palette.white}" opacity="0.9"/>
    <rect x="140" y="95" width="12" height="12" fill="${palette.white}" opacity="0.9"/>
    <rect x="160" y="95" width="12" height="12" fill="${palette.white}" opacity="0.9"/>
  `),
  'guides.svg': frame(`
    <rect x="85" y="65" width="110" height="150" rx="12" fill="${palette.blueSoft}"/>
    <rect x="100" y="90" width="80" height="10" rx="5" fill="${palette.blue}"/>
    <rect x="100" y="115" width="70" height="8" rx="4" fill="${palette.blue}" opacity="0.45"/>
    <rect x="100" y="135" width="75" height="8" rx="4" fill="${palette.blue}" opacity="0.45"/>
    <rect x="100" y="155" width="55" height="8" rx="4" fill="${palette.blue}" opacity="0.45"/>
    <circle cx="185" cy="195" r="22" fill="${palette.orange}"/>
    <path d="M177 195h16 M185 187v16" stroke="${palette.white}" stroke-width="3.5" stroke-linecap="round"/>
  `),
  'faq.svg': frame(`
    <circle cx="140" cy="140" r="72" fill="${palette.blueSoft}"/>
    <circle cx="140" cy="140" r="48" fill="${palette.white}"/>
    <text x="140" y="158" text-anchor="middle" font-size="56" font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="${palette.blue}">؟</text>
    <circle cx="200" cy="88" r="16" fill="${palette.orange}"/>
  `),
};

for (const [name, svg] of Object.entries(illustrations)) {
  writeFileSync(join(dir, name), svg, 'utf8');
  console.log('wrote', name);
}
