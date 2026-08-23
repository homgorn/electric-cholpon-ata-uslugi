// scripts/lib/generator.ts — Pure generator functions (testable, typed)

import {
  GeneratorInput,
  GeneratedPage,
  GenerationReport,
  PageFrontmatter,
  Service,
  Location,
  Category,
  Tag,
  Citation,
  SiteConfig,
  PoolTemplates,
  MorphologyResult,
} from './types.js';
import { getLocPre, getUnitAcc } from './morphology.js';
import { PoolTemplates } from './types.js';
import { genLogger } from './logger.js';

// ============================================
// Utility Functions (Pure, Testable)
// ============================================

/**
 * Deterministic hash → seed for mulberry32 PRNG
 */
function hashString(str: string): number {
  let h = 1779033703;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG — fast, deterministic, good distribution
 */
function createRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick random element from array using RNG
 */
function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Pick N unique elements from array
 */
function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (out.length < n && a.length) {
    out.push(a.splice(Math.floor(rng() * a.length), 1)[0]);
  }
  return out;
}

/**
 * Template string interpolation: {key} → value
 */
function fmt(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/**
 * Format YAML scalar value (numbers unquoted, strings quoted)
 */
export function yamlValue(v: unknown): string {
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '\n' + v.map(x => `  - "${String(x).replace(/"/g, "'")}"`).join('\n');
  }
  return `"${String(v).replace(/"/g, "'")}"`;
}

/**
 * Build frontmatter YAML string
 */
function buildFrontmatterYaml(fm: Record<string, unknown>): string {
  return '---\n' + Object.entries(fm)
    .map(([k, v]) => `${k}: ${yamlValue(v)}`)
    .join('\n') + '\n---\n\n';
}

// ============================================
// Page Builders (Pure Functions)
// ============================================

interface BuilderContext {
  rng: () => number;
  site: SiteConfig;
  pools: PoolTemplates;
  cityLoc: Location;
  categories: Category[];
  locations: Location[];
  tags: Tag[];
  citations: Citation[];
  services: Service[];
  locPre: (l: Location) => string;
  unitAcc: (u: string) => string;
  etaByZone: Record<string, string>;
  bishkekMin: Record<string, number>;
  currency: string;
  today: string;
}

function createContext(input: GeneratorInput): BuilderContext {
  const cityLoc = input.locations.find(l => l.slug === 'cholpon-ata') || input.locations[0];
  const today = new Date().toISOString().slice(0, 10);

  return {
    rng: () => Math.random(), // will be replaced per-page
    site: input.site,
    pools: input.pools,
    cityLoc,
    categories: input.categories,
    locations: input.locations,
    tags: input.tags,
    citations: input.citations,
    services: input.services,
    locPre: (l) => l.pre?.trim() || l.name,
    unitAcc: (u) => {
      const map: Record<string, string> = {
        'точка': 'точку', 'камера': 'камеру', 'контур': 'контур',
        'м': 'метр', 'м²': 'м²', 'шт': 'шт', 'выезд': 'выезд',
        'час': 'час', 'объект': 'объект', 'шлейф': 'шлейф', 'система': 'систему',
      };
      return (Object as any)[u.toLowerCase()] || u;
    },
    etaByZone: input.pools.ETA_BY_ZONE,
    bishkekMin: input.pools.BISHKEK_MIN_BY_CATEGORY,
    currency: input.pools.CURRENCY,
    today,
  };
}

// ---------- FAQ Generation ----------

interface FAQItem { q: string; a: string; }

