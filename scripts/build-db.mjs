// scripts/build-db.mjs — SQLite DB with full SEO fields
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const categories = read('categories.json');
const locations = read('locations.json');
const tags = read('tags.json');
const citations = read('citations.json');
const masters = read('masters.json').masters;
const services = fs.readdirSync(path.join(ROOT, 'data/services'))
  .filter(f => f.endsWith('.json'))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', f), 'utf8')));

const dbPath = path.join(ROOT, 'data', 'db.sqlite');
if (fs.existsSync(dbPath)) fs.rmSync(dbPath);
const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE categories (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, h1 TEXT,
  description TEXT,
  icon TEXT
);
CREATE TABLE services (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, name_gen TEXT,
  category_id INTEGER REFERENCES categories(id),
  price_min INTEGER, price_max INTEGER, unit TEXT, time TEXT,
  geo_priority INTEGER DEFAULT 0,
  tags TEXT, includes TEXT, steps TEXT, symptoms TEXT
);
-- SEO-индекс сгенерированных страниц (полная карта сайта в БД)
CREATE TABLE pages (
  id INTEGER PRIMARY KEY,
  url TEXT UNIQUE,
  type TEXT CHECK(type IN ('service','geo','location','category','tag','blog','static')),
  title TEXT, description TEXT, h1 TEXT, lead TEXT,
  service_slug TEXT, location_slug TEXT,
  price_min INTEGER, price_max INTEGER,
  faq_count INTEGER DEFAULT 0,
  citations_count INTEGER DEFAULT 0,
  body_chars INTEGER DEFAULT 0,
  jsonld_types TEXT,
  updated TEXT
);
CREATE TABLE locations (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT,
  pre TEXT,
  distance_km INTEGER, travel_fee INTEGER, zone TEXT,
  population INTEGER, lat REAL, lon REAL, facts TEXT
);
CREATE TABLE service_geo (
  service_id INTEGER REFERENCES services(id),
  location_id INTEGER REFERENCES locations(id)
);
CREATE TABLE tags (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, description TEXT);
CREATE TABLE masters (
  id INTEGER PRIMARY KEY, name TEXT, status TEXT, phone TEXT,
  whatsapp TEXT, telegram TEXT, rating REAL,
  jobs_done INTEGER, experience_years INTEGER,
  specialties TEXT, areas TEXT, bio TEXT
);
CREATE TABLE citations (id INTEGER PRIMARY KEY, key TEXT UNIQUE, title TEXT, url TEXT, fact TEXT);
CREATE INDEX idx_pages_type ON pages(type);
CREATE INDEX idx_pages_slugs ON pages(service_slug, location_slug);
CREATE INDEX idx_services_cat ON services(category_id);
`);

const insCat = db.prepare('INSERT INTO categories (slug,name,h1,description,icon) VALUES (?,?,?,?,?)');
for (const c of categories) insCat.run(c.slug, c.name, c.h1, c.description, c.icon ?? null);

const insSvc = db.prepare(`INSERT INTO services
  (slug,name,name_gen,category_id,price_min,price_max,unit,time,geo_priority,tags,includes,steps,symptoms)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
services.forEach((s) => {
  const catId = categories.findIndex(c => c.slug === s.category) + 1;
  insSvc.run(s.slug, s.name, s.name_gen, catId, s.price_min, s.price_max,
    s.unit, s.time, s.geo_priority ? 1 : 0, JSON.stringify(s.tags ?? []),
    JSON.stringify(s.includes ?? []), JSON.stringify(s.steps ?? []), JSON.stringify(s.symptoms ?? []));
});

const insLoc = db.prepare(`INSERT INTO locations
  (slug,name,pre,distance_km,travel_fee,zone,population,lat,lon,facts)
  VALUES (?,?,?,?,?,?,?,?,?,?)`);
locations.forEach((l) => {
  insLoc.run(l.slug, l.name, l.pre ?? l.name, l.distance_km, l.travel_fee, l.zone,
    l.population ?? null, l.coords?.[0] ?? null, l.coords?.[1] ?? null, JSON.stringify(l.facts ?? []));
});

const svcId = Object.fromEntries(services.map(s => [s.slug, services.indexOf(s) + 1]));
const locId = Object.fromEntries(locations.map((l, i) => [l.slug, i + 1]));
const insGeo = db.prepare('INSERT INTO service_geo VALUES (?,?)');
for (const s of services.filter(x => x.geo_priority))
  for (const l of locations.filter(x => x.slug !== 'cholpon-ata'))
    insGeo.run(svcId[s.slug], locId[l.slug]);

const insTag = db.prepare('INSERT INTO tags (slug,name,description) VALUES (?,?,?)');
for (const t of tags) insTag.run(t.slug, t.name, t.description);

