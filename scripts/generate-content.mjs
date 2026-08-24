#!/usr/bin/env node
// Генератор контента: data/*.json → content/**/*.md (+ копии в public/md/**)
// Детерминированный: seed = hash(slug). Отчёт: outputs/YYYY-MM-DD/generate-report.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LEAD_TEMPLATES, PRICE_INTRO, WHY_US_POOL, REGION_BLOCKS, GUARANTEE_PARAS,
  SAFETY_PARA, FAQ_VARIANTS, CTA_TEXTS, ETA_BY_ZONE, BISHKEK_MIN_BY_CATEGORY,
} from './pools.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const site = DATA('site.json');
const categories = DATA('categories.json');
const locations = DATA('locations.json');
const tags = DATA('tags.json');
const citations = Object.fromEntries(DATA('citations.json').map(c => [c.key, c]));
const services = fs.readdirSync(path.join(ROOT, 'data/services'))
  .filter(f => f.endsWith(".json"))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', f), 'utf8')));
const bySlug = Object.fromEntries(services.map(s => [s.slug, s]));
const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
const locBySlug = Object.fromEntries(locations.map(l => [l.slug, l]));
const GEO_SERVICES = services.filter(s => s.geo_priority);
const locPre = (l) => l.pre ?? l.name;
const unitAcc = (u) => ({ 'точка': 'точку', 'камера': 'камеру', 'контур': 'контур' })[u] ?? u;
const GEO_LOCATIONS = locations.filter(l => l.slug !== 'cholpon-ata');

// ---------- utils ----------
const hash = (str) => { let h = 1779033703; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; };
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
const pickN = (arr, n, r) => { const a = [...arr]; const out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; };
const fmt = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const today = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(ROOT, 'outputs', today);
fs.mkdirSync(OUT_DIR, { recursive: true });

const waLink = (service) => `${site.whatsapp}?text=${encodeURIComponent(fmt(site.cta_whatsapp_template, { service, site: site.url.replace('https://','') }))}`;
const tgLink = site.telegram;
const ctaBlock = (serviceName, r) => {
  const text = pick(CTA_TEXTS, r);
  return `\n> **${text}**\n>\n> [💬 WhatsApp с фото](${waLink(serviceName)}) · [✈️ Telegram](${tgLink})\n`;
};
const citationsBlock = (keys) => keys.map(k => citations[k]).filter(Boolean);
const citeList = (keys) => '\n## Источники\n\n' + citationsBlock(keys)
  .map(c => `- [${c.title}](${c.url}) — ${c.fact}`).join('\n') + '\n';

function faqFor(service, loc) {
  const isCity = !loc || loc.slug === 'cholpon-ata';
  const L = loc ?? locBySlug['cholpon-ata'];
  const v = {
    name_gen: service.name_gen, loc: locPre(L), min: service.price_min, max: service.price_max,
    unit: unitAcc(service.unit), dist: L.distance_km, fee: L.travel_fee,
    eta_city: site.eta_city, fee_part: L.travel_fee ? `выезд ${L.travel_fee} сом, ` : '',
  };
  const r = rng(hash(service.slug + (loc?.slug ?? '')));
  const q1 = fmt(pick(FAQ_VARIANTS.price_q, r), v), a1 = fmt(pick(FAQ_VARIANTS.price_a, r), v);
  const q2 = fmt(pick(FAQ_VARIANTS.eta_q, r), v), a2 = fmt(pick(FAQ_VARIANTS.eta_a, r), v);
  const q3 = fmt(pick(FAQ_VARIANTS.warranty_q, r), v), a3 = fmt(pick(FAQ_VARIANTS.warranty_a, r), v);
  const q4 = fmt(pick(FAQ_VARIANTS.urgent_q, r), v), a4 = fmt(pick(FAQ_VARIANTS.urgent_a, r), v);
  const q5 = fmt(pick(FAQ_VARIANTS.pay_q, r), v), a5 = fmt(pick(FAQ_VARIANTS.pay_a, r), v);
  const faq = [
    { q: q1, a: a1 }, { q: q2, a: isCity ? `По городу приезжаем ${site.eta_city}. Работаем ${site.work_hours.toLowerCase()}.` : a2 },
    { q: q3, a: a3 }, { q: q4, a: a4 }, { q: q5, a: a5 },
  ];
  if (!isCity) faq[1] = { q: q2, a: a2 };
  return faq;
}