function buildFAQ(
  ctx: BuilderContext,
  service: Service,
  loc: Location | null,
  rng: () => number
): FAQItem[] {
  const isCity = !loc || loc.slug === 'cholpon-ata';
  const L = loc || ctx.cityLoc;
  const locName = ctx.locPre(L);
  const travelFee = loc?.travel_fee ?? 0;
  const distance = loc?.distance_km ?? 0;
  const eta = loc ? ctx.etaByZone[loc.zone] ?? 'в день обращения' : ctx.site.eta_city;
  const feePart = travelFee ? `выезд ${travelFee} ${ctx.currency}, ` : '';

  const v = {
    name_gen: service.name_gen,
    loc: locName,
    min: service.price_min,
    max: service.price_max,
    unit: ctx.unitAcc(service.unit),
    dist: distance,
    fee: travelFee,
    eta_city: ctx.site.eta_city,
    fee_part: feePart,
    eta,
  };

  const r = () => Math.random(); // will use seeded per-page
  const pickVar = (arr: string[]) => arr[Math.floor(rng() * arr.length)];

  const q1 = fmt(ctx.pools.FAQ_VARIANTS.price_q[0], v);
  const a1 = fmt(ctx.pools.FAQ_VARIANTS.price_a[0], v);
  const q2 = fmt(ctx.pools.FAQ_VARIANTS.eta_q[0], v);
  const a2 = isCity
    ? `По городу приезжаем ${ctx.site.eta_city}. Работаем ${ctx.site.work_hours.toLowerCase()}.`
    : fmt(ctx.pools.FAQ_VARIANTS.eta_a[0], v);
  const q3 = fmt(ctx.pools.FAQ_VARIANTS.warranty_q[0], v);
  const a3 = fmt(ctx.pools.FAQ_VARIANTS.warranty_a[0], v);
  const q4 = fmt(ctx.pools.FAQ_VARIANTS.urgent_q[0], v);
  const a4 = fmt(ctx.pools.FAQ_VARIANTS.urgent_a[0], v);
  const q5 = fmt(ctx.pools.FAQ_VARIANTS.pay_q[0], v);
  const a5 = fmt(ctx.pools.FAQ_VARIANTS.pay_a[0], v);

  return [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
    { q: q5, a: a5 },
  ];
}

// ---------- Related Links ----------

function buildRelatedLinks(ctx: BuilderContext, service: Service, loc: Location | null): string {
  const sameCat = ctx.services
    .filter(s => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4)
    .map(s => `[${s.name}](/uslugi/${s.category}/${s.slug}/)`)
    .join(' · ');

  let geoLinks = '';
  if (loc) {
    const idx = ctx.locations.findIndex(l => l.slug === loc.slug);
    if (idx >= 0) {
      const neighbors = [
        ctx.locations[(idx - 1 + ctx.locations.length) % ctx.locations.length],
        ctx.locations[(idx + 1) % ctx.locations.length],
      ];
      geoLinks = neighbors
        .map(l => `[${service.name} в ${ctx.locPre(l)}](/${service.slug}-v-${l.slug}/)`)
        .join(' · ');
    }
  }

  return sameCat + (geoLinks ? `\n\nРядом: ${geoLinks}` : '');
}

// ---------- Page Builders ----------

