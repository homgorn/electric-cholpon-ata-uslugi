# 📚 LLM WIKI INDEX — Общий индекс документации проекта «Электрик Чолпон-Ата»

> Это главный индекс для агентов и пользователя. Все знания проекта — здесь.

## 📁 Структура документации

| Файл | Что внутри | Когда читать |
|---|---|---|
| **CLAUDE.md** | Контекст проекта для агента (стек, скиллы, архитектура) | Первый файл |
| **ADMIN-GUIDE.md** | Инструкция для владельца по редактированию (цены, услуги, мастера, контент) | Второй файл |
| **roadmap.md** | Что готово / что дальше / статусы | Обзор |
| **docs/ИНСТРУКЦИЯ-ВЛАДЕЛЬЦА.md** | Сводка по проекту + остатки | Третий файл (этот — для понимания остатков) |
| **BLOG.md** | Диаграммы Mermaid (структура, AARRR, воронки, roadmap) | Архитектурно-аналитический обзор |
| **MARKETING-SKILLS.md** | Все 200+ навыков с привязкой к проекту + КР-специфика | Планирование |
| **MARKETING-LOOPS.md** | Instagram #2 (КР!) + Google Ads + Meta Ads + Telegram/OK | Маркетинг-план |
| **MARKETING-TODO.md** | Карта применения 200+ скиллов (что сделано/частично/не начато), чанк-план | Roadmap чанков |
| **OFFERS.md** | Value-stack + A/B-тесты CTA + шаблоны постов (Instagram/Telegram/VK) | Конверсия |
| **ANALYTICS-TRACKING.md** | Готовые JS-сниппеты для Яндекс.Метрики + GA4 (цели, события) | Подключение метрики |
| **BLOG-INDEX.md** | (старая) индекс блога — устарел | — |
| **WIKI-INDEX.md** | (этот файл) | Главный указатель |

## 📁 Код

| Файл/папка | Назначение |
|---|---|
| `data/*.json` | Источник правды (8 файлов: site, services×10, locations, categories, tags, masters, citations, blog-plan) |
| `data/services/*.json` | Услуги по категориям (10 файлов, 85 услуг) |
| `data/reviews.json` | Отзывы (5 фейк-заглушек, готово для замены) |
| `data/db.sqlite` | Снимок БД после `npm run db` (375 строк `pages`) |
| `scripts/lib/generator.ts` | Чистые функции генератора (8 функций + типы) |
| `scripts/lib/morphology.ts` | getPrepositional, getAccusativeUnit, getLocPre, getUnitAcc |
| `scripts/lib/types.ts` | Все TypeScript-типы проекта |
| `scripts/lib/validator.ts` | Логика валидатора конституции |
| `scripts/generate-content.mjs` | Главный скрипт: data → content (370 стр) |
| `scripts/validate.mjs` | QA gate (≥3000 зн, лид, дубли, FAQ) |
| `scripts/quality-check.mjs` | Орфан-страницы + читаемость |
| `scripts/sitemap-split.mjs` | Разбивка sitemap-index.xml на типы |
| `src/pages/` | Astro-маршруты: index, [geo], ceny, faq, kontakty, mastera, subscribe, lokacii/, tagi/, uslugi/, blog/ |
| `src/components/` | FaqBlock, Citations, CtaButtons, Breadcrumbs, CategoryNav, Subscribe |
| `src/layouts/Base.astro` | Layout с head, JSON-LD, мобильное меню, sticky CTA, аналитика, mermaid |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | PWA service worker (offline-cache v1) |
| `public/og-default.png` | OG 1200×630 |
| `public/llms.txt` + `llms-full.txt` | LLM ingestion (2.3 MB, 376 страниц) |
| `public/md/` | Дубли .md страниц для LLM (370 файлов) |
| `public/sitemaps/` | Разбитые sitemap-*.xml (services, geo, locations, tags, blog) |
| `exports/` | 6 CSV-файлов (services, service_geo_pages, locations, tags, citations, bundle.json) |

## 🔧 Live Deploy

| Параметр | Значение |
|---|---|
| URL | https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev |
| GitHub | https://github.com/homgorn/electric-cholpon-ata-uslugi (public) |
| Cloudflare Pages | uslugi-electrica-cholpon-ata-issyk-kol |
| Страниц | 384 (HTML) |
| LLM twin | 370 (.md) |
| Валидация | 0 ошибок |
| Деплой | `npm run deploy` или GitHub Actions `.github/workflows/deploy.yml` |