const priceTable = (service, extraRows = []) =>
  '| Параметр | Значение |\n|---|---|\n'
  + `| Цена за ${service.unit} | **от ${service.price_min} до ${service.price_max} сом** |\n`
  + `| Время работы | ${service.time} |\n`
  + `| Гарантия | 1 месяц |\n`
  + extraRows.map(x => `| ${x[0]} | ${x[1]} |\n`).join('');

const travelNote = (loc) => loc && loc.slug !== 'cholpon-ata'
  ? `\nВыезд в ${locPre(loc)}: ${loc.distance_km} км от Чолпон-Аты, надбавка за дорогу — **${loc.travel_fee} сом** к итоговому чеку.\n` : '';

function relatedLinks(service, loc) {
  const sameCat = services.filter(s => s.category === service.category && s.slug !== service.slug).slice(0, 4);
  const links = sameCat.map(s => `[${s.name}](/uslugi/${s.category}/${s.slug}/)`).join(' · ');
  let geoLinks = '';
  if (loc) {
    const idx = GEO_LOCATIONS.findIndex(l => l.slug === loc.slug);
    const neighbors = [GEO_LOCATIONS[(idx - 1 + GEO_LOCATIONS.length) % GEO_LOCATIONS.length], GEO_LOCATIONS[(idx + 1) % GEO_LOCATIONS.length]];
    geoLinks = neighbors.map(l => `[${service.name} в ${l.name}](/${service.slug}-v-${l.slug}/)`).join(' · ');
  }
  return links + (geoLinks ? `\n\nРядом: ${geoLinks}` : '');
}