function buildServicePage(ctx: BuilderContext, service: Service, rng: () => number): GeneratedPage {
  const eta = ctx.etaByZone.city;
  const waText3 = `Электрик в ${ctx.locPre(loc)}`;
const lead = fmt(pick(ctx.pools.LEAD_TEMPLATES, rng), {
    Service: service.name,
    name_gen: service.name_gen,
    loc: ctx.site.city,
    min: service.price_min,
    max: service.price_max,
    unit: ctx.unitAcc(service.unit),
    time: service.time,
    eta,
    fee_part: '',
  });

  const priceIntro = fmt(pick(ctx.pools.PRICE_INTRO, rng), {
    bishkek_min: ctx.bishkekMin[service.category] ?? 200,
    url: ctx.citations.find(c => c.key === 'repair-com-kg')?.url ?? '#',
  });

  const why = pickN(ctx.pools.WHY_US_POOL, 5, rng).map(w => `- ${w}`).join('\n');
  const region = pick(ctx.pools.REGION_BLOCKS, rng);
  const guarantee = pick(ctx.pools.GUARANTEE_PARAS, rng);
  const safety = pick(ctx.pools.SAFETY_PARAS, rng);

  const faq = buildFAQ(ctx, service, null, rng);
  const citeKeys = ['repair-com-kg', 'eco-service-kg', 'pue', 'electrician-kg']
    .filter(k => ctx.citations.some(c => c.key === k));
  const related = buildRelatedLinks(ctx, service, null);
  const ctaText = pick(ctx.pools.CTA_TEXTS, rng);

  const waUrl = `${ctx.site.whatsapp}?text=${encodeURIComponent(fmt(ctx.site.cta_whatsapp_template, { service: service.name + " в " + ctx.site.city }))}`;
const body = `${lead}

## Сколько стоит ${service.name_gen} в ${ctx.site.city}

${priceIntro}

| Параметр | Значение |
|---|---|
| Цена за ${service.unit} | **от ${service.price_min} до ${service.price_max} ${ctx.currency}** |
| Время работы | ${service.time} |
| Гарантия | 12 месяцев |

| Выезд в сёла | Надбавка |
|---|---|
| До 20 км (Бостери, Тамчы…) | 200–300 ${ctx.currency} |
| 21–50 км (Ананьево, Григорьевка…) | 400–500 ${ctx.currency} |
| 50–90 км (Балыкчы, Ак-Суу…) | 600–800 ${ctx.currency} |

## Что входит в работу

${service.includes.map(i => `- ${i}`).join('\n')}
- Уборка рабочего места и вынос мусора

## Как проходит работа

${service.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Когда нужно вызывать мастера

${service.symptoms.map(s => `- ${s}`).join('\n')}

Не ждите, пока искрение превратится в короткое замыкание: ${service.name.toLowerCase()} стоит дешевле, чем ремонт после пожара.

## Почему выбирают нас в ${ctx.site.city}

${why}

${guarantee}

## ${region.title}

${region.paras.join('\n\n')}

${safety}

## Частые вопросы о ${service.name_gen}

${faq.map(f => `### ${f.q}\n\n${f.a}\n`).join('\n')}

${citeKeys.length
  ? '\n## Источники\n\n' + citeKeys.map(k => {
      const c = ctx.citations.find(x => x.key === k);
      return `- [${c!.title}](${c!.url}) — ${c!.fact}`;
    }).join('\n') + '\n'
  : ''}

> **${ctaText}**
>
> [💬 WhatsApp с фото](${waUrl}) · [✈️ Telegram](${ctx.site.telegram})

${related ? `Смотрите также: ${related}` : ''}
`;

  const fm: PageFrontmatter = {
    title: `${service.name} в ${ctx.site.city} — цена от ${service.price_min} ${ctx.currency}`,
    description: `${service.name} в ${ctx.site.city}: от ${service.price_min} до ${service.price_max} ${ctx.currency} за ${service.unit}, ${service.time}. Выезд ${ctx.site.eta_city}. WhatsApp с фото — ответ за 5 минут.`,
    h1: `${service.name} в ${ctx.site.city} — цена от ${service.price_min} ${ctx.currency}`,
    lead,
    type: 'service',
    slug: service.slug,
    category: service.category,
    category_name: ctx.categories.find(c => c.slug === service.category)?.name,
    price_min: service.price_min,
    price_max: service.price_max,
    unit: service.unit,
    time: service.time,
    tags: service.tags,
    faq: buildFAQ({} as any, service, null, () => 0), // placeholder, will be replaced
    citations: ['repair-com-kg', 'eco-service-kg', 'pue', 'electrician-kg'].filter(k => ctx.citations.some(c => c.key === k)),
    updated: ctx.today,
  };

  return { fm, body, chars: body.length, relPath: `services/${service.category}/${service.slug}.md` };
}

function buildGeoPage(ctx: BuilderContext, service: Service, loc: Location, rng: () => number): GeneratedPage {
  const eta = ctx.etaByZone[loc.zone] ?? 'в день обращения';
  const locName = ctx.locPre(loc);
  const waText3 = `Электрик в ${ctx.locPre(loc)}`;
const lead = fmt(pick(ctx.pools.LEAD_TEMPLATES, rng), {
    Service: service.name,
    name_gen: service.name_gen,
    loc: locName,
    min: service.price_min,
    max: service.price_max,
    unit: ctx.unitAcc(service.unit),
    time: service.time,
    eta,
    fee_part: loc.travel_fee ? `выезд ${loc.travel_fee} ${ctx.currency}, ` : '',
  });

  const priceIntro = fmt(pick(ctx.pools.PRICE_INTRO, rng), {
    bishkek_min: ctx.bishkekMin[service.category] ?? 200,
    url: ctx.citations.find(c => c.key === 'repair-com-kg')?.url ?? '#',
  });

  const why = pickN(ctx.pools.WHY_US_POOL, 5, rng).map(w => `- ${w}`).join('\n');
  const region = pick(ctx.pools.REGION_BLOCKS, rng);
  const guarantee = pick(ctx.pools.GUARANTEE_PARAS, rng);
  const safety = pick(ctx.pools.SAFETY_PARAS, rng);

  const faq = buildFAQ({} as any, service, loc, rng);
  const facts = loc.facts.map(f => `- ${f}`).join('\n');
  const citeKeys = ['repair-com-kg', 'pue', 'electrician-kg', ...(loc.slug === 'bosteri' ? ['wiki-bosteri'] : [])]
    .filter(k => ctx.citations.some(c => c.key === k));
  const related = buildRelatedLinks({} as any, service, loc);

  const waUrl = `${ctx.site.whatsapp}?text=${encodeURIComponent(fmt(ctx.site.cta_whatsapp_template, { service: service.name + " в " + ctx.site.city }))}`;
const body = `${lead}

Мастер выезжает в ${ctx.locPre(loc)}: ${loc.distance_km} км от ${ctx.site.city} по трассе А-363, надбавка за дорогу всего ${loc.travel_fee} ${ctx.currency}. Работаем ${ctx.site.work_hours.toLowerCase()}, аварийные вызовы — круглосуточно.

## Сколько стоит ${service.name_gen} в ${ctx.locPre(loc)}

${priceIntro}

| Параметр | Значение |
|---|---|
| Цена за ${service.unit} | **от ${service.price_min} до ${service.price_max} ${ctx.currency}** |
| Время работы | ${service.time} |
| Гарантия | 12 месяцев |
| Выезд в ${ctx.locPre(loc)} | ${loc.travel_fee} ${ctx.currency} (${loc.distance_km} км) |

## Что входит в работу

${service.includes.map(i => `- ${i}`).join('\n')}

## Как проходит работа

${service.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Когда нужно вызывать мастера в ${ctx.locPre(loc)}

${service.symptoms.map(s => `- ${s}`).join('\n')}

## Что знать про ${loc.name}

${facts}

В ${ctx.locPre(loc)} частный сектор и курортные объекты соседствуют друг с другом, поэтому типовые задачи разные: где-то нужен ввод и щит для дома, где-то — обслуживание пансионата перед сезоном. Мастер учитывает это при выезде и берёт материалы с запасом.

${region.paras[0]}

## Почему жители ${ctx.locPre(loc)} выбирают нас

${why}

${guarantee}

${safety}

## Частые вопросы: ${service.name_gen} в ${ctx.locPre(loc)}

${buildFAQ({} as any, service, loc, rng).map(f => `### ${f.q}\n\n${f.a}\n`).join('\n')}

${citeKeys.length
  ? '\n## Источники\n\n' + citeKeys.map(k => {
      const c = ctx.citations.find(x => x.key === k);
      return `- [${c!.title}](${c!.url}) — ${c!.fact}`;
    }).join('\n') + '\n'
  : ''}

> **${pick(ctx.pools.CTA_TEXTS, rng)}**
>
> [💬 WhatsApp с фото](${waUrlGeo}) · [✈️ Telegram](${ctx.site.telegram})

Другие услуги в ${ctx.locPre(loc)}: [электрик в ${loc.name} — все услуги](/lokacii/${loc.slug}/)

${related ? `Смотрите также: ${related}` : ''}
`;

  const fm: PageFrontmatter = {
    title: `${service.name} в ${ctx.locPre(loc)} — от ${service.price_min} ${ctx.currency}, выезд ${loc.travel_fee} ${ctx.currency}`,
    description: `${service.name} в ${ctx.locPre(loc)}: от ${service.price_min} до ${service.price_max} ${ctx.currency} за ${service.unit}, выезд ${loc.travel_fee} ${ctx.currency} (${loc.distance_km} км). ${ctx.site.eta_city} по городу, ответ в WhatsApp за 5 минут.`,
    h1: `${service.name} в ${ctx.locPre(loc)} — цена от ${service.price_min} ${ctx.currency}`,
    lead,
    type: 'geo',
    slug: `${service.slug}-v-${loc.slug}`,
    service_slug: service.slug,
    location_slug: loc.slug,
    price_min: service.price_min,
    price_max: service.price_max,
    unit: service.unit,
    time: service.time,
    tags: service.tags,
    distance_km: loc.distance_km,
    travel_fee: loc.travel_fee,
    faq: buildFAQ({} as any, service, loc, () => 0),
    citations: ['repair-com-kg', 'pue', 'electrician-kg', ...(loc.slug === 'bosteri' ? ['wiki-bosteri'] : [])]
      .filter(k => ctx.citations.some(c => c.key === k)),
    updated: ctx.today,
  };

  return { fm, body, chars: body.length, relPath: `geo/${service.slug}-v-${loc.slug}.md` };
}

function buildLocationPage(ctx: BuilderContext, loc: Location, rng: () => number): GeneratedPage {
  const geoServices = ctx.services.filter(s => s.geo_priority);
  const geoCards = geoServices.map(s => {
    const g = s;
    return `### [${g.name} в ${ctx.locPre(loc)}](/${g.slug}-v-${loc.slug}/)\n\nот ${g.price_min} ${ctx.currency} за ${g.unit} · выезд ${loc.travel_fee} ${ctx.currency}`;
  }).join('\n\n');

  const topServices = ctx.services.slice(0, 12)
    .map(s => `- [${s.name}](/uslugi/${s.category}/${s.slug}/) — от ${s.price_min} ${ctx.currency}`)
    .join('\n');

  const why = pickN(ctx.pools.WHY_US_POOL, 4, rng).map(w => `- ${w}`).join('\n');
  const facts = loc.facts.map(f => `- ${f}`).join('\n');
  const faq = buildFAQ({} as any, ctx.services.find(s => s.slug === 'zamena-rozetki')!, loc, rng);

  const waUrlLoc = `${ctx.site.whatsapp}?text=${encodeURIComponent(fmt(ctx.site.cta_whatsapp_template, { service: "Электрик в " + ctx.locPre(loc) }))}`;
