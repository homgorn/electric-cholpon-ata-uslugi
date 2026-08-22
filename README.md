# ⚡ Электрик Чолпон-Ата — услуги электрика на Иссык-Куле

Programmatic SEO/AEO/GEO сайт: **85 услуг** × **36 населённых пунктов** Иссык-Кульской области (Чолпон-Ата, Бостери, Тамчы, Корумду, Ананьево, Григорьевка, Балыкчы, Каракол и др.), блог, каталог мастеров.

**Live**: https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev

## Что внутри

| Раздел | URL | Страниц |
|---|---|---|
| Услуги-ядро | `/uslugi/[категория]/[услуга]/` | 85 |
| Гео-лендинги | `/[услуга]-v-[село]/` | 210 |
| Локации-хабы | `/lokacii/[локация]/` | 36 |
| Категории | `/uslugi/[категория]/` | 10 |
| Теги | `/tagi/[тег]/` | 18 |
| Блог | `/blog/[статья]/` | 10+ |
| Прайс, мастера, FAQ | `/ceny/`, `/mastera/`, `/faq/` | 6 |

## Оптимизация под нейронки (AEO/GEO)

- Прямой ответ на запрос в первых 100 символах каждой страницы
- `FAQPage` + `Service` + `Electrician` + `BreadcrumbList` JSON-LD везде
- Markdown-версия каждой страницы: `/md/[путь].md`, агрегаты `/llms.txt`, `/llms-full.txt`
- robots.txt открыт для GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot
- Цитаты трастовых источников (ПУЭ, Нацстат КР, локальные прайсы) со ссылками

## Стек

Astro 5 (static) → Cloudflare Pages. Данные: `data/*.json` → SQLite (`data/db.sqlite`) → экспорт CSV/JSON.

```bash
npm install
npm run build     # генерация контента + сборка + QA-валидация
npm run deploy    # wrangler pages deploy
```

## Документация

- `docs/brief.md`, `docs/prd.md`, `docs/architecture.md` — BMAD-артефакты
- `docs/specs/` — конституция качества (Spec Kit): контент, SEO/AEO/GEO, данные
- `docs/research/` — ресёрч цен, услуг, локаций, конкурентов с источниками
- `docs/roadmap.md` — TODO: Telegram-бот, домен, каталог мастеров, пайплайн блога

## Контакты

Telegram [@realhikaz](https://t.me/realhikaz) · WhatsApp [+7996555707267](https://wa.me/7996555707267)