// ---------- page builders ----------
function buildServicePage(service) {
  const r = rng(hash('svc:' + service.slug));
  const cat = catBySlug[service.category];
  const city = locBySlug['cholpon-ata'];
  const eta = ETA_BY_ZONE.city;
  const lead = fmt(pick(LEAD_TEMPLATES, r), {
    Service: service.name, name_gen: service.name_gen, loc: 'Чолпон-Ате',
    min: service.price_min, max: service.price_max, unit: unitAcc(service.unit),
    time: service.time, eta, fee_part: '',
  });
  const priceIntro = fmt(pick(PRICE_INTRO, r), {
    bishkek_min: BISHKEK_MIN_BY_CATEGORY[service.category] ?? 200,
    url: citations['repair-com-kg'].url,
  });
  const why = pickN(WHY_US_POOL, 5, r).map(w => `- ${w}`).join('\n');
  const region = pick(REGION_BLOCKS, r);
  const guarantee = pick(GUARANTEE_PARAS, r);
  const safety = pick(SAFETY_PARA, r);
  const faq = faqFor(service, null);
  const citeKeys = ['repair-com-kg', 'eco-service-kg', 'pue', 'electrician-kg'].filter(k => citations[k]);
  const villageTable = '| Выезд в сёла | Надбавка |\n|---|---|\n| До 20 км (Бостери, Тамчы…) | 200–300 сом |\n| 21–50 км (Ананьево, Григорьевка…) | 400–500 сом |\n| 50–90 км (Балыкчы, Ак-Суу…) | 600–800 сом |';

  const body = `${lead}

## Сколько стоит ${service.name_gen} в Чолпон-Ате

${priceIntro}

${priceTable(service)}

${villageTable}
${travelNote(null)}
## Что входит в работу

${service.includes.map(i => `- ${i}`).join('\n')}
- Уборка рабочего места и вынос мусора

## Как проходит работа

${service.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
${service.steps.length < 5 ? `${service.steps.length + 1}. Финальная проверка под нагрузкой и подпись в акте выполненных работ.` : ''}

## Когда нужно вызывать мастера

${service.symptoms.map(s => `- ${s}`).join('\n')}

Не ждите, пока искрение превратится в короткое замыкание: ${service.name.toLowerCase()} стоит дешевле, чем ремонт после пожара.

## Почему выбирают нас в ${site.city}

${why}

${guarantee}

## ${region.title}

${region.paras.join('\n\n')}

${safety}

## Частые вопросы о ${service.name_gen}

${faq.map(f => `### ${f.q}\n\n${f.a}\n`).join('\n')}

${citeKeys.length ? citeList(citeKeys) : ''}
${ctaBlock(`${service.name} в Чолпон-Ате`, r)}

Смотрите также: ${relatedLinks(service, null)}
`;

  const fm = {
    title: `${service.name} в Чолпон-Ате — цена от ${service.price_min} сом`,
    description: `${service.name} в Чолпон-Ате: от ${service.price_min} до ${service.price_max} сом за ${service.unit}, ${service.time}. Выезд ${site.eta_city}. WhatsApp с фото — ответ за 5 минут.`,
    h1: `${service.name} в Чолпон-Ате — цена от ${service.price_min} сом`,
    lead, type: 'service', slug: service.slug, name: service.name, name_gen: service.name_gen, category: service.category,
    category_name: cat.name, price_min: service.price_min, price_max: service.price_max,
    unit: service.unit, time: service.time, tags: service.tags,
    faq, citations: citeKeys, updated: today,
  };
  return { fm, body };
}

function buildGeoPage(service, loc) {
  const r = rng(hash(`geo:${service.slug}:${loc.slug}`));
  const eta = ETA_BY_ZONE[loc.zone];
  const lead = fmt(pick(LEAD_TEMPLATES, r), {
    Service: service.name, name_gen: service.name_gen, loc: locPre(loc),
    min: service.price_min, max: service.price_max, unit: unitAcc(service.unit),
    time: service.time, eta, fee_part: loc.travel_fee ? `выезд ${loc.travel_fee} сом, ` : '',
  });
  const priceIntro = fmt(pick(PRICE_INTRO, r), {
    bishkek_min: BISHKEK_MIN_BY_CATEGORY[service.category] ?? 200,
    url: citations['repair-com-kg'].url,
  });
  const why = pickN(WHY_US_POOL, 5, r).map(w => `- ${w}`).join('\n');
  const region = pick(REGION_BLOCKS.filter((_, i) => (hash(loc.slug) + i) % 2 === 0).length ? REGION_BLOCKS : REGION_BLOCKS, r);
  const guarantee = pick(GUARANTEE_PARAS, r);
  const safety = pick(SAFETY_PARA, r);
  const faq = faqFor(service, loc);
  const facts = loc.facts.map(f => `- ${f}`).join('\n');
  const citeKeys = ['repair-com-kg', 'pue', ...(loc.slug === 'bosteri' ? ['wiki-bosteri'] : []), 'electrician-kg'].filter(k => citations[k]);

  const body = `${lead}

Мастер выезжает в ${locPre(loc)}: ${loc.distance_km} км от Чолпон-Аты по трассе А-363, надбавка за дорогу всего ${loc.travel_fee} сом. Работаем ${site.work_hours.toLowerCase()}, аварийные вызовы — круглосуточно.

## Сколько стоит ${service.name_gen} в ${locPre(loc)}

${priceIntro}

${priceTable(service, [['Выезд в ' + loc.name, loc.travel_fee + ' сом (' + loc.distance_km + ' км)']])}
${travelNote(loc)}
## Что входит в работу

${service.includes.map(i => `- ${i}`).join('\n')}

## Как проходит работа

${service.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Когда нужно вызывать мастера в ${locPre(loc)}

${service.symptoms.map(s => `- ${s}`).join('\n')}

## Что знать про ${loc.name}

${facts}

В ${locPre(loc)} частный сектор и курортные объекты соседствуют друг с другом, поэтому типовые задачи разные: где-то нужен ввод и щит для дома, где-то — обслуживание пансионата перед сезоном. Мастер учитывает это при выезде и берёт материалы с запасом.

${region.paras[0]}

## Почему жители ${locPre(loc)} выбирают нас

${why}

${guarantee}

${safety}

## Частые вопросы: ${service.name_gen} в ${locPre(loc)}

${faq.map(f => `### ${f.q}\n\n${f.a}\n`).join('\n')}

${citeKeys.length ? citeList(citeKeys) : ''}
${ctaBlock(`${service.name} в ${locPre(loc)}`, r)}

Другие услуги в ${locPre(loc)}: [электрик в ${locPre(loc)} — все услуги](/lokacii/${loc.slug}/)

Смотрите также: ${relatedLinks(service, loc)}
`;

  const fm = {
    title: (() => {
      const t = `${service.name} в ${locPre(loc)} — от ${service.price_min} сом, выезд ${loc.travel_fee} сом`;
      return t.length <= 70 ? t : `${service.name} в ${locPre(loc)} — от ${service.price_min} сом`;
    })(),
    description: `${service.name} в ${locPre(loc)}: от ${service.price_min} до ${service.price_max} сом за ${service.unit}, выезд ${loc.travel_fee} сом (${loc.distance_km} км). ${site.eta_city} по городу, ответ в WhatsApp за 5 минут.`,
    h1: `${service.name} в ${locPre(loc)} — цена от ${service.price_min} сом`,
    lead, type: 'geo', slug: `${service.slug}-v-${loc.slug}`,
    service_slug: service.slug, location_slug: loc.slug,
    price_min: service.price_min, price_max: service.price_max, unit: service.unit,
    time: service.time, tags: service.tags, distance_km: loc.distance_km,
    travel_fee: loc.travel_fee, faq, citations: citeKeys, updated: today,
  };
  return { fm, body };
}

function buildLocationPage(loc) {
  const r = rng(hash('loc:' + loc.slug));
  const geoCards = GEO_SERVICES.map(s => {
    const g = bySlug[s.slug];
    return `### [${g.name} в ${locPre(loc)}](/${s.slug}-v-${loc.slug}/)\n\nот ${g.price_min} сом за ${g.unit} · выезд ${loc.travel_fee} сом`;
  }).join('\n\n');
  const topServices = services.slice(0, 12)
    .map(s => `- [${s.name}](/uslugi/${s.category}/${s.slug}/) — от ${s.price_min} сом`)
    .join('\n');
  const why = pickN(WHY_US_POOL, 4, r).map(w => `- ${w}`).join('\n');
  const facts = loc.facts.map(f => `- ${f}`).join('\n');
  const faq = faqFor(bySlug['zamena-rozetki'], loc);

  const body = `Электрик в ${locPre(loc)} выезжает ежедневно: ${loc.distance_km} км от Чолпон-Аты, надбавка за дорогу — ${loc.travel_fee} сом. Все виды электромонтажа: от замены розетки до проводки под ключ и обслуживания пансионатов.

## Услуги электрика в ${locPre(loc)} с ценами

${geoCards}

## Полный прайс услуг

${topServices}

Полная таблица цен — на странице [цены на услуги электрика](/ceny/).

## Что знать про ${loc.name}

${facts}

## Частые вопросы

${faq.slice(0, 3).map(f => `### ${f.q}\n\n${f.a}\n`).join('\n')}