const body = `Электрик в ${ctx.locPre(loc)} выезжает ежедневно: ${loc.distance_km} км от ${ctx.site.city}, надбавка за дорогу — ${loc.travel_fee} ${ctx.currency}. Все виды электромонтажа: от замены розетки до проводки под ключ и обслуживания пансионатов.

## Услуги электрика в ${ctx.locPre(loc)} с ценами

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

> **${pick(ctx.pools.CTA_TEXTS, rng)}**
>
> [💬 WhatsApp с фото](${waUrlLoc}) · [✈️ Telegram](${ctx.site.telegram})

Назад: [все населённые пункты](/lokacii/) · [главная](/)
`;

  const fm: PageFrontmatter = {
    title: `Электрик в ${ctx.locPre(loc)} — выезд ${loc.travel_fee} ${ctx.currency}, все услуги`,
    description: `Электрик в ${ctx.locPre(loc)} (${loc.distance_km} км от ${ctx.site.city}): розетки, проводка, щиты, бойлеры. Выезд ${loc.travel_fee} ${ctx.currency}, гарантия 12 мес. WhatsApp с фото — цена за 5 минут.`,
    h1: `Электрик в ${ctx.locPre(loc)} — все услуги с выездом`,
    lead: `Электрик в ${ctx.locPre(loc)}: выезд ${loc.travel_fee} ${ctx.currency} (${loc.distance_km} км), все виды электромонтажных работ с гарантией 12 месяцев.`,
    type: 'location',
    slug: loc.slug,
    name: loc.name,
    distance_km: loc.distance_km,
    travel_fee: loc.travel_fee,
    zone: loc.zone,
    coords: loc.coords,
    faq: faq.slice(0, 3),
    updated: ctx.today,
  };

  return { fm, body, chars: body.length, relPath: `locations/${loc.slug}.md` };
}

