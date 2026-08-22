#!/usr/bin/env node
// Пайплайн блога: фетчит источники из data/blog-plan.json (status: todo),
// сохраняет сырьё в docs/research/fetched/ и создаёт черновик статьи для рерайта.
// Запуск: npm run fetch-blog [-- slug]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-plan.json'), 'utf8'));
const only = process.argv[2];
const FETCH_DIR = path.join(ROOT, 'docs', 'research', 'fetched');
fs.mkdirSync(FETCH_DIR, { recursive: true });

const todo = plan.topics.filter(t => t.status === 'todo' && (!only || t.slug === only));
if (!todo.length) { console.log('Нет тем со status:todo' + (only ? ` для "${only}"` : '')); process.exit(0); }

for (const topic of todo) {
  const dir = path.join(FETCH_DIR, topic.slug);
  fs.mkdirSync(dir, { recursive: true });
  for (const url of topic.sources) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (research bot; contact @realhikaz)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/&nbsp;/g, ' ').trim();
      fs.writeFileSync(path.join(dir, new URL(url).hostname.replace(/\./g, '_') + '.txt'),
        `SOURCE: ${url}\nFETCHED: ${new Date().toISOString()}\n\n${text.slice(0, 50000)}`);
      console.log(`✓ fetched ${url} → ${topic.slug}`);
    } catch (e) {
      console.log(`✗ ${url}: ${e.message}`);
    }
  }
  // Черновик с инструкцией рерайта под SEO/GEO/AEO
  const draft = `---
title: "${topic.title}"
description: ""
h1: ""
lead: ""
type: "blog"
slug: "${topic.slug}"
date: "${new Date().toISOString().slice(0, 10)}"
keyword: "${topic.keyword}"
citations: []
status: draft
---

<!-- РЕРАЙТ-ИНСТРУКЦИЯ (конституция проекта):
1. Ответ на запрос «${topic.keyword}» — в первых 100 символах лида, с цифрой.
2. Тело ≥3000 символов, H2/H3, минимум 1 таблица, 1 список.
3. FAQ 4–6 вопросов → frontmatter faq.
4. Цитаты только из data/citations.json + источники выше (docs/research/fetched/${topic.slug}/).
5. Не копировать текст источников — переписать своими словами, добавить локальный контекст Иссык-Куля.
6. CTA WhatsApp/Telegram в конце.
СЫРЬЁ: docs/research/fetched/${topic.slug}/
-->
`;
  fs.writeFileSync(path.join(ROOT, 'content', 'blog', topic.slug + '.md'), draft);
  console.log(`→ draft: content/blog/${topic.slug}.md`);
}
process.exit(0);
