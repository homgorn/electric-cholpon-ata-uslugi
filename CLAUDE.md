# CLAUDE.md — контекст проекта «Электрик Чолпон-Ата»

## Суть
Programmatic SEO/AEO/GEO сайт услуг электрика: Чолпон-Ата + 32 села Иссык-Куля до 95 км.
85 услуг, 224 гео-лендинга, блог, каталог мастеров. Деплой: Cloudflare Pages.

## Тип
dev (контентная платформа) · Домен: местные услуги / электромонтаж

## Ключевые правила (см. docs/specs/constitution.md)
1. Ответ на запрос в первых 100 символах лида, с цифрой
2. Тело страницы ≥3000 символов (валидатор блокирует сборку)
3. Контакты ТОЛЬКО в data/site.json; цены в data/services/*.json
4. Каждая страница = лендинг с CTA WhatsApp (префилл услуги) + Telegram
5. .md-версия каждой страницы в public/md/ + llms.txt + llms-full.txt
6. Цитаты только из data/citations.json

## Команды
```bash
npm run gen        # генерация content/** + public/md/** из data/*.json
npm run llms       # llms.txt + llms-full.txt
npm run validate   # QA-гейт конституции
npm run db         # SQLite из JSON (node --experimental-sqlite)
npm run export     # exports/*.csv + bundle.json для внешних сервисов
npm run build      # gen + llms + astro build + validate --postbuild
npm run deploy     # wrangler pages deploy dist
npm run fetch-blog # пайплайн блога: фетч источников → черновики
```

## Архитектура (кратко)
data/*.json → scripts/generate-content.mjs → content/**/*.md → Astro (static) → dist/
Гео-страницы: 7 приоритетных услуг × 32 села, seeded random против doorway-фильтров.

## Статус
✅ E0–E8 v1 собраны: 383 HTML-страницы, валидация зелёная.
➡ Следующий шаг: деплой на Cloudflare Pages + заполнение masters.json + бот (roadmap.md).

## Важно для агентов
- После изменения data/ ВСЕГДА: npm run gen && npm run llms && npm run db && npm run export
- Скрипты CLI завершаются process.exit(0); библиотека pools.mjs НЕ должна его содержать
- Склонение НП: поле pre в locations.json («Семёновке», «Чолпон-Ате»)
- Дубли title/H1 запрещены — validate.mjs проверяет автоматически