function buildCategoryPage(ctx: BuilderContext, cat: Category, rng: () => number): GeneratedPage {
  const list = ctx.services.filter(s => s.category === cat.slug);
  const cards = list.map(s => `### [${s.name}](/uslugi/${cat.slug}/${s.slug}/)\n\nот ${s.price_min} до ${s.price_max} ${ctx.currency} за ${s.unit} · ${s.time}`).join('\n\n');
  const why = pickN(ctx.pools.WHY_US_POOL, 4, rng).map(w => `- ${w}`).join('\n');

  const waUrlCat = `${ctx.site.whatsapp}?text=${encodeURIComponent(fmt(ctx.site.cta_whatsapp_template, { service: cat.name }))}`;

  const body = `${cat.description}

## Услуги категории «${cat.name}»

${cards}

## Как заказать

1. Напишите в WhatsApp название услуги или фото проблемы.
2. Получите цену и время приезда.
3. Мастер выполняет работу и выдаёт гарантию 12 месяцев.

> **${pick(ctx.pools.CTA_TEXTS, rng)}**
>
> [💬 WhatsApp с фото](${waUrlCat}) · [✈️ Telegram](${ctx.site.telegram})

Все категории: [каталог услуг](/uslugi/)
`;

  const minPrice = Math.min(...list.map(s => s.price_min));
  const fm: PageFrontmatter = {
    title: `${cat.name} — электрик ${ctx.site.city}, цены от ${minPrice} ${ctx.currency}`,
    description: `${cat.name} в ${ctx.site.city} и сёлах ${ctx.site.region_short}: ${list.length} услуг, цены от ${minPrice} ${ctx.currency}. Гарантия 12 месяцев, выезд в день обращения.`,
    h1: cat.h1,
    lead: cat.description,
    type: 'category',
    slug: cat.slug,
    services: list.map(s => s.slug),
    updated: ctx.today,
  };

  return { fm, body, chars: body.length, relPath: `categories/${cat.slug}.md` };
}

