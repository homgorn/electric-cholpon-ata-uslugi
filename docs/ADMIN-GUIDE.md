# Sveltia CMS Config — Catalog Blueprint Admin
# Copy this file to public/admin/config.yml
# Access admin at: https://your-site/admin/

backend:
  name: github
  repo: homgorn/electric-cholpon-ata-uslugi  # CHANGE to your repo
  branch: main
  auth_endpoint: auth  # Netlify Identity (optional); or use GitHub OAuth
  # For GitHub OAuth (simplest):
  # 1. Create GitHub OAuth App: https://github.com/settings/developers
  # 2. Authorization callback URL: https://your-site/admin/
  # 3. Set Client ID / Client Secret in site config

media_folder: public/img
public_folder: /img

collections:
  # ====== СЛУЖБИ (основной каталог) ======
  - name: services
    label: Услуги электрика
    folder: content/services
    # Each file in folder = one service category (provoda.json etc.)
    # Each file has array of service objects
    create: false
    # We edit the JSON source directly; admin shows structured form per service
    fields:
      - label: "Категория (slug)"
        name: category_slug
        widget: hidden
      - label: "Название услуги"
        name: name
        widget: string
      - label: "Генитив (склонение)"
        name: name_gen
        widget: string
      - label: "Минимальная цена (сом)"
        name: price_min
        widget: number
      - label: "Максимальная цена (сом)"
        name: price_max
        widget: number
      - label: "Единица"
        name: unit
        widget: select
        options: ["точка", "шт", "метр", "м²", "объект", "контур", "выезд", "час", "система", "комплект"]
      - label: "Время работы"
        name: time
        widget: string
      - label: "Теги (slugs через запятую)"
        name: tags
        widget: list
      - label: "Гео-приоритет (генерирует 32 страницы)"
        name: geo_priority
        widget: boolean
      - label: "Что входит (массив)"
        name: includes
        widget: list
      - label: "Этапы работы (массив)"
        name: steps
        widget: list
      - label: "Когда вызывать (массив)"
        name: symptoms
        widget: list

  # ====== БЛОГ ======
  - name: blog
    label: Статьи
    folder: content/blog
    create: true
    slug: "{{slug}}"
    fields:
      - label: Заголовок
        name: title
        widget: string
        required: true
      - label: Описание (SEO, ≤165 симв.)
        name: description
        widget: text
        required: true
      - label: H1
        name: h1
        widget: string
        required: true
      - label: Лид-ответ (первые 100 симв., содержит цифру)
        name: lead
        widget: text
        required: true
      - label: Slug
        name: slug
        widget: string
        required: true
      - label: Дата
        name: date
        widget: datetime
        required: true
      - label: Ключевое слово
        name: keyword
        widget: string
        required: true
      - label: Цитаты (ключи из citations.json)
        name: citations
        widget: list
      - label: FAQ (массив Q/A для JSON-LD)
        name: faq
        widget: list
        fields:
          - { label: Вопрос, name: q, widget: text, required: true }
          - { label: Ответ, name: a, widget: text, required: true }
      - label: Тело статьи (markdown)
        name: body
        widget: markdown
        required: true
      - label: Статус
        name: status
        widget: hidden
        default: published

  # ====== МАСТЕРА ======
  - name: masters
    label: Мастера
    files:
      - file: data/masters.json
        label: Каталог исполнителей
        name: data
        widget: object
        fields:
          - label: Статус
            name: status
            widget: select
            options: ["todo", "active"]
            default: "todo"
          - label: Имя
            name: name
            widget: string
            required: true
          - label: Специализации (slugs)
            name: specialties
            widget: list
          - label: Зоны выезда (slugs локаций)
            name: areas
            widget: list
          - label: Телефон
            name: phone
            widget: string
          - label: WhatsApp
            name: whatsapp
            widget: string
          - label: Telegram
            name: telegram
            widget: string
          - label: Рейтинг (0–5)
            name: rating
            widget: number
          - label: Выполнено работ (число)
            name: jobs_done
            widget: number
          - label: Опыт (лет)
            name: experience_years
            widget: number
          - label: Биография
            name: bio
            widget: text

  # ====== ЛОКАЦИИ ======
  - name: locations
    label: Локации
    folder: data/locations
    # Мы используем JSON-источник правды; для простоты — ручная правка файла
    create: false

  # ====== ЦИТАТЫ ======
  - name: citations
    label: Источники цитат
    files:
      - file: data/citations.json
        label: Цитаты
        name: citations
        widget: object

  # ====== КАТЕГОРИИ (только чтение) ======
  - name: categories
    label: Категории
    folder: content/categories
    fields:
      - label: Название
        name: name
        widget: string
      - label: Slug
        name: slug
        widget: hidden
      - label: H1
        name: h1
        widget: string
      - label: Описание
        name: description
        widget: text
      - label: Текст страницы
        name: body
        widget: markdown
        required: true
    create: false

  # ====== ТЕГИ (только чтение) ======
  - name: tags
    label: Теги
    folder: content/tags
    fields:
      - label: Название
        name: name
        widget: string
      - label: Slug
        name: slug
        widget: hidden
      - label: Описание
        name: description
        widget: text
      - label: Текст страницы
        name: body
        widget: markdown
        required: true
    create: false

