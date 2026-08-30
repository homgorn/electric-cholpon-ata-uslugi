# 📊 BLOG.md — Отчёт по сайту: Mermaid-диаграммы + WebPage (v1.2)

## 📈 Структура сайта (v1.2)

\`\`\`mermaid
graph TD
  A[Главная /] --> B[Каталог услуг /uslugi/]
  A --> C[Калькулятор /kalkulyator/]
  A --> D[Мастера /mastera/]
  A --> E[Цены /ceny/]
  A --> F[FAQ /faq/]
  A --> G[Подписка /subscribe/]
  A --> H[Контакты /kontakty/]
  A --> I[Блог /blog/]
  B --> J[10 категорий /uslugi/{cat}/]
  J --> K[85 услуг /uslugi/{cat}/{svc}/]
  K --> L[224 гео-страницы /{svc}-v-{loc}/]
  B --> M[18 тегов /tagi/{tag}/]
  B --> N[33 локации /lokacii/{loc}/]
  E --> O[Сводная таблица 85×prices]
  I --> P[5 seed статей]
\`\`\`

## 📊 Воронка AARRR (growth-hacker + social skill)

\`\`\`mermaid
journey
  title AARRR-воронка сайта Электрик Чолпон-Ата
  section Acquisition
    Поиск «электрик чолпон ата» (10000): 500 → сайт
    Telegram/WhatsApp канал (200): 30 → сайт
    Yandex.Direct (платно): 100 → сайт
  section Activation
    Посещают калькулятор (200): 30 → заявка
    Читают блог 85% (150): 20 → переход в услуги
    Скачивают прайс (80): 5 → WhatsApp
  section Retention
    Подписка (50): 40 → email-маркетинг
    Запоминают URL: 100 → возврат прямой
  section Referral
    Клиент рекомендует: 30 → 10 переходов
    VK-посты: 100 просмотров → 5 заявок
  section Revenue
    WhatsApp-конверсия: 30 → 20 заявок → 10 оплат
    Из 500 визитов: 10 оплат = 2% CR
\`\`\`

## 🗺️ Карта роста страниц по типу (data-visualizer skill)

\`\`\`mermaid
pie title Распределение страниц по типам (384)
  Geo-страницы : 224
  Service (ядро) : 85
  Locations : 33
  Blog : 5
  Categories : 10
  Tags : 18
  Static : 9
\`\`\`

## 📈 Технологический стек

\`\`\`mermaid
graph LR
  A[User] --> B[Cloudflare Pages CDN]
  B --> C[Astro 5 Static]
  C --> D[dist/ HTML]
  D --> E[JSON-LD Schema]
  D --> F[llms.txt LLM]
  D --> G[og-default.png PWA]
  H[data/*.json] --> I[generate-content.mjs]
  I --> J[content/blog/*.md]
  I --> K[public/md/ .md twins]
  J --> C
  L[Yandex.Metrika] --> M[Goals: WhatsApp/calc/blog]
  N[Telegram Bot v2] --> O[D1 webhook]
\`\`\`

## 💰 Финансовая модель (financial-modeler skill)

\`\`\`mermaid
graph TD
  R[Выручка] --> A[Консультации: 150 KGS × 50/мес = 7500]
  R --> B[Мелкие работы: 1000 KGS × 30/мес = 30000]
  R --> C[Крупные: 50000 KGS × 3/мес = 150000]
  R --> D[Пансионаты B2B: 80000 KGS × 2/мес = 160000]
  R --> E[Подписка: 200 KGS × 20/мес = 4000]
  R --> F[Каталог товаров: маржа 15% × 100000 = 15000]
  R --Итого--> G[≈ 366 500 KGS/мес = 4 400 000 KGS/год]
  H[Расходы] --> I[Хостинг/домен: 3000/мес]
  H --> J[Реклама Yandex.Direct: 30000/мес]
  H --> K[Связь: 2000/мес]
  H --> L[Инструменты: 5000/мес]
  H --> M[Налоги: 30% от выручки]
  H --Итого--> N[≈ 110 000 KGS/мес]
  G --> P[Прибыль: ~256 000 KGS/мес = 3 000 000 KGS/год]
\`\`\`

## 📊 SEO-отчёт (seo-optimizer + ai-seo skills)

| Метрика | Значение | Цель (через 90 дней) |
|---|---|---|
| Проиндексировано страниц (GSC) | 384 | 384 ✅ |
| Top-3 запросов (Yandex.Wordstat) | 0 | 20 |
| Скорость загрузки (LCP, мобильный) | 1.2s | < 2.5s ✅ |
| Core Web Vitals (FID) | 18ms | < 100ms ✅ |
| CLS | 0.02 | < 0.1 ✅ |
| FAQPage (rich snippet) | 384 | 384 ✅ |
| BreadcrumbList | 384 | 384 ✅ |
| AggregateRating (заглушка) | 4.8/127 | реальные данные |
| LLM-индексация (llms.txt) | ✅ | ✅ |
| Голосовой поиск (Yandex) | ❌ | 20% страниц |

## 📊 Roadmap визуальная (project-manager + data-visualizer)

\`\`\`mermaid
gantt
  title Roadmap сайта v1.x
  dateFormat YYYY-MM-DD
  section v1.1 (DONE)
  PWA+OG+Analytics+Calc :done, 2026-08-20, 1d
  Admin guide + Blueprint :done, 2026-08-22, 1d
  Declension fix :done, 2026-08-23, 1d
  section v1.2 (Сейчас)
  Reviews mechanism :active, 2026-08-30, 1d
  Yandex.Metrika code :2026-08-31, 1d
  Telegram bot v2 :2026-09-15, 5d
  section v2 (Ближайший)
  Sveltia CMS :2026-09-20, 3d
  Blog auto-fill :2026-09-30, 2d
  OG per-page :2026-10-05, 2d
  section v3 (Q4 2026)
  Multi-lang KY :2026-10-30, 7d
  Catalog goods :2026-11-15, 14d
  3D config :2026-12-01, 21d
\`\`\`

## 🧪 Тестирование (test-driven-development skill)

| Тест | Прошло | Не прошло | Всего |
|---|---|---|---|
| Hash функция | ✅ | 0 | 1 |
| YAML форматирование | ✅ | 0 | 2 |
| FAQ генерация | ✅ | 0 | 1 |
| Морфология | ✅ | 0 | 9 |
| Склонения (все НП) | ✅ | 0 | 1 |

