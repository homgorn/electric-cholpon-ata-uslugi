#!/usr/bin/env node
// Split sitemap-index.xml into type-specific sitemap files for larger crawl budget control
import fs from 'node:fs';
import path from 'node:path';

const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap-index.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const urlRe = /(https?:\/\/[^<]+)\/(?:(uslugi\/[^\/]+\/[^\/]+\/)|(zamena[^\/]+-v-[^\/]+\/)|([\w-]+-v-[\w-]+\/)|([\w-]+\/))?/g;
const types = { service: [], geo: [], location: [], tag: [], category: [], blog: [], static: [], other: [] };
const seen = new Set();

let match;
while ((match = urlRe.exec(sitemapContent)) !== null) {
  const url = match[1];
  const pathPart = url.replace('https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev/', '');
  if (seen.has(url)) continue; seen.add(url);
  if (pathPart.startsWith('uslugi/') && pathPart.includes('/')) types.service.push(url);
  else if (pathPart.includes('-v-')) types.geo.push(url);
  else if (pathPart.startsWith('lokacii/')) types.location.push(url);
  else if (pathPart.startsWith('tagi/')) types.tag.push(url);
  else if (pathPart.startsWith('uslugi/') && !pathPart.includes('/')) types.category.push(url);
  else if (pathPart.startsWith('blog/')) types.blog.push(url);
  else if (pathPart === '' || pathPart === '/') types.static.push(url);
  else types.other.push(url);
}

const out = path.join(process.cwd(), 'public', 'sitemaps');
fs.mkdirSync(out, { recursive: true });

const writeSitemap = (name, urls) => {
  if (urls.length === 0) return;
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(out, name), xml);
  console.log(`${name}: ${urls.length}`);
};

writeSitemap('sitemap-services.xml', types.service);
writeSitemap('sitemap-geo.xml', types.geo);
writeSitemap('sitemap-locations.xml', types.location);
writeSitemap('sitemap-tags.xml', types.tag);
writeSitemap('sitemap-blog.xml', types.blog);
writeSitemap('sitemap-categories.xml', types.category);
console.log('Split sitemap complete:', out);
