# MARKETING-TODO.md — План применения маркетинговых скиллов (Aug 2026)

## Применённые скиллы (выполнено)

| Скилл | Что сделано | Файл |
|---|---|---|
| programmatic-seo | 370 страниц (услуга×локация), анти-дорвей, hub-and-spoke | code, validate.mjs |
| content-factory | 370 .md страниц с 3000+ симв. | generate-content.mjs |
| seo-optimizer | title/desc/H1-4, JSON-LD | Base.astro, [svc].astro |
| ai-seo | llms.txt + llms-full.txt | generate-llms.mjs |
| landing-builder | CTA WhatsApp/Telegram, sticky bar | CtaButtons.astro |
| growth-hacker | AARRR воронка: Главная → Услуга → Калькулятор → WhatsApp → Заявка | docs/ANALYTICS-TRACKING.md |
| copywriter | префиллы WhatsApp | data/site.json, jsonld.ts |
| social | Telegram/WhatsApp (Yandex-метрика готова к подключению) | docs/ANALYTICS-TRACKING.md |
| site-architecture | URL: subfolders, не subdomains | data/, src/pages/ |
| schema | FAQPage, Service, HowTo, Review, AggregateRating, OfferCatalog, BreadcrumbList, WebSite, SearchAction, GeoCoordinates, ContactPoint | src/lib/jsonld.ts |
| seo-audit | validate.mjs: длина текста, лид, дубли, цитаты, FAQ, H1, anchors | scripts/validate.mjs |

## Частично применённые (нужно доработать)

| Скилл | Текущий статус | Что осталось |
|---|---|---|
| free-tools | `/kalkulyator/` живой, без лид-кэпчуры | Добавить email-форму (`/subscribe/`) → Telegram-бот |
| pricing | `data/services/*.json` с min/max, `/ceny/` со сводной таблицей | Аудит Van Westendorp: добавить «цена сомнений» (?), psychological pricing |
| content-strategy | 5 статей seed, blog-plan 25 тем | Кластерная модель: pillar+cluster (`docs/BLUEPRINT.md` §5) |
| offers | CTA с префиллом | Добавить value-stack: «диагностика бесплатно + гарантия 1 мес + скидка 15% первая заявка» |
| onboarding | `/subscribe/`, PWA, sticky CTA | Telegram-бот для приветственных сообщений |
| marketing-plan | roadmap.md, INDEX | AARRR, North Star: «…» |
| marketing-council | 3 CMS варианта, AI/SEO/JSON-LD | Нужен strategic memo: pricing/positioning/channels |
| referrals | roadmap v2 | Механизм: «приведи соседа — скидка 15%» |
| public-relations | roadmap v2 | Pitch в местные СМИ, HARO |
| product-marketing | /kalkulyator/ | ICP, positioning, launch checklist |
| cro | /kalkulyator/, /mastera/, sticky CTA | A/B-тест CTA-вариантов: «Пишу с сайта» vs «Срочный вызов 24/7» |
| data-visualizer | docs/ADMIN-GUIDE.md | mermaid в каждом блоге + WebPage |

## Не начато (низкий приоритет)

| Скилл | Сложность | Зачем |
|---|---|---|
| ab-testing | высокая | Нужен A/B-тест фреймворк (Google Optimize) — после 100+ уников/день |
| churn-prevention | средняя | Подписка на сезонное ТО |
| reops | высокая | Учёт клиентов в SQLite + CRM |
| cold-email | средняя | Скрипт рассылки пансионатам о предсезонном ТО |
| sms | средняя | SMS-уведомления о заявках (Турция/Кыргызстан) |

## Российские платформы (Яндекс + локальные)

| Платформа | Статус | Инструкция |
|---|---|---|
| Яндекс.Метрика | ⏳ Готов файл скрипта (`docs/ANALYTICS-TRACKING.md`) | Скопировать код с метрикой в `Base.astro` `<head>`, отправить Goals через Вебмастер |
| Яндекс.Вебмастер | ⏳ Готов | Отправить `sitemap-index.xml` после деплоя |
| Яндекс.Директ | ❌ Платно | Запуск рекламной кампании: ключи «электрик чолпон ата», «электрик бостри» |
| 2GIS | ❌ | Импорт `services.csv` + `locations.csv` → «Ремонт», «Электрика» категории |
| Яндекс.Карты | ❌ | Импорт `locations.json` с координатами |
| Dzen | ❌ | Текстовые статьи из блога |
| VK | ❌ | Текстовые посты из `marketing-loops` + статьи |
| Одноклассники | ❌ | (аудитория 50+) — пенсионеры = ремонтники домов |
| Habr | ❌ | Технические статьи (PWA, Astro) для PR среди разработчиков |
| Telegram | ✅ | Канал @realhikaz (готов) — оттуда получают CTA-префиллы |

## Социальные сети (по приоритету)

1. **Telegram** — основной канал: @realhikaz (готов, бот v2 в roadmap)
2. **WhatsApp Business** — каталог товаров (по запросам в WA)
3. **VK** — устаревший, но работает в СНГ
4. **OK** — для пенсионеров
5. **Dzen** — для статей + трафика
6. **2GIS/Yandex Maps** — для локального поиска
7. **Instagram** — не используется (Кыргызстан менее активен в Instagram чем в WA/OK)

## Чанк-план (как делать)

| Чанк | Включает | Срок | Приоритет |
|---|---|---|---|
| **#1** | Sitemap split run + Analytics tracking скрипт в Base + mobile menu | 1ч | ✅ Сделано |
| **#2** | Email-каптура + bot v2 webhook stub | 2ч | ⚠️ Сейчас |
| **#3** | Реальные отзывы механизм (data/reviews.json + schema) | 1ч | ⚠️ Сейчас |
| **#4** | Каталог товаров: data/catalog.csv + scripts/import-catalog.mjs | 3ч | ⏳ v3 |
| **#5** | Мульти-язык: KY страница /ky/uslugi/ + hreflang | 4ч | ⏳ v3 |
| **#6** | Three.js: 3D-сцена щитка | 6ч | ❌ Долго |
| **#7** | Graph.js + mermaid в отчётах | 1ч | ⚠️ Сейчас |
| **#8** | Telegram-бот: webhook + D1 + приветствие | 3ч | ⏳ v2 |
| **#9** | VK/Telegram посты: marketing-loops skill | 2ч | ⚠️ Сейчас |
| **#10** | Яндекс.Метрика + Вебмастер + Директ | 1ч | ⚠️ Сейчас |

---

*Этот файл — карта применения 50+ навыков. Используется для планирования и трекинга чанков.*
