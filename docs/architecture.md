# Architecture: Электрик Чолпон-Ата

## Диаграмма потока данных

```
data/*.json ──► scripts/generate-content.mjs ──► content/**/*.md (≈400 файлов)
     │                    │                                  │
     │                    └──► public/md/**  (.md-версии для нейронок)
     │                                                       │
     └──► scripts/build-db.mjs ──► data/db.sqlite            ▼
     └──► scripts/export.mjs ──► exports/*.csv|json    Astro content collections
                                                              │
                                              src/pages/* getStaticPaths
                                                              ▼
                                    dist/ (HTML + JSON-LD + sitemap.xml)
                                                              ▼
                                     Cloudflare Pages (wrangler deploy)
```

## Стек
- **Astro 5** static output — SSG идеален для programmatic SEO, нулевой JS
- **@astrojs/sitemap** — sitemap-index.xml
- **Node 22 ESM скрипты** без внешних зависимостей (кроме astro/wrangler)
- **SQLite** через `node --experimental-sqlite` (без нативных зависимостей)

## Схема данных (data/db.sqlite)

```sql
categories(id PK, slug UNIQUE, name, description, h1)
services(id PK, slug UNIQUE, name, category_id FK, price_min, price_max,
         unit, time, geo_priority INT, keywords JSON, faq JSON,
         includes JSON, steps JSON, symptoms JSON, tags JSON)
locations(id PK, slug UNIQUE, name, distance_km, travel_fee, zone, population, coords)
service_geo(service_id FK, location_id FK)          -- матрица 6×35
tags(id PK, slug UNIQUE, name, description)
masters(id PK, name, phone, whatsapp, telegram, rating, specialties JSON,
        areas JSON, status)                          -- TODO: наполнение
citations(id PK, key UNIQUE, title, url, fact)
```

## Маршруты Astro

| Паттерн | Источник | Кол-во |
|---|---|---|
| `/` | pages/index | 1 |
| `/uslugi/`, `/uslugi/[cat]/`, `/uslugi/[cat]/[svc]/` | collection services+categories | 96 |
| `/[geo]/` (slug = `{service}-v-{location}`) | collection geo | 210 |
| `/lokacii/[loc]/` | locations.json | 36 |
| `/tagi/[tag]/` | tags.json | 18 |
| `/blog/`, `/blog/[post]/` | collection blog | 11 |
| `/ceny/ /mastera/ /faq/ /kontakty/ /o-nas/` | pages | 5 |
| `/md/[...path].md` | public/md копии | ~400 |
| `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap-index.xml` | scripts/public | 4 |

## Компоненты
- `Base.astro` — head (canonical, OG, Twitter), header/footer, sticky CTA
- `CTAButtons.astro` — WhatsApp с префиллом + Telegram (параметр: название услуги)
- `PriceTable.astro`, `FaqBlock.astro` (+FAQPage JSON-LD), `Citations.astro`,
  `Breadcrumbs.astro` (+BreadcrumbList), `ServiceCard.astro`
- `lib/jsonld.ts` — генераторы схем; `lib/site.ts` — доступ к data/*.json

## Анти-doorway стратегия (гео-страницы)
1. Seeded random (seed = hash(slug)) выбирает вариант каждого блока из пулов → соседние страницы различаются на 40–60%
2. Локальный блок: расстояние, выезд, факты НП из RESEARCH-locations.md
3. Уникальный лид с ценой конкретной услуги
4. Валидатор отклоняет <3000 символов и дубли лидов

## Деплой
Cloudflare Pages, project `uslugi-electrica-cholpon-ata-issyk-kol`.
`npm run build && npm run deploy`. При покупке домена: поменять SITE_URL в astro.config.mjs + data/site.json.