const insM = db.prepare(`INSERT INTO masters
  (id,name,status,phone,whatsapp,telegram,rating,jobs_done,experience_years,specialties,areas,bio)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
for (const m of masters)
  insM.run(m.id, m.name, m.status, m.phone ?? '', m.whatsapp ?? '', m.telegram ?? '',
    m.rating ?? 0, m.jobs_done ?? 0, m.experience_years ?? 0,
    JSON.stringify(m.specialties ?? []), JSON.stringify(m.areas ?? []), m.bio ?? '');

const insC = db.prepare('INSERT INTO citations (key,title,url,fact) VALUES (?,?,?,?)');
for (const c of citations) insC.run(c.key, c.title, c.url, c.fact);

// ---- Индекс страниц из content/ (карта сайта в БД) ----
const contentDir = path.join(ROOT, 'content');
function* walkMd(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkMd(p);
    else if (e.name.endsWith('.md')) yield p;
  }
}
const parseFm = (src) => {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
  const raw = m ? m[1] : '';
  const scalar = (k) => new RegExp(`^${k}: "?([^"\n]*)"?`, 'm').exec(raw)?.[1] ?? '';
  return {
    type: scalar('type'), slug: scalar('slug'), title: scalar('title'),
    description: scalar('description'), h1: scalar('h1'), lead: scalar('lead'),
    updated: scalar('updated'),
    faqCount: (raw.match(/  - q:/g) || []).length,
    citeCount: (raw.match(/^  - "/gm) || []).length > 0 && /citations:/.test(raw)
      ? (new RegExp(`citations:\\n((?:  - ".*"\\n?)+)`).exec(raw)?.[1]?.match(/"/g)?.length ?? 0) / 2 : 0,
  };
};

const urlFor = (rel, fm) => {
  if (rel.startsWith('services/')) {
    const [, , svc] = rel.replace('.md', '').split('/');
    const cat = rel.split('/')[1];
    return `/uslugi/${cat}/${svc}/`;
  }
  if (rel.startsWith('geo/')) return '/' + rel.slice(4).replace('.md', '') + '/';
  if (rel.startsWith('locations/')) return '/lokacii/' + rel.slice(10).replace('.md', '') + '/';
  if (rel.startsWith('categories/')) return '/uslugi/' + rel.slice(11).replace('.md', '') + '/';
  if (rel.startsWith('tags/')) return '/tagi/' + rel.slice(5).replace('.md', '') + '/';
  if (rel.startsWith('blog/')) return '/blog/' + rel.slice(5).replace('.md', '') + '/';
  return '/';
};

const insPage = db.prepare(`INSERT OR REPLACE INTO pages
  (url,type,title,description,h1,lead,service_slug,location_slug,price_min,price_max,faq_count,citations_count,body_chars,jsonld_types,updated)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

let pageCount = 0;
for (const file of walkMd(contentDir)) {
  const rel = path.relative(contentDir, file);
  if (rel.includes('INDEX.md')) continue;
  const src = fs.readFileSync(file, 'utf8');
  const fm = parseFm(src);
  const bodyChars = src.length;
  const types = ['Service', 'FAQPage', 'BreadcrumbList'];
  if (fm.type === 'service') types.push('HowTo', 'Review', 'AggregateRating');
  if (fm.type === 'location') types.push('LocalBusiness', 'GeoCoordinates');
  if (fm.type === 'blog') types.splice(0, 3, 'BlogPosting');

  let svcSlug = null, locSlug = null;
  if (fm.type === 'service') svcSlug = fm.slug;
  if (fm.type === 'geo') {
    const parts = fm.slug.split('-v-');
    // восстановить service slug (до последнего -v-) и локацию
    svcSlug = parts.slice(0, -1).join('-v-');
    locSlug = parts.at(-1);
  }

  insPage.run(urlFor(rel, fm), fm.type, fm.title, fm.description, fm.h1, fm.lead,
    svcSlug, locSlug, null, null, fm.faqCount, fm.citeCount, bodyChars,
    types.join(','), fm.updated);
  pageCount++;
}

db.exec(`UPDATE pages SET
  price_min = (SELECT s.price_min FROM services s WHERE pages.service_slug = s.slug),
  price_max = (SELECT s.price_max FROM services s WHERE pages.service_slug = s.slug)
  WHERE service_slug IS NOT NULL`);

const counts = {};
for (const t of ['categories', 'services', 'locations', 'service_geo', 'tags', 'masters', 'citations', 'pages'])
  counts[t] = db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n;

console.log('DB built:', dbPath);
console.log(JSON.stringify(counts));
process.exit(0);
