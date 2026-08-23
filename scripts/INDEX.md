# Индекс: scripts/

Обновлено: 2026-08-23. Все CLI завершаются process.exit(0).

| Скрипт | Назначение |
|---|---|
| generate-content.mjs | data/*.json → content/**/*.md + public/md/** (370 стр.) |
| generate-llms.mjs | llms.txt + llms-full.txt (2.3 MB) |
| validate.mjs | QA-гейт: ≥3000 симв., лид≤100 симв. с цифрой, дубли title |
| build-db.mjs | SQLite: services+locations+tags+masters+citations+**pages**(375) |
| export.mjs | exports/*.csv + bundle.json |
| fetch-blog.mjs | фетч источников по blog-plan.json → черновики статей |
| lib/types.ts | TypeScript типы всех сущностей |
| lib/generator.ts | чистые функции генератора (seeded random, builders) |
| lib/morphology.ts | русское склонение: getPrepositional, getAccusativeUnit |
| lib/logger.ts | pino-логгер (без pino-pretty в тестах) |
| lib/loader.ts | загрузка data/*.json |
| lib/validator.ts | валидатор конституции |
| __tests__/ | vitest тесты |
