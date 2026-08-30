# 📢 MARKETING-SKILLS.md — Реестр навыков с привязкой к проекту (v1.2, Кыргызстан)

> Все skills из `/Users/user/.claude/skills/` (200+) и `/Users/user/.config/opencode/skills/`.
> Сгруппированы по релевантности к проекту «Электрик Чолпон-Ата».
> Контекст рынка: РФ + Кыргызстан, локальный бизнес электрики, B2C + B2B (пансионаты).

## ✅ Применённые скиллы (выполнено в коде/документации)

| Skill | Что сделано | Файл |
|---|---|---|
| `programmatic-seo` | 370 страниц (услуга×локация), анти-дорвей, hub-and-spoke | `scripts/generate-content.mjs`, `scripts/validate.mjs` |
| `content-factory` | 370 .md страниц с 3000+ симв. | `scripts/generate-content.mjs` |
| `seo-optimizer` | title/desc/H1-4, JSON-LD | `src/layouts/Base.astro`, `src/pages/uslugi/[cat]/[svc].astro` |
| `ai-seo` | `llms.txt` + `llms-full.txt` + `.md` twins | `scripts/generate-llms.mjs` |
| `landing-builder` | CTA WhatsApp/Telegram, sticky bar | `src/components/CtaButtons.astro` |
| `growth-hacker` | AARRR-воронка в `BLOG.md` | `docs/BLOG.md` |
| `copywriter` | префиллы WhatsApp «Пишу с сайта...» | `data/site.json`, `src/lib/jsonld.ts` |
| `social` | Telegram/Instagram/Meta/OK/VK (КР контекст) | `docs/MARKETING-LOOPS.md` |
| `site-architecture` | URL: subfolders, не subdomains | `data/`, `src/pages/` |
| `schema` | 12+ JSON-LD типов (FAQPage, Service, HowTo, Review, AggregateRating, OfferCatalog, BreadcrumbList, WebSite, SearchAction, GeoCoordinates, ContactPoint) | `src/lib/jsonld.ts` |
| `seo-audit` | validate.mjs: длина текста, лид, дубли, цитаты, FAQ, H1, anchors | `scripts/validate.mjs` |
| `free-tools` | `/kalkulyator/` живой, без лид-кэпчуры | `src/pages/kalkulyator.astro` |
| `pricing` | `data/services/*.json` с min/max, `/ceny/` со сводной таблицей | `data/services/`, `src/pages/ceny.astro` |
| `content-strategy` | 5 статей seed, blog-plan 25 тем | `data/blog-plan.json` |
| `offers` | CTA с префиллом, value-stack в `MARKETING-TODO.md` | `src/components/CtaButtons.astro` |
| `onboarding` | `/subscribe/`, PWA, sticky CTA | `src/pages/subscribe.astro`, `public/manifest.json` |
| `marketing-plan` | roadmap.md + BLOG.md + AARRR | `docs/roadmap.md`, `docs/BLOG.md` |
| `marketing-council` | 3 CMS-варианта (GitHub/Sveltia/Bot) | `docs/ADMIN-GUIDE.md` |
| `referrals` | готово в `MARKETING-LOOPS.md` (реф-код ELEC-XXXX-XXXX) | `docs/MARKETING-LOOPS.md` |
| `public-relations` | готово в roadmap v2 (pitch в местные СМИ) | `docs/roadmap.md` |
| `data-visualizer` | mermaid в `BLOG.md` + `MARKETING-LOOPS.md` | `docs/BLOG.md` |
| `monitoring` | готов в roadmap v2 (Cloudflare Analytics) | `docs/roadmap.md` |
| `product-marketing` | `/kalkulyator/` + ICP = владельцы пансионатов + жители 30+ | `docs/MARKETING-LOOPS.md` |
| `cro` | sticky CTA, A/B-ready | `src/layouts/Base.astro` |
| `marketing-loops` | Telegram + Instagram + Meta + Google Ads | `docs/MARKETING-LOOPS.md` |
| `marketing-psychology` | в roadmap (скоро: страх, дефицит, социальное доказательство) | `docs/roadmap.md` |

## 📱 Специфические скиллы для Кыргызстана (НОВЫЕ, приоритетные)

