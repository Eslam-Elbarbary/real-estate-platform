import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

function svg({ w, h, c1, c2, label }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="${w * 0.08}" y="${h * 0.55}" width="${w * 0.84}" height="${h * 0.28}" rx="18" fill="rgba(255,255,255,0.18)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.22}" r="${Math.min(w, h) * 0.08}" fill="rgba(255,255,255,0.22)"/>
  <text x="50%" y="48%" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-family="Segoe UI, Tahoma, sans-serif" font-size="${Math.round(Math.min(w, h) * 0.045)}" font-weight="700">${label}</text>
</svg>`;
}

const files = [
  ['public/images/home/hero.svg', { w: 1600, h: 700, c1: '#1b4f72', c2: '#5dade2', label: 'عقارات مصر' }],
  ['public/images/home/ai-valuation.svg', { w: 640, h: 480, c1: '#0e6655', c2: '#48c9b0', label: 'تقييم ذكي' }],
  ['public/images/home/app-promo.svg', { w: 800, h: 700, c1: '#1a5276', c2: '#85c1e9', label: 'التطبيق' }],
  ['public/images/compounds/orchid-park.svg', { w: 900, h: 1200, c1: '#145a32', c2: '#58d68d', label: 'أوركيد بارك' }],
  ['public/images/compounds/palm-valley.svg', { w: 900, h: 1200, c1: '#7d3c98', c2: '#d7bde2', label: 'بالم فالي' }],
  ['public/images/compounds/eastwood-residence.svg', { w: 900, h: 1200, c1: '#1f618d', c2: '#7fb3d5', label: 'إيستوود' }],
  ['public/images/compounds/rivera-heights.svg', { w: 900, h: 1200, c1: '#922b21', c2: '#f5b7b1', label: 'ريفيرا' }],
  ['public/images/compounds/sunset-gardens.svg', { w: 900, h: 1200, c1: '#b9770e', c2: '#f9e79f', label: 'صن ست' }],
  ['public/images/locations/cairo.svg', { w: 800, h: 1000, c1: '#154360', c2: '#5dade2', label: 'القاهرة' }],
  ['public/images/locations/giza.svg', { w: 800, h: 1000, c1: '#196f3d', c2: '#82e0aa', label: 'الجيزة' }],
  ['public/images/locations/new-cairo.svg', { w: 800, h: 1000, c1: '#1a5276', c2: '#85c1e9', label: 'القاهرة الجديدة' }],
  ['public/images/locations/sheikh-zayed.svg', { w: 800, h: 1000, c1: '#6c3483', c2: '#bb8fce', label: 'الشيخ زايد' }],
  ['public/images/locations/fifth-settlement.svg', { w: 800, h: 1000, c1: '#922b21', c2: '#f1948a', label: 'التجمع الخامس' }],
  ['public/images/locations/madinaty.svg', { w: 800, h: 1000, c1: '#9a7d0a', c2: '#f7dc6f', label: 'مدينتي' }],
];

for (const [path, opts] of files) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg(opts), 'utf8');
  console.log('wrote', path);
}