function buildTagPage(ctx: BuilderContext, tag: Tag, rng: () => number): GeneratedPage {
  const list = ctx.services.filter(s => s.tags.includes(tag.slug));
  const cards = list.map(s => `- [${s.name}](/uslugi/${s.category}/${s.slug}/) — от ${s.price_min} ${ctx.currency}`).join('\n\n');

  const waUrlTag = `${ctx.site.whatsapp}?text=${encodeURIComponent(fmt(ctx.site.cta_whatsapp_template, { service: tag.name }))}`;

  const body = `${tag.description}

## Услуги по тегу «${tag.name}»

${cards}

> **${pick(ctx.pools.CTA_TEXTS, rng)}**
>
> [💬 WhatsApp с фото](${waUrlTag}) · [✈️ Telegram](${ctx.site.telegram})

Все теги: [навигация по услугам](/uslugi/)
`;

  const fm: PageFrontmatter = {
    title: `${tag.name} — услуги электрика ${ctx.site.region_short}`,
    description: tag.description.slice(0, 160),
    h1: `${tag.name}: услуги электрика`, lead: tag.description,
    type: 'tag', slug: tag.slug, services: list.map(s => s.slug), updated: ctx.today,
  };

  return { fm, body, chars: body.length, relPath: `tags/${tag.slug}.md` };
}

// ============================================
// Main Export Function
// ============================================

export interface GenerateOptions {
  input: GeneratorInput;
  outputDir?: string;
  publicMdDir?: string;
  reportDir?: string;
}

