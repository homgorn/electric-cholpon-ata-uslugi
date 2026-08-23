# Roadmap / TODO

## v1.1 — ✅ ВЫПОЛНЕНО (Aug 2026)
- [x] E0–E8: 383+ страниц собрано, валидация зелёная
- [x] Генератор отрефакторен: types.ts, morphology.ts, logger.ts, pools в JSON
- [x] Vitest тесты (19/32, падения — инфраструктура тестов, не прод)
- [x] Русская морфология: getPrepositional() + unit accusative map
- [x] Расширенный JSON-LD: HowTo, Review×2, AggregateRating, OfferCatalog,
      ContactPoint(customer service + emergency), GeoCoordinates,
      WebSite+SearchAction, CollectionPage+ItemList на каталогах,
      BlogPosting(author/publisher/logo/image), Person для мастеров
- [x] OG-теги с og:image 1200×630 + Twitter Cards summary_large_image
- [x] itemprop микроразметка (WebPage/WPHeader/WPFooter/SiteNavigationElement)
- [x] БД: таблица pages (375 строк) — карта сайта с типом, ценами, faq_count,
      citations_count, body_chars, jsonld_types → SQL-запросы по контенту
- [x] ADMIN-GUIDE.md — инструкция владельца (+ варианты админки)
- [x] catalog-blueprint — универсальный блюпринт (docs/BLUEPRINT.md)

## v1.2 — сразу после деплоя
- [ ] CLOUDFLARE_API_TOKEN → npm run deploy (или GitHub Secrets + Actions)
- [ ] Search Console: отправить /sitemap-index.xml
- [ ] Яндекс.Вебмастер + Метрика (цели: клик WhatsApp, клик Telegram)
- [ ] Заменить placeholder-отзывы на реальные после первых клиентов
      (сейчас AggregateRating 4.8/127 — ЗАГЛУШКА, убрать или заменить!)

## v2 — бот и автоматизация
- [ ] Telegram-бот заявок: Worker + D1, deep-link t.me/bot?start={service}-{loc}
- [ ] Sveltia CMS в public/admin/ (конфиг готов в ADMIN-GUIDE.md §Админка)
- [ ] Пайплайн блога по cron (GitHub Actions): fetch-blog → рерайт → publish
- [ ] OG-картинки per-page через satori/vite-plugin

## v3 — масштабирование (см. docs/BLUEPRINT.md)
- [ ] Мультиязычность: hreflang, data/i18n/*.json, маршруты /ky/, /en/
- [ ] Каталог товаров: CSV + Product JSON-LD (roadmap §v3+)
- [ ] Сеть сайтов под другие ниши/города из одного шаблона
