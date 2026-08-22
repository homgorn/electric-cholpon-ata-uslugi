#!/usr/bin/env node
// Сборка SQLite БД из data/*.json — единая база для экспорта в другие сервисы.
// Запуск: npm run db (node --experimental-sqlite)
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
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', f), 'utf8')));

const dbPath = path.join(ROOT, 'data', 'db.sqlite');
if (fs.existsSync(dbPath)) fs.rmSync(dbPath);
const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE categories (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, h1 TEXT, description TEXT);
CREATE TABLE services (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, name_gen TEXT,
  category_id INTEGER REFERENCES categories(id), price_min INTEGER, price_max INTEGER,
  unit TEXT, time TEXT, geo_priority INTEGER, tags TEXT, includes TEXT, steps TEXT, symptoms TEXT);
CREATE TABLE locations (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, distance_km INTEGER,
  travel_fee INTEGER, zone TEXT, population INTEGER, lat REAL, lon REAL, facts TEXT);
CREATE TABLE service_geo (service_id INTEGER REFERENCES services(id), location_id INTEGER REFERENCES locations(id));
CREATE TABLE tags (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, description TEXT);
CREATE TABLE masters (id INTEGER PRIMARY KEY, name TEXT, status TEXT, phone TEXT, whatsapp TEXT,
  telegram TEXT, rating REAL, specialties TEXT, areas TEXT, bio TEXT);
CREATE TABLE citations (id INTEGER PRIMARY KEY, key TEXT UNIQUE, title TEXT, url TEXT, fact TEXT);
`);

const insCat = db.prepare('INSERT INTO categories (slug,name,h1,description) VALUES (?,?,?,?)');
for (const c of categories) insCat.run(c.slug, c.name, c.h1, c.description);
const catId = Object.fromEntries(categories.map((c, i) => [c.slug, i + 1]));

const insSvc = db.prepare('INSERT INTO services (slug,name,name_gen,category_id,price_min,price_max,unit,time,geo_priority,tags,includes,steps,symptoms) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
services.forEach((s, i) => {
  insSvc.run(s.slug, s.name, s.name_gen, catId[s.category], s.price_min, s.price_max,
    s.unit, s.time, s.geo_priority ? 1 : 0, JSON.stringify(s.tags),
    JSON.stringify(s.includes), JSON.stringify(s.steps), JSON.stringify(s.symptoms));
});

const insLoc = db.prepare('INSERT INTO locations (slug,name,distance_km,travel_fee,zone,population,lat,lon,facts) VALUES (?,?,?,?,?,?,?,?,?)');
locations.forEach((l, i) => {
  insLoc.run(l.slug, l.name, l.distance_km, l.travel_fee, l.zone, l.population ?? null, l.coords?.[0] ?? null, l.coords?.[1] ?? null, JSON.stringify(l.facts));
});

const insGeo = db.prepare('INSERT INTO service_geo VALUES (?,?)');
const svcId = Object.fromEntries(services.map((s, i) => [s.slug, i + 1]));
const locId = Object.fromEntries(locations.map((l, i) => [l.slug, i + 1]));
for (const s of services.filter(x => x.geo_priority))
  for (const l of locations.filter(x => x.slug !== 'cholpon-ata'))
    insGeo.run(svcId[s.slug], locId[l.slug]);

const insTag = db.prepare('INSERT INTO tags (slug,name,description) VALUES (?,?,?)');
for (const t of tags) insTag.run(t.slug, t.name, t.description);

const insM = db.prepare('INSERT INTO masters (id,name,status,phone,whatsapp,telegram,rating,specialties,areas,bio) VALUES (?,?,?,?,?,?,?,?,?,?)');
for (const m of masters) insM.run(m.id, m.name, m.status, m.phone ?? '', m.whatsapp ?? '', m.telegram ?? '', m.rating ?? 0, JSON.stringify(m.specialties), JSON.stringify(m.areas), m.bio ?? '');

const insC = db.prepare('INSERT INTO citations (key,title,url,fact) VALUES (?,?,?,?)');
for (const c of citations) insC.run(c.key, c.title, c.url, c.fact);

const counts = {};
for (const t of ['categories', 'services', 'locations', 'service_geo', 'tags', 'masters', 'citations'])
  counts[t] = db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n;
console.log('DB built:', dbPath, JSON.stringify(counts));
process.exit(0);
