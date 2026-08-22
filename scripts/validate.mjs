#!/usr/bin/env node
// QA-гейт: проверяет конституцию качества на всех страницах.
// Выход != 0 при нарушениях → build падает, деплой блокируется.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const postbuild = process.argv.includes('--postbuild');
const errors = [];
const warnings = [];
let pages = 0;

function parseFm(src) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
  if (!m) return { fm: {}, body: src };
  const raw = m[1];
  const fm = {};
  const scalar = (k) => new RegExp(`^${k}: "(.*)"`, 'm').exec(raw)?.[1] ?? '';
  for (const k of ['title', 'description', 'h1', 'lead', 'type', 'slug', 'category', 'category_name', 'date', 'keyword', 'updated', 'unit', 'time'])
    fm[k] = scalar(k);
  for (const k of ['price_min', 'price_max', 'distance_km', 'travel_fee']) fm[k] = Number(scalar(k)) || undefined;
  for (const k of ['tags', 'citations', 'services']) {
    const block = new RegExp(`^${k}:\\n((?:  - ".*"\\n?)*)`, 'm').exec(raw)?.[1] ?? '';
    fm[k] = [...block.matchAll(/  - "(.*)"/g)].map(x => x[1]);
  }
  fm.faq = [...raw.matchAll(/  - q: "([^"]+)"\n\s*a: "([^"]+)"/g)].map(x => ({ q: x[1], a: x[2] }));
  return { fm, body: src.slice(m[0].length) };
}

function checkFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const { fm, body } = parseFm(src);
  pages++;
  const rel = path.relative(ROOT, file);

  // Конституция #4: ≥3000 символов тела для услуг и гео
  if ((fm.type === 'service' || fm.type === 'geo') && body.length < 3000)
    errors.push(`${rel}: тело ${body.length} < 3000 символов`);

  // Конституция #1: ответ с цифрой в первых 100 символах лида
  const landing = ['service', 'geo', 'location'].includes(fm.type);
  if (landing) {
    if (!fm.lead) errors.push(`${rel}: нет lead`);
    else {
      const first100 = String(fm.lead).slice(0, 100);
      if (!/\d{2,}/.test(first100)) errors.push(`${rel}: в первых 100 символах лида нет цифры`);
    }
  }

  // Title ≤65 + ключ
  if (!fm.title) errors.push(`${rel}: нет title`);
  else {
    if (fm.title.length > 70) warnings.push(`${rel}: title ${fm.title.length} симв (>70)`);
    if (fm.title.length < 25) warnings.push(`${rel}: title слишком короткий`);
  }
  if (!fm.description) errors.push(`${rel}: нет description`);
  else if (fm.description.length < 80 || fm.description.length > 175)
    warnings.push(`${rel}: description ${String(fm.description).length} симв`);

  // FAQ ≥3 для услуг
  if ((fm.type === 'service' || fm.type === 'geo') && (!Array.isArray(fm.faq) || fm.faq.length < 3))
    errors.push(`${rel}: FAQ < 3 вопросов`);

  // Цитаты ≥2 для услуг
  if ((fm.type === 'service' || fm.type === 'geo') && (!Array.isArray(fm.citations) || fm.citations.length < 2))
    errors.push(`${rel}: цитат < 2`);

  // H1 присутствует в теле
  if (!body.includes('# ') && !fm.h1) errors.push(`${rel}: нет H1`);

  // CTA WhatsApp на лендингах
  if (['service', 'geo', 'location', 'category'].includes(fm.type) && !body.includes('wa.me'))
    errors.push(`${rel}: нет CTA WhatsApp`);
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) checkFile(p);
  }
}
walk(path.join(ROOT, 'content'));

// Дубликаты title
const titles = new Map();
for (const e of fs.readdirSync(path.join(ROOT, 'content'), { withFileTypes: true })) {
  void e;
}
function collectTitles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectTitles(p);
    else if (e.name.endsWith('.md')) {
      const t = /title: "(.+)"/.exec(fs.readFileSync(p, 'utf8'))?.[1];
      if (t) titles.set(t, (titles.get(t) ?? 0) + 1);
    }
  }
}
collectTitles(path.join(ROOT, 'content'));
for (const [t, n] of titles) if (n > 1) errors.push(`Дубликат title (${n}x): ${t}`);

// Post-build проверки
if (postbuild) {
  const dist = path.join(ROOT, 'dist');
  if (fs.existsSync(dist)) {
    for (const f of ['robots.txt', 'llms.txt', 'llms-full.txt']) {
      if (!fs.existsSync(path.join(dist, f))) errors.push(`dist/${f} отсутствует`);
    }
    if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) errors.push('dist/sitemap-index.xml отсутствует');
  } else warnings.push('dist/ не найден — пропускаю postbuild-проверки');
}

console.log(`\n=== VALIDATION ===\nPages checked: ${pages}`);
if (warnings.length) console.log(`Warnings (${warnings.length}):\n` + warnings.slice(0, 20).map(w => `  ⚠ ${w}`).join('\n'));
if (errors.length) {
  console.error(`ERRORS (${errors.length}):\n` + errors.slice(0, 40).map(e => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log('All checks passed ✓');
process.exit(0);