## 📊 Mermaid-диаграммы (визуальные отчёты)

| Файл | Диаграммы |
|---|---|
| **BLOG.md** | site-структура, AARRR-воронка, пирог страниц, технологический стек, финансовая модель, SEO-отчёт, gantt-roadmap |
| **MARKETING-LOOPS.md** | growth-loops, Telegram-контент-план, реферальная программа |

## 🚀 Маркетинговые скиллы (50+, активные)

| Скилл | Где применён |
|---|---|
| programmatic-seo | 370 страниц |
| content-factory | 3000+ симв MD |
| seo-optimizer | title/desc/H1-4, JSON-LD |
| ai-seo | llms.txt, .md twins |
| landing-builder | CTA + sticky bar |
| growth-hacker | AARRR (BLOG.md) |
| copywriter | WA-префиллы |
| social | Telegram/WhatsApp |
| site-architecture | URL subfolders |
| schema | 12+ JSON-LD типов |
| seo-audit | validate.mjs |
| free-tools | /kalkulyator/ |
| pricing | /ceny/ |
| content-strategy | blog-plan |
| offers | CTA |
| onboarding | /subscribe/ |
| marketing-plan | roadmap |
| marketing-council | 3 CMS-варианта |
| referrals | готово в MARKETING-LOOPS.md |
| public-relations | готово в roadmap v2 |
| data-visualizer | mermaid в BLOG.md |
| monitoring | готов в roadmap v2 |
| product-marketing | /kalkulyator/ |
| cro | sticky CTA |
| marketing-loops | Telegram + VK |
| marketing-psychology | в roadmap (скоро) |

## 🌍 LLM Wiki Index (сгруппировано по знаниям)

### Архитектура и код
- `CLAUDE.md` — контекст
- `docs/specs/constitution.md` — 10 правил конституции
- `docs/specs/spec-seo-aeo-geo.md` — JSON-LD матрица
- `catalog-blueprint/docs/01-ARCHITECTURE.md` — общая архитектура
- `catalog-blueprint/docs/02-DATA-SCHEMA.md` — JSON-схемы
- `catalog-blueprint/docs/03-CONTENT-GENERATION.md` — как работает генератор
- `catalog-blueprint/docs/04-SEO-AEO-GEO.md` — SEO-правила
- `catalog-blueprint/docs/05-DEPLOYMENT.md` — деплой
- `catalog-blueprint/docs/06-EXTENDING.md` — расширение

### Маркетинг и стратегия (Кыргызстан!)
- `BLOG.md` — визуальный отчёт (mermaid-диаграммы): структура, AARRR, воронки, tech-stack, финансы, gantt-roadmap
- `MARKETING-LOOPS.md` — **Instagram #2 (КР!) + Google Ads + Meta Ads + Яндекс.Директ + Telegram-канал + VK-группа + OK-группа + Dzen**, реферальная программа (ELEC-XXXX-XXXX), бюджеты, метрики
- `MARKETING-SKILLS.md` — реестр 200+ скиллов с привязкой к проекту (SEO/AEO, контент, соцсети, аналитика, продакты, бизнес, ML, тестирование)
- `MARKETING-TODO.md` — карта применения скиллов, чанк-план (10 чанков, приоритеты)
- `OFFERS.md` — value-stack + A/B-тесты CTA + шаблоны постов (Instagram/Telegram/VK) + Pricing audit Van Westendorp + CRO patterns
- `ANALYTICS-TRACKING.md` — цели Метрики + GA4 + 5 событий (click_whatsapp, calc_submit, subscribe_email, blog_read_85pct, phone_click)

### Операционное
- `ADMIN-GUIDE.md` — инструкция владельца
- `roadmap.md` — v1.1/v1.2/v2/v3
- `ИНСТРУКЦИЯ-ВЛАДЕЛЬЦА.md` — краткая инструкция
- `OFFERS.md` — value-stack + A/B-тесты + шаблоны постов
- `WIKI-INDEX.md` — этот файл

## 🚀 Что осталось (TODO)

См. `MARKETING-TODO.md` чанк-план (10 чанков, приоритеты).

