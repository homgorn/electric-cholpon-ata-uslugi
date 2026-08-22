# Roadmap / TODO

## v1 (текущая сборка)
- [x] E0 скелет репы
- [x] E1 research: услуги, цены, локации, конкуренты, источники
- [x] E2 docs + data
- [x] E3 генератор контента: 370 страниц + 13 статичных = 383 HTML
- [x] E4 Astro сайт (JSON-LD, sitemap, robots, llms.txt, md-версии)
- [x] E5 каталог мастеров — каркас /mastera/ с набором кандидатов
- [x] E6 QA валидатор: validate.mjs зелёный на 375 страницах
- [ ] E7 деплой: код готов (deploy.yml), нужен CLOUDFLARE_API_TOKEN → npm run deploy
- [x] E8 экспорт базы: db.sqlite + exports/*.csv + bundle.json

## v1.1 — после запуска
- [ ] Купить домен (.kg или .com), 301 с pages.dev, поменять SITE_URL
- [ ] Заменить контакты в data/site.json (одна точка правды)
- [ ] Заполнить data/masters.json реальными исполнителями (имя, тел, WA, рейтинг, зоны)
- [ ] Search Console + Яндекс.Вебмастер, отправка sitemap
- [ ] Яндекс.Метрика / GA4 (события кликов WhatsApp/Telegram)

## v2 — бот и автоматизация
- [ ] Telegram-бот приёма заявок: кнопка «Заказать» → бот с выбором услуги/НП/фото
      (webhook на Cloudflare Worker, очередь заявок, уведомление @realhikaz)
- [ ] Все CTA сайта переключить на бота (deep-link t.me/bot?start=service_slug-location)
- [ ] Пайплайн блога: scripts/fetch-blog.mjs фетчит источники из blog-plan.json →
      research/fetched/ → рерайт под SEO/GEO/AEO → content/blog/
- [ ] Автопубликация по расписанию (GitHub Actions cron)

## v3 — масштабирование
- [ ] Экспорт базы в другие сервисы (npm run export): каталоги, карты, маркетплейсы
- [ ] Кыргызская версия топ-20 страниц
- [ ] Отзывы клиентов (JSON-LD Review) после первых 20 заказов
- [ ] Фотоотчёты работ (R2 + оптимизация)

## v3+ — каталог электрики (товары)
- [ ] Каталог электротоваров: розетки, автоматы, кабель, светильники, УЗО и т.д.
- [ ] Формат данных: CSV с полями (sku, name, category, brand, price_kgs, unit,
      stock, photo_url_1..N, description, specs JSON) + ссылки на фотографии
- [ ] Объём большой — грузить чанками через npm script import-catalog.mjs
- [ ] Страницы товаров /katalog/[категория]/[товар]/ + Product JSON-LD + цены в сомах
- [ ] Перелинковка услуга → нужные товары («для замены розетки понадобится…»)
- [ ] Источник CSV вести в Google Sheets → экспорт → импорт в data/catalog.csv