local_backend: true
media_folder: public/img/uploads

collections:
  services: data/services
  blog: data/blog-plan.json  # Структура контент-плана, не .md страниц
```

### 2. Подключи GitHub OAuth (для визуального редактирования через Sveltia)
1. `https://github.com/settings/developers` → OAuth Apps → New OAuth App
2. **Homepage URL**: `https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev/`
3. **Authorization callback URL**: `https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev/admin/`
4. Скопируй **Client ID** и **Client Secret** в `public/admin/config.yml` (секция `oauth_provider` или `backend` в зависимости от CMS)
5. **В GitHub Secrets репо** добавь: `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` (если через GitHub Actions нужен доступ)

### 3. Открой админку
`https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev/admin/` (после настройки OAuth)

---

## ⚠️ Правило «Один FAQPage» (конституция)
- `<Faq faq={faq} />` компонент: ТОЛЬКО отображение (без JSON-LD)
- FAQPage добавляется через `jsonld={[faqLd(...), breadcrumbsLd(...), webSiteLd()]}` в `.astro`
- Проверка: `grep -o '"@type":"FAQPage"' dist/page/index.html | wc -l` = **1** на каждой странице
- Если >1: найден дубликат → исправь в `FaqBlock.astro` или в `.astro` странице

---

## 📊 Калькулятор сметы (конверсия)
Страница `/kalkulyator/` содержит:
- Данные услуг из `data/services/*.json` (через сериализацию в `<script id="calc-data">`)
- Селект района с `travel_fee`
- Живой итог `min`–`max` из БД
- Три кнопки результата:
  1. **WhatsApp** с префиллом: «Здравствуйте! Пишу с сайта X. Страница: «{услуга}». Можно узнать подробнее?»
  2. **Почта** (`mailto:refertur@yandex.ru`) с полной сметой
  3. **Копировать в буфер**
- Без внешних зависимостей (vanilla JS)
- Добавлен в футер сайта (колонка «Категории» или «Информация» — в текущей сборке: в навигации через `CategoryNav` компонент)

---

## 🔄 Пайплайн блога под нишу (программный)
`docs/research/fetched/` — сырьё с источников (`fetch-blog.mjs`).
`data/blog-plan.json` — 25+ тем, каждая: slug, title, keyword, sources[] (URL для фетча), status.
Пайплайн:
```bash
npm run fetch-blog     # скачивает raw → docs/research/fetched/
# Ручной или LLM-рирайт: docs/research/fetched/{slug}/ → content/blog/{slug}.md
npm run gen             # перегенерирует llms.txt + .md версии
npm run validate        # QA-ворота
npm run build           # сборка
```
Каждая статья: `lead ≤100 симв.` с цифрой, ≥3000 симв., таблица или алгоритм, FAQ 4+, цитаты из `data/citations.json`, CTA WhatsApp с префиллом статьи, Article JSON-LD (`datePublished`, `keywords`, `image`).

---

## 🌍 Масштабирование: разные города, страны, языки