## Почему вызывают нас

${why}

${ctaBlock(`Электрик в ${locPre(loc)}`, r)}

Назад: [все населённые пункты](/lokacii/) · [главная](/)
`;

  const fm = {
    title: `Электрик в ${locPre(loc)} — выезд ${loc.travel_fee} сом, все услуги`,
    description: `Электрик в ${locPre(loc)} (${loc.distance_km} км от Чолпон-Аты): розетки, проводка, щиты, бойлеры. Выезд ${loc.travel_fee} сом, гарантия 1 мес. WhatsApp с фото — цена за 5 минут.`,
    h1: `Электрик в ${locPre(loc)} — все услуги с выездом`,
    lead: loc.slug === 'cholpon-ata'
      ? `Электрик в ${locPre(loc)}: приезд за 30–60 минут, 85 услуг электромонтажа с гарантией 1 месяц.`
      : `Электрик в ${locPre(loc)}: выезд ${loc.travel_fee} сом (${loc.distance_km} км), все виды электромонтажных работ с гарантией 1 месяц.`,
    type: 'location', slug: loc.slug, name: loc.name, distance_km: loc.distance_km,
    travel_fee: loc.travel_fee, zone: loc.zone, coords: loc.coords,
    faq: faq.slice(0, 3), updated: today,
  };
  return { fm, body };
}

function buildCategoryPage(cat) {
  const r = rng(hash('cat:' + cat.slug));
  const list = services.filter(s => s.category === cat.slug);
  const cards = list.map(s => `### [${s.name}](/uslugi/${cat.slug}/${s.slug}/)\n\nот ${s.price_min} до ${s.price_max} сом за ${s.unit} · ${s.time}`).join('\n\n');
  const why = pickN(WHY_US_POOL, 4, r).map(w => `- ${w}`).join('\n');
  const body = `${cat.description}

## Услуги категории «${cat.name}»

${cards}

## Как заказать

1. Напишите в WhatsApp название услуги или фото проблемы.
2. Получите цену и время приезда.
3. Мастер выполняет работу и выдаёт гарантию 1 месяц.

${ctaBlock(cat.name, r)}

Все категории: [каталог услуг](/uslugi/)
`;

  const fm = {
    title: `${cat.name} — электрик Чолпон-Ата, цены от ${Math.min(...list.map(s => s.price_min))} сом`,
    description: `${cat.name} в Чолпон-Ате и сёлах Иссык-Куля: ${list.length} услуг, цены от ${Math.min(...list.map(s => s.price_min))} сом. Гарантия 1 месяц, выезд в день обращения.`,
    h1: cat.h1, lead: cat.description, type: 'category', slug: cat.slug,
    services: list.map(s => s.slug), updated: today,
  };
  return { fm, body };
}