export async function generateContent(opts: GenerateOptions): Promise<GenerationReport> {
  const { input, outputDir = 'content', publicMdDir = 'public/md', reportDir = 'outputs' } = opts;
  const ctx = createContext(input);
  const written: GeneratedPage[] = [];
  let _wcount = 0;

  // Geo services and locations
  const geoServices = input.services.filter(s => s.geo_priority);
  const geoLocations = input.locations.filter(l => l.slug !== 'cholpon-ata');

  // --- Services ---
  for (const s of input.services) {
    const page = buildServicePage(ctx, s, () => Math.random());
    writePage(page, outputDir, publicMdDir);
    written.push(page);
    if (++_wcount % 50 === 0) genLogger.info({ count: _wcount }, 'pages generated');
  }

  // --- Geo pages ---
  for (const s of input.services.filter(s => s.geo_priority)) {
    for (const l of geoLocations) {
      const page = buildGeoPage(ctx, s, l, () => Math.random());
      writePage(page, outputDir, publicMdDir);
      written.push(page);
      if (++_wcount % 50 === 0) genLogger.info({ count: _wcount }, 'pages generated');
    }
  }

  // --- Locations ---
  for (const l of input.locations) {
    const page = buildLocationPage(ctx, l, () => Math.random());
    writePage(page, outputDir, publicMdDir);
    written.push(page);
  }

  // --- Categories ---
  for (const c of input.categories) {
    const page = buildCategoryPage(ctx, c, () => Math.random());
    writePage(page, outputDir, publicMdDir);
    written.push(page);
  }

  // --- Tags ---
  for (const t of input.tags) {
    const page = buildTagPage(ctx, t, () => Math.random());
    writePage(page, outputDir, publicMdDir);
    written.push(page);
  }

  // Report
  const report: GenerationReport = {
    date: new Date().toISOString().slice(0, 10),
    total_pages: written.length,
    under_3000: written.filter(w => w.chars < 3000).length,
    avg_chars: Math.round(written.reduce((a, w) => a + w.chars, 0) / written.length),
    breakdown: {
      services: input.services.length,
      geo: geoServices.length * geoLocations.length,
      locations: input.locations.length,
      categories: input.categories.length,
      tags: input.tags.length,
    },
  };

  // Write report
  const reportDirPath = path.join(process.cwd(), reportDir, report.date);
  await fs.promises.mkdir(reportDirPath, { recursive: true });
  await fs.promises.writeFile(
    path.join(reportDirPath, 'generate-report.json'),
    JSON.stringify(report, null, 2)
  );

  genLogger.info({ total: written.length, avgChars: report.avg_chars }, 'Generation complete');
  return report;
}

function writePage(page: GeneratedPage, outputDir: string, publicMdDir: string): void {
  const fullPath = path.join(process.cwd(), outputDir, page.relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const yaml = buildFrontmatterYaml(page.fm as any);
  fs.writeFileSync(fullPath, yaml + page.body);

  // .md version for LLMs
  const mdPath = path.join(process.cwd(), publicMdDir, mdUrl(page.relPath));
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, yaml + page.body);
}

function mdUrl(relPath: string): string {
  if (relPath.startsWith('services/')) return 'uslugi/' + relPath.slice('services/'.length);
  if (relPath.startsWith('geo/')) return relPath.slice('geo/'.length);
  if (relPath.startsWith('locations/')) return 'lokacii/' + relPath.slice('locations/'.length);
  if (relPath.startsWith('categories/')) return 'uslugi/' + relPath.slice('categories/'.length);
  if (relPath.startsWith('tags/')) return 'tagi/' + relPath.slice('tags/'.length);
  if (relPath.startsWith('blog/')) return 'blog/' + relPath.slice('blog/'.length);
  return relPath;
}

// Re-export utils for tests
export { hashString, createRNG, pick, pickN, fmt, buildFAQ, buildRelatedLinks,
  buildServicePage, buildGeoPage, buildLocationPage, buildCategoryPage, buildTagPage };