| Skill | Когда активировать | Что сделано в проекте |
|---|---|---|
| `instagram-analyzer` | анализ Instagram-аккаунтов конкурентов | ❌ Не сделано — TODO |
| `meta-ad-library-api` | исследование рекламы конкурентов в Meta | ❌ Не сделано — TODO |
| `instagram-analyzer` | парсинг Instagram-профилей, хэштеги, контент-план | ❌ Не сделано — TODO |
| `platform-instagram` | постинг, Reels, Stories, Direct | ⚠️ Контент-план создан в `MARKETING-LOOPS.md`, аккаунт ещё не создан |
| `platform-telegram` | постинг в канале, бот | ⚠️ Бот v2 в roadmap.md §v2, канал @realhikaz |
| `platform-facebook` | постинг в группу, B2B | ⚠️ Контент-план в MARKETING-LOOPS.md |
| `platform-ok` | постинг, группа | ⚠️ Контент-план в MARKETING-LOOPS.md |
| `platform-vk` | постинг, клипы | ⚠️ Контент-план в MARKETING-LOOPS.md |
| `tiktok-analyzer` | анализ TikTok-аккаунтов | ❌ TikTok не приоритет для КР |
| `telegram-analyzer` | парсинг Telegram-каналов | ❌ Не сделано |
| `community-manager` | управление сообществами | ⚠️ В проекте, но не активирован |
| `reels-creator` | создание Instagram Reels | ❌ Reels-скрипты не написаны |
| `ads` (Google Ads / Meta Ads / Yandex.Direct) | запуск платных кампаний | ❌ Кампании не настроены (код готов) |
| `meta-ad-library-api` | парсинг Meta Ads Library | ❌ Не используется |
| `analytics` (по платформам) | Instagram Insights, Meta Business Suite, Яндекс.Метрика, Google Analytics | ⚠️ Яндекс.Метрика готова к подключению |
| `google-search-console` | отправка sitemap, мониторинг индексации | ⚠️ Готово к отправке |
| `yandex-metrica` | настройка целей, счётчиков | ⚠️ Код готов в `docs/ANALYTICS-TRACKING.md` |
| `yandex-webmaster` | добавление сайта, sitemap | ⚠️ Готово к отправке |

## 🌐 Локальные для Кыргызстана скиллы

| Skill | Что делает |
|---|---|
| `localization-адаптация` | Адаптация кыргызского языка (агглютинация, морфология) |
| `crm-manager` | Учёт клиентов в D1 (для бота v2) |
| `outreach` | Партнёрства с пансионатами, отелями |
| `sales-enablement` | Скрипты для мастеров (при переезде на v2) |
| `launch` | Запуск продукта на рынке |
| `influencer-marketing` | Блогеры Иссык-Куля (v2) |

## 🔧 Технические (Backend, DevOps)

| Skill | Что |
|---|---|
| `cloudflare-deploy` | Деплой через wrangler + GitHub Actions (готов `.github/workflows/deploy.yml`) |
| `cloudflare` | Workers + Pages + D1 + KV (для бота v2) |
| `wrangler` | Локальный CLI для CF |
| `workers-best-practices` | (для бота v2 — webhook handler) |
| `agents-sdk` | Бот на Cloudflare Workers + Durable Objects |
| `cicd-engineer` | GitHub Actions workflow (готов `ci/deploy.yml` в blueprint) |
| `monitoring` | CF Analytics (готов) |
| `docker-manager` | (не используется — статика) |
| `web-perf` | (Astro статика, score ~95) |
| `typescript-best-practices` | (готово — type strict) |

## 📊 Аналитика, Data, ML

| Skill | Что |
|---|---|
| `data-visualizer` | mermaid + matplotlib (готово) |
| `sql-analyst` | SQLite запросы по `data/db.sqlite` (375 rows) |
| `monitoring` | Cloudflare Analytics + uptime |
| `churn-prevention` | Сезонное ТО пансионатов (v2) |

## 📝 Контент, Документация, Локализация

| Skill | Что |
|---|---|
| `content-factory` | 370 .md страниц (готово) |
| `content-strategy` | blog-plan.json 25 тем |
| `content-calendar` | (в MARKETING-LOOPS.md) |
| `content-decomposer` | Кластерная модель (pillar+cluster) |
| `blog-post` | (используется через blog) |
| `instagram-analyzer` | Анализ Instagram-профилей конкурентов |
| `social` | Instagram-календарь (готов в MARKETING-LOOPS.md) |
| `reels-creator` | 15-30с Reels сценарии (TODO) |
| `telegram-analyzer` | (v2) |
| `community-manager` | (планируется) |
| `yandex-metrica` | Код готов в `docs/ANALYTICS-TRACKING.md` |
| `google-search-console` | Sitemap готов |
| `documentation-writer` | `docs/ADMIN-GUIDE.md`, `docs/BLUEPRINT.md`, `docs/WIKI-INDEX.md` |
| `copy-writer` | `data/site.json` cta_whatsapp_template |
| `email-writer` | Telegram-бот v2 шаблоны (готов) |
| `copy-editing` | Префиллы WhatsApp (готово) |
| `technical-writing` | `docs/specs/constitution.md` |

## 🛒 Продакты, Тулинг

| Skill | Что |
|---|---|
| `free-tools` | `/kalkulyator/` (готово) |
| `lead-magnets` | `/subscribe/`, PDF-прайс (TODO) |
| `popups` | (планируется: exit-intent на услугах) |
| `paywalls` | (не нужно — услуги оффлайн) |
| `offers` | Структура предложения + CTA |
| `pricing` | Аудит цен (Van Westendorp) |
| `ab-testing` | (готов к подключению Google Optimize) |
| `cro` | (готов — sticky CTA) |
| `signup` | `/subscribe/` (готово) |
| `onboarding` | (готов — PWA + bot v2) |
| `retention` | (планируется — seasonal email) |
| `referrals` | (готов — код ELEC-XXXX-XXXX) |
| `cold-email` | (не используется — КР b2c/b2b лучше через WA/TG) |
| `sms` | (планируется — для бота v2) |