function buildTagPage(tag) {
  const r = rng(hash('tag:' + tag.slug));
  const list = services.filter(s => s.tags.includes(tag.slug));
  const cards = list.map(s => `- [${s.name}](/uslugi/${s.category}/${s.slug}/) — от ${s.price_min} сом`).join('\n');
  const body = `${tag.description}

## Услуги по тегу «${tag.name}»

${cards}

${ctaBlock(tag.name, r)}

Все теги: [навигация по услугам](/uslugi/)
`;
  const fm = {
    title: `${tag.name} — услуги электрика Иссык-Куля`,
    description: tag.description.slice(0, 160),
    h1: `${tag.name}: услуги электрика`, lead: tag.description,
    type: 'tag', slug: tag.slug, services: list.map(s => s.slug), updated: today,
  };
  return { fm, body };
}

// ---------- write ----------
const written = [];
let _wcount = 0;
function writeMd(relPath, fm, body) {
  const full = path.join(ROOT, 'content', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const yaml = '---\n' + Object.entries(fm).map(([k, v]) => {
    if (Array.isArray(v)) {
      if (k === 'faq') return 'faq:\n' + v.map(f => `  - q: "${f.q.replace(/"/g, "'")}"\n    a: "${f.a.replace(/"/g, "'")}"`).join('\n');
      if (!v.length) return `${k}: []`;
      return `${k}:\n${v.map(x => `  - "${String(x)}"`).join('\n')}`;
    }
    if (typeof v === 'number') return `${k}: ${v}`;
    return `${k}: "${String(v).replace(/"/g, "'")}"`;
  }).join('\n') + '\n---\n\n';
  fs.writeFileSync(full, yaml + body);
  // .md версия для нейронок
  const mdPath = path.join(ROOT, 'public', 'md', mdUrl(relPath));
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, yaml + body);
  written.push({ path: relPath, chars: body.length });
  if (++_wcount % 50 === 0) console.error(`... ${_wcount} pages`);
}
const mdUrl = (relPath) => {
  if (relPath.startsWith('services/')) return 'uslugi/' + relPath.slice('services/'.length);
  if (relPath.startsWith('geo/')) return relPath.slice('geo/'.length);
  if (relPath.startsWith('locations/')) return 'lokacii/' + relPath.slice('locations/'.length);
  if (relPath.startsWith('categories/')) return 'uslugi/' + relPath.slice('categories/'.length);
  if (relPath.startsWith('tags/')) return 'tagi/' + relPath.slice('tags/'.length);
  if (relPath.startsWith('blog/')) return 'blog/' + relPath.slice('blog/'.length);
  return relPath;
};

// clean - properly handle non-empty directories
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        cleanDir(fullPath);
        try { fs.rmdirSync(fullPath); } catch (e) { /* ignore */ }
      } else {
        try { fs.unlinkSync(fullPath); } catch (e) { /* ignore */ }
      }
    }
    try { fs.rmdirSync(dir); } catch (e) { /* ignore */ }
  }
}
for (const d of ['content/services', 'content/geo', 'content/locations', 'content/categories', 'content/tags']) {
  cleanDir(path.join(ROOT, d));
}
if (fs.existsSync(path.join(ROOT, 'public/md'))) {
  cleanDir(path.join(ROOT, 'public/md'));
}

for (const s of services) writeMd(`services/${s.category}/${s.slug}.md`, ...Object.values(buildServicePage(s)));
for (const s of GEO_SERVICES) for (const l of GEO_LOCATIONS) writeMd(`geo/${s.slug}-v-${l.slug}.md`, ...Object.values(buildGeoPage(s, l)));
for (const l of locations) writeMd(`locations/${l.slug}.md`, ...Object.values(buildLocationPage(l)));
for (const c of categories) writeMd(`categories/${c.slug}.md`, ...Object.values(buildCategoryPage(c)));
for (const t of tags) writeMd(`tags/${t.slug}.md`, ...Object.values(buildTagPage(t)));

const stats = {
  date: today,
  total_pages: written.length,
  under_3000: written.filter(w => w.chars < 3000).length,
  avg_chars: Math.round(written.reduce((a, w) => a + w.chars, 0) / written.length),
  breakdown: {
    services: services.length,
    geo: GEO_SERVICES.length * GEO_LOCATIONS.length,
    locations: locations.length,
    categories: categories.length,
    tags: tags.length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'generate-report.json'), JSON.stringify(stats, null, 2));
console.log(JSON.stringify(stats, null, 2));

process.exit(0);