### Новый город (без копирования всего репо)
```bash
# Добавить в data/locations.json строку с обязательным pre:
# {"slug":"kokshetau","name":"Кокшетау","pre":"Кокшетау","distance_km":...}
# Перегенерировать: npm run gen && npm run build
```

### Новый язык (KY / EN / TR)
```bash
# 1. Добавить в astro.config.mjs: locales или отдельные страницы в /ky/
# 2. Создать data/i18n/*.json — переводы категорий/услуг
# 3. Добавить hreflang-теги в Base.astro (уже готово в заглушке)
# 4. Дублировать content/blog/ и content/services/ или генерировать из i18n-пулов
```

### Новая ниша (например сантехник)
```bash
cp -r docs/research/RESEARCH-services.md docs/research/RESEARCH-plumber.md
# Править: таксономия услуг → data/services/*.json → npm run gen → deploy
```

---

## 🧩 Три варианта админки

| Вариант | Как | Затраты | Когда |
|---|---|---|---|
| **A. GitHub web** | Открыть репо → карандаш у `data/services/*.json` или `data/blog-plan.json` → Commit | 0 | Сейчас работает |
| **B. Sveltia CMS** (`docs/ADMIN-GUIDE.md` §Админка) | `public/admin/config.yml` + GitHub OAuth → визуальные формы | 1 вечер | Когда рутинно |
| **C. Telegram-бот** (`docs/roadmap.md` v2) | Webhook на `/api/webhook/` (Worker) → D1 → уведомление владельцу + изменение `data/masters.json` или заявки | 2 вечера | После заполнения мастеров |

---

## 📈 Что осталось (post-v1.1, roadmap)

- [ ] **Деплой** (токен готов — `npm run deploy` или Actions с секретами `CLOUDFLARE_API_TOKEN` и `CLOUDFLARE_ACCOUNT_ID`)
- [ ] **Мастера**: заполнить `data/masters.json` (`status: todo` → `active`) — уже готов для ручной правки или Sveltia
- [ ] **Отзывы**: заменить AggregateRating/Review заглушки на реальные данные (`docs/research/fetched/` или форма сбора)
- [ ] **Блог автоматизация**: `npm run fetch-blog` по cron (GitHub Actions) для наполнения `data/blog-plan.json` → черновики → публикация
- [ ] **Каталог электрики (PWA v3)**: CSV (`SKU, name, price, photo, spec_json`) → `scripts/import-catalog.mjs` → Product JSON-LD (`docs/BLUEPRINT.md` §6.1)
- [ ] **Мульти-язык (KY)**: `data/i18n/ky.json` + маршруты `/ky/` (`docs/BLUEPRINT.md` §8)
- [ ] **3D-конфигуратор**: Three.js через CDN + WebGL-сцена (`docs/BLUEPRINT.md` §6.8)
- [ ] **Мапа объектов**: `public/img/uploads/` (фото мастеров, работ) + R2 для хранения (необязательный)

---

*ADMIN-GUIDE v1.2 · Aug 2026 · готов для любого нового проекта из `catalog-blueprint/`*

---

## 📊 Отзывы: как заменить заглушку на реальные (v1.2 post-deploy)

### Текущий механизм (заглушка в коде):
- `AggregateRating`: 4.8 / 127 отзывов — **ЗАГЛУШКА** (нужно заменить на реальные данные)
- 2 фиктивных отзыва в `jsonld.ts` (`reviewsSchema`)
- После первых 10+ реальных клиентов:
  1. Собрать отзывы через форму `/mastera/` или Telegram-бот
  2. Сохранить в `data/reviews.json`
  3. Обновить `AggregateRating` в `jsonld.ts`: `ratingValue`, `reviewCount`
  4. Заменить `reviewsSchema` массив на реальные данные
  5. Пересобрать сайт (`npm run build`)

### Форма сбора (готовый компонент для встраивания в /mastera/ или /faq/):
- Email или Telegram → `data/reviews.json` → скрипт обновляет AggregateRating
- Пример структуры отзыва:
```json
{"author":"Аскар","rating":5,"text":"Приехал быстро, всё качественно.","date":"2026-08-25","verified":true}
```
