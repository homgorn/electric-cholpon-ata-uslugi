# 📖 РУКОВОДСТВО ВЛАДЕЛЬЦА — Электрик Чолпон-Ата

> Всё, что нужно для самостоятельной работы с сайтом. Печатайте эту страницу и держите под рукой.

---

## 🎯 30-секундное резюме

Сайт — это **статический генератор**: вы правите файлы в папке `data/`, запускаете одну команду, и сайт пересобирается целиком (383 страницы). Админки как таковой нет — вместо неё **JSON-файлы + Telegram**. Это быстрее, надёжнее и бесплатнее любой CMS.

```
data/*.json  →  npm run build  →  dist/  →  Cloudflare Pages (авто)
   ↑ правите вы        ↑ одна команда         ↑ деплой за ~20 сек
```

---

## ⚡ Ежедневные операции

### Изменить цену услуги
1. Открой `data/services/{категория}.json`
2. Найди услугу по `"slug"` (например `zamena-rozetki`)
3. Правь `price_min` / `price_max`
4. Выполни:

```bash
npm run gen && npm run llms && npm run db && npm run export
git add -A && git commit -m "цены: замена розетки" && git push
```

GitHub Actions задеплоит автоматически (~2 мин). Или локально: `npm run deploy`.

### Добавить мастера в каталог
1. Открой `data/masters.json`
2. Заполни карточку и поменяй `"status": "todo"` → `"status": "active"`
3. Пересобери (команды выше)

### Поменять телефон/контакты (ВСЕ 383 страницы сразу)
1. Открой `data/site.json` — единственное место с контактами
2. Поменяй `phone_raw`, `phone_display`, `whatsapp`, `telegram`
3. Пересобери

### Добавить новую услугу
1. Создай запись в нужном файле `data/services/*.json`:

```json
{
  "slug": "ustanovka-rozetki-na-verande",
  "name": "Установка розетки на веранде",
  "name_gen": "установки розетки на веранде",
  "category": "rozetki-vyklyuchateli",
  "price_min": 500,
  "price_max": 1200,
  "unit": "точка",
  "time": "40–90 минут",
  "tags": ["rozetki", "dom-dacha"],
  "geo_priority": false,
  "includes": ["Монтаж влагозащищённой розетки", "Герметизация ввода кабеля", "Проверка УЗО"],
  "steps": ["Осмотр места", "Прокладка кабеля", "Монтаж розетки", "Тест"],
  "symptoms": ["Нужна розетка на улице", "Старая розетка залилась дождём"]
}
```

2. Хочешь гео-страницы по всем сёлам? → `"geo_priority": true` (+32 страницы автоматически)
3. Пересобери.

### Добавить блог-статью
Вариант А (вручную): создай `content/blog/my-article.md` с frontmatter:
```yaml
---
title: "Заголовок статьи"
description: "Описание до 160 символов"
h1: "H1 статьи"
lead: "Ответ на запрос в первых 100 символах"
type: "blog"
slug: "my-article"
date: "2026-08-23"
keyword: "целевой запрос"
citations: ["pue"]
---
Текст статьи ≥3000 символов...
```

Вариант Б (пайплайн): добавь тему в `data/blog-plan.json` со статусом `todo`, затем:
```bash
npm run fetch-blog              # скачает источники, создаст черновик
# отредактируй content/blog/*.md (убери status: draft)
npm run build
```

⚠️ Черновики с `status: draft` или пустым `h1` НЕ публикуются (фильтр в blog/[slug].astro).

---

## 📊 Шпаргалка команд

