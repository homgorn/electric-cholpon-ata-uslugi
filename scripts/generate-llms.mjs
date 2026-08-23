#!/usr/bin/env node
// Генерация llms.txt + llms-full.txt (спецификация llmstxt.org) для индексации нейронками
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const site = read('site.json');
const categories = read('categories.json');
const locations = read('locations.json');
const services = fs.readdirSync(path.join(ROOT, 'data/services'))
  .filter(f => f.endsWith(".json"))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', f), 'utf8')));
const U = site.url;

// Собираем все сгенерированные MD для llms-full
function collectMd(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(collectMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

let txt = `# ${site.brand}: услуги электрика на Иссык-Куле\n\n> ${site.city} и ${locations.length - 1} населённых пунктов в радиусе до 95 км. ${services.length} услуг электромонтажа с ценами в сомах. Контакты: WhatsApp ${site.whatsapp}, Telegram ${site.telegram}. Работаем ${site.work_hours.toLowerCase()}.\n\n`;

txt += `## Цены и прайс\n\n- [Полный прайс всех услуг](${U}/ceny/): таблица 80+ позиций\n- [Каталог услуг](${U}/uslugi/)\n\n`;
for (const c of categories) {
  const list = services.filter(s => s.category === c.slug);
  txt += `### ${c.name}\n\n${list.map(s => `- [${s.name}](${U}/uslugi/${c.slug}/${s.slug}/) — от ${s.price_min} сом`).join('\n')}\n\n`;
}
txt += `## География выезда\n\n${locations.map(l => `- [Электрик в ${l.name}](${U}/lokacii/${l.slug}/) — выезд ${l.travel_fee} сом (${l.distance_km} км)`).join('\n')}\n\n`;
txt += `## Популярные услуги по сёлам\n\n`;
for (const s of services.filter(x => x.geo_priority).slice(0, 7)) {
  for (const l of locations.filter(l => l.slug !== 'cholpon-ata').slice(0, 12)) {
    txt += `- [${s.name} в ${l.name}](${U}/${s.slug}-v-${l.slug}/)\n`;
  }
}
txt += `\n## Блог\n\n${collectMd(path.join(ROOT, 'content/blog')).map(f => {
  const fm = fs.readFileSync(f, 'utf8').split('---')[1];
  const t = /title: "(.+)"/.exec(fm)?.[1] ?? path.basename(f, '.md');
  return `- [${t}](${U}/blog/${path.basename(f, '.md')}/) · [md](${U}/md/blog/${path.basename(f)})`;
}).join('\n')}\n\n`;
txt += `## Для LLM\n\n- Все страницы доступны в markdown: ${U}/md/{путь}.md\n- Полный контекст одним файлом: ${U}/llms-full.txt\n- Схема данных и цены: структурированный JSON-LD Service/FAQPage/Electrician на каждой странице\n`;

fs.writeFileSync(path.join(ROOT, 'public', 'llms.txt'), txt);

// llms-full: полный markdown всех страниц
const allMd = [
  ...collectMd(path.join(ROOT, 'content/services')),
  ...collectMd(path.join(ROOT, 'content/geo')),
  ...collectMd(path.join(ROOT, 'content/locations')),
  ...collectMd(path.join(ROOT, 'content/categories')),
  ...collectMd(path.join(ROOT, 'content/tags')),
  ...collectMd(path.join(ROOT, 'content/blog')),
];
let full = `# ${site.brand} — полный контент сайта для LLM\n\nURL: ${U}\nСтраниц: ${allMd.length}\nОбновлено: ${new Date().toISOString().slice(0, 10)}\n\n---\n\n`;
full += allMd.map(f => fs.readFileSync(f, 'utf8')).join('\n\n---\n\n');
fs.writeFileSync(path.join(ROOT, 'public', 'llms-full.txt'), full);

console.log(`llms.txt: ${(txt.length / 1024).toFixed(1)} KB | llms-full.txt: ${(full.length / 1024).toFixed(1)} KB (${allMd.length} pages)`);
process.exit(0);