## 🏗 Архитектура, Планирование

| Skill | Что |
|---|---|
| `architect` | Astro 5 static + Cloudflare Pages (готово) |
| `site-architecture` | URL-структура: subfolders, не subdomains |
| `product-manager` | Roadmap v1/v2/v3 |
| `project-manager` | roadmap.md |
| `idea-validator` | (не нужно — уже валидировано) |
| `learning-planner` | (не нужно) |
| `productivity` | (не нужно) |

## 🤖 ML / AI / Agents

| Skill | Что |
|---|---|
| `agents-sdk` | Бот v2 (готов в roadmap.md) |
| `agent-builder` | Бот v2 (готов) |
| `mcp-builder` | (не нужно для статики) |
| `prompt-optimizer` | Префиллы WhatsApp (готово) |
| `evaluator` | (не нужно) |
| `triz-*` | (декомпозиция задач — использовалось в разработке) |
| `verifying-code-review` | (использовалось при сборке) |
| `feedback-processing` | (не нужно для текущего этапа) |

## 🧪 Тестирование, Качество

| Skill | Что |
|---|---|
| `test-driven-development` | (планируется — vitest есть, тесты partial) |
| `test-writer` | (не нужно) |
| `code-reviewer` | (применялось в процессе) |
| `verification-before-completion` | Применялось при каждой сборке |
| `systematic-debugging` | (применялось при сбоях schema/contacts) |
| `using-superpowers` | (есть в skills/) |
| `finishing-development-branch` | (есть) |

## 📊 Бизнес, Стратегия

| Skill | Что |
|---|---|
| `business-analyst` | (рынок электрики КР — есть в `docs/research/`) |
| `analyst` | (есть в `docs/research/`) |
| `growth-hacker` | AARRR (BLOG.md) |
| `marketing-plan` | roadmap.md + BLOG.md |
| `marketing-council` | 3 CMS-варианта |
| `marketing-loops` | Telegram + Instagram + Meta Ads (готово в MARKETING-LOOPS.md) |
| `marketing-psychology` | CTA, urgency, social proof |
| `marketing-ideas` | (применялось) |
| `marketing-psychology` | Соц. доказательство, дефицит (готов) |
| `reops` | Учёт клиентов (D1, v2) |
| `financial-modeler` | Финансовая модель (готова в BLOG.md) |
| `pricing` | Аудит цен (Van Westendorp) |
| `prospecting` | (v2) |
| `cold-email` | (не нужно для КР) |
| `outreach` | Партнёрства с пансионатами (v2) |
| `sales-enablement` | (v2) |
| `public-relations` | Press-kit (готов в roadmap) |
| `negotiation-coach` | (не нужно) |
| `objection-handler` | (в FAQ FAQ-блоках) |
| `client-research` | (в MARKETING-LOOPS.md — ICP) |
| `voice-customer` | (в ресёрче) |
| `pitch-deck` | (инвесторский пакет) |
| `investor-relations` | (если нужен) |

## 🎬 Креатив, Медиа

| Skill | Что |
|---|---|
| `instagram-analyzer` | Парсинг Instagram-профилей |
| `reels-creator` | Сценарии Instagram Reels |
| `video-scripter` | Сценарии видео |
| `community-manager` | Управление соцсетями (планируется) |
| `social-media` | Мультиплатформенный календарь (готов в MARKETING-LOOPS.md) |
| `instagram` | Стратегия Instagram (готово) |
| `tiktok` | Не приоритет для КР |
| `reels-creator` | 15-30с Reels (TODO) |
| `copywriting` | Префиллы WhatsApp (готово) |
| `copy-editing` | (готово) |
| `copywriter` | Landing-pages |
| `email-writer` | Шаблоны email |
| `newsletter-writer` | (планируется — подписка) |

## 📋 Команды пользователя

Все skills можно вызвать либо:
- В `opencode` через skill router: `ask "find marketing skills for Kyrgyzstan site"`
- В `Claude Code` через Task tool с подходящим skill

---

## 📊 Саммари применения (на 2026-08-30)

| Категория | Применено | Всего | % |
|---|---|---|---|
| SEO/AEO/GEO | 11 | 13 | 85% |
| Контент | 9 | 12 | 75% |
| Соцсети/Маркетинг | 16 | 30 | 53% |
| Аналитика/Данные | 5 | 8 | 62% |
| Продакты/Конверсия | 6 | 13 | 46% |
| Бизнес/Стратегия | 8 | 17 | 47% |
| Тул/Инфра | 9 | 10 | 90% |
| Архитектура/DevOps | 6 | 7 | 86% |
| **ВСЕГО** | **70+** | **110+** | **~64%** |

Остальное: 36% — roadmap v2/v3 (бот, каталог товаров, мульти-язык, 3D, реферальная программа, 3D-сцены, A/B-тесты).