| Команда | Что делает |
|---|---|
| `npm run gen` | data/*.json → content/**/*.md (370 страниц) |
| `npm run llms` | llms.txt + llms-full.txt для нейросетей |
| `npm run db` | SQLite база из JSON |
| `npm run export` | exports/*.csv + bundle.json для внешних сервисов |
| `npm run validate` | QA-гейт: длина текстов, лиды, дубли title |
| `npm run build` | всё вместе + Astro сборка (≈60 сек) |
| `npm run deploy` | задеплоить dist на Cloudflare Pages |
| `npm run dev` | локальный сервер http://localhost:4321 |
| `npm test` | unit-тесты генератора |

**Золотое правило:** после ЛЮБОГО изменения в `data/`:
```bash
npm run build && git add -A && git commit -m "..." && git push
```

---

## 🛠 Админка: есть? Как сделать?

### Сейчас (v1): «Админка через Git» ✅ работает уже сегодня
- Редактирование = правка JSON в любом редакторе (или через github.com прямо в браузере!)
- GitHub web-интерфейс: открываешь repo → карандашик у файла → правишь → Commit → сайт переезжает через 2 минуты. Это уже готовая бесплатная админка без кода.

### Вариант 2: Decap CMS (бывшая Netlify CMS) — бесплатно, 1 вечер
Настоящая визуальная админка поверх Git-репозитория:

1. `npm install decap-cms` не нужен — достаточно одного файла `public/admin/index.html`:
```html
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script></head>
<body><script>
CMS.init({
  config: {
    backend: { name: 'github', repo: 'ВАШ_ЛОГИН/electric-cholpon-ata-uslugi', branch: 'main' },
    media_folder: 'public/img', public_folder: '/img',
    collections: [
      { name: 'services', label: 'Услуги', folder: 'content/services', create: true, extension: 'json',
        fields: [
          { label: 'Данные', name: 'body', widget: 'code' }
        ]},
      { name: 'blog', label: 'Блог', folder: 'content/blog', create: true,
        fields: [
          { label: 'Title', name: 'title' },
          { label: 'Description', name: 'description', widget: 'text' },
          { label: 'H1', name: 'h1' },
          { label: 'Lead', name: 'lead', widget: 'text' },
          { label: 'Type', name: 'type', default: 'blog', widget: 'hidden' },
          { label: 'Slug', name: 'slug' },
          { label: 'Дата', name: 'date', widget: 'datetime' },
          { label: 'Keyword', name: 'keyword' },
          { label: 'Текст', name: 'body', widget: 'markdown' },
        ]},
      { name: 'masters', label: 'Мастера', files: [{ file: 'data/masters.json',
        fields: [{ label: 'JSON', name: 'data', widget: 'code' }] }]},
    ],
  },
});
</script></body></html>
```

2. OAuth: зарегистрируй GitHub OAuth App (callback `https://your-domain.netlify.com/`) и подключи бесплатный Netlify Identity ИЛИ используй бэкенд `github` с personal token.
3. Открой `https://сайт/admin/` — редактируешь услуги и блог в формах, сохранение = коммит = автодеплой.

### Вариант 3: Pages CMS / Sveltia CMS (современнее)
[sveltia-cms](https://github.com/sveltia/sveltia-cms) — drop-in замена Decap с красивым UI, совместима с той же конфигурацией. Просто меняешь URL скрипта.

### Вариант 4: Своя админка на Cloudflare Workers + D1 (v3 roadmap)
Telegram-бот приёма заявок + мини-панель заявок на Worker'е — план описан в `docs/roadmap.md`.

**Рекомендация:** начни с GitHub web-редактора (0 затрат), когда надоест — поставь Sveltia CMS (1 вечер).

---

## ❓ FAQ владельца

**Q: Сайт упал после моих правок.**
A: `npm run validate` покажет конкретную страницу и причину (обычно <3000 символов или нет цифры в лиде). Исправь → пересобери.

**Q: Как поменять структуру текста на всех страницах услуг?**
A: Правки в `scripts/generate-content.mjs` (шаблон body) и `data/pools/pools.json` (варианты абзацев) → `npm run gen`.

**Q: Как добавить новое село?**
A: Добавь запись в `data/locations.json` (не забудь поле `pre` — склонение!). Для 7 приоритетных услуг автоматически появятся 7 новых страниц.

**Q: Как посмотреть сайт до публикации?**
A: `npm run dev` → http://localhost:4321

**Q: Где посмотреть статистику?**
A: После запуска подключи Яндекс.Метрику/GA4 в `Base.astro` (сниппет перед `</head>`) + Search Console отправь `/sitemap-index.xml`.

---

## 🧮 Калькулятор сметы (v1.1)
Страница `/kalkulyator/`: клиент выбирает услуги + количество → живой итог → отправка в WhatsApp / на refertur@yandex.ru.
- Цены берутся из data/services/*.json при сборке — правите цены в данных, калькулятор обновляется сам
- Район выезда добавляет надбавку автоматически
- Изменить текст заявки: `src/pages/kalkulyator.astro`, блок `<script>` внизу

## ☎️ Контакты v1.1
- Телефон/WhatsApp: **+996 555 707 267** (был ошибочный +7…)
- Почта для заявок: **refertur@yandex.ru** (в футере и калькуляторе)
- Префилл WhatsApp: «Пишу с сайта …, страница: «…». Можно узнать подробнее?»

## ⚠️ Технические правила (не ломать!)
1. FAQPage JSON-LD — ровно один на страницу (FaqBlock только показывает)
2. OG-картинка — PNG (`public/og-default.png`), перегенерация: `node scripts/make-og.mjs`
3. Mermaid: блоки ```` ```mermaid ```` в статьях рендерятся сами
4. INDEX.md не класть в content/blog/ — попадает в коллекцию
