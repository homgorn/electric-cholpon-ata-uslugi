# PRD: Электрик Чолпон-Ата

## FR — функциональные требования

### FR1 Контентная матрица
- FR1.1: 85 страниц услуг `/uslugi/[cat]/[service]/` — лендинги с CTA
- FR1.2: 210 гео-страниц `/[service]-v-[location]/` для 6 приоритетных услуг × 35 сёл
- FR1.3: 36 локаций-хабов `/lokacii/[location]/` со списком услуг и выездом
- FR1.4: 10 категорий `/uslugi/[cat]/`, 18 тегов `/tagi/[tag]/`
- FR1.5: блог `/blog/` — 10 seed-статей + контент-план 30 тем (`data/blog-plan.json`)
- FR1.6: прайс `/ceny/` (полная таблица), FAQ `/faq/`, мастера `/mastera/`, контакты, о нас

### FR2 SEO/AEO/GEO стандарты (см. specs/spec-seo-aeo-geo.md)
- FR2.1: title ≤65 симв. с ключом; description 120–165 с ключом и ценой
- FR2.2: прямой ответ на запрос в первых 100 символах после H1
- FR2.3: тело страницы ≥3000 символов; H1–H4; таблица цен; списки; FAQ 4–6
- FR2.4: JSON-LD: Service + FAQPage + Electrician(LocalBusiness) + BreadcrumbList (+Article в блоге)
- FR2.5: цитаты источников (≥2 на страницу услуг) со ссылками из data/citations.json
- FR2.6: .md-версия каждой страницы `/md/[путь].md`; `/llms.txt`, `/llms-full.txt`
- FR2.7: robots.txt открыт для GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot; sitemap.xml

### FR3 CTA и лидогенерация
- FR3.1: WhatsApp-кнопка с префиллом текста конкретной услуги на каждой странице
- FR3.2: Telegram-кнопка; sticky CTA-бар на мобильных
- FR3.3: контакты задаются ТОЛЬКО в data/site.json (замена в одном месте)

### FR4 Данные и экспорт
- FR4.1: источник правды — data/*.json; SQLite-сборка `npm run db`
- FR4.2: экспорт CSV/JSON/XLSX-ready `npm run export` (для будущих сервисов)

## NFR
- NFR1: статический вывод Astro, 0 JS-рантайм кроме инлайн-скриптов; LCP < 1.8s
- NFR2: сборка < 60 сек на 400+ страницах
- NFR3: детерминированная генерация (seeded random) — rebuild не меняет URL/тексты хаотично
- NFR4: анти-doorway: уникальный лид, локальные факты, рандомизация блоков, ≥3000 символов
- NFR5: валидатор блокирует деплой при нарушении конституции

## Эпики
E0 скелет ✅ · E1 research ✅ · E2 docs+data · E3 генератор · E4 сайт · E5 мастера · E6 QA · E7 deploy · E8 export

## Вне скоупа v1
Telegram-бот приёма заявок (roadmap), кыргызская версия, отзывы/рейтинги, оплата онлайн.
