#!/usr/bin/env node
// Экспорт базы для внешних сервисов: CSV (Excel-ready) + JSON bundle.
// Запуск: npm run export → exports/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const site = read('site.json');
const categories = read('categories.json');
const locations = read('locations.json');
const tags = read('tags.json');
const citations = read('citations.json');
const services = fs.readdirSync(path.join(ROOT, 'data/services')).filter(f => f.endsWith('.json'))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', f), 'utf8')));

const OUT = path.join(ROOT, 'exports');
fs.mkdirSync(OUT, { recursive: true });

const csvEsc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
function writeCsv(name, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = '\uFEFF' + [headers.join(';'), ...rows.map(r => headers.map(h => csvEsc(r[h])).join(';'))].join('\n');
  fs.writeFileSync(path.join(OUT, name), csv);
}

writeCsv('services.csv', services.map(s => ({
  slug: s.slug, name: s.name, category: s.category,
  price_min_kgs: s.price_min, price_max_kgs: s.price_max, unit: s.unit, time: s.time,
  geo_priority: s.geo_priority ? 'yes' : 'no', tags: s.tags.join('|'),
  url: `${site.url}/uslugi/${s.category}/${s.slug}/`,
})));

writeCsv('service_geo_pages.csv', services.filter(s => s.geo_priority)
  .flatMap(s => locations.filter(l => l.slug !== 'cholpon-ata')
    .map(l => ({
      url: `${site.url}/${s.slug}-v-${l.slug}/`,
      service: s.name, location: l.name, distance_km: l.distance_km,
      travel_fee_kgs: l.travel_fee, price_min_kgs: s.price_min, price_max_kgs: s.price_max,
    }))));

writeCsv('locations.csv', locations.map(l => ({
  slug: l.slug, name: l.name, distance_km: l.distance_km,
  travel_fee_kgs: l.travel_fee, zone: l.zone, population: l.population ?? '',
  lat: l.coords?.[0] ?? '', lon: l.coords?.[1] ?? '',
  url: `${site.url}/lokacii/${l.slug}/`,
})));

writeCsv('citations.csv', citations.map(c => ({ key: c.key, title: c.title, url: c.url, fact: c.fact })));
writeCsv('tags.csv', tags.map(t => ({ slug: t.slug, name: t.name, description: t.description })));

fs.writeFileSync(path.join(OUT, 'bundle.json'), JSON.stringify({
  exported_at: new Date().toISOString(), source_url: site.url,
  contacts: { whatsapp: site.whatsapp, telegram: site.telegram },
  categories, locations, tags, citations, services,
}, null, 2));

console.log('Exported to exports/:', fs.readdirSync(OUT).join(', '));
process.exit(0);
