#!/usr/bin/env node
// Additional quality checks: orphan pages + readability approximation
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const errors = [];
const warnings = [];

// Orphan page check: find all internal links in pages and check which URLs are not linked
function checkOrphans() {
  const pages = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.md')) {
        const src = fs.readFileSync(p, 'utf8');
        const fmMatch = /^---\n([\s\S]*?)\n---\n/.exec(src);
        const fmRaw = fmMatch ? fmMatch[1] : '';
        const slugMatch = /slug: "(.+)"/.exec(fmRaw);
        const typeMatch = /type: "(.+)"/.exec(fmRaw);
        const slug = slugMatch ? slugMatch[1] : path.basename(p, '.md');
        const type = typeMatch ? typeMatch[1] : 'other';
        pages.push({ file: path.relative(ROOT, p), slug, type, body: src.slice((fmMatch ? fmMatch[0].length : 0)) });
      }
    }
  }
  walk(path.join(ROOT, 'content'));

  const allUrls = new Set(pages.map(p => {
    const match = p.file.match(/(uslugi|geo|lokacii|tagi|categories|blog)\//);
    return match ? '/' + p.slug + '/' : '/' + p.slug + '/';
  }));

  const linkedUrls = new Set();
  for (const p of pages) {
    const links = [...p.body.matchAll(/href="([^"]+)"/g)].map(x => x[1]);
    for (const l of links) {
      const clean = l.replace(/#.*$/, '').replace(/\.md$/, '').replace(/\/$/, '');
      if (clean) linkedUrls.add(clean);
    }
  }

  const orphans = [...allUrls].filter(u => !linkedUrls.has(u.replace(/\/$/, '')));
  if (orphans.length > 0) {
    warnings.push(`Orphan pages (no internal links): ${orphans.slice(0, 5).join(', ')}... (${orphans.length} total)`);
  }
  console.log(`Quality: ${pages.length} pages, ${orphans.length} orphans, ${linkedUrls.size} linked URLs`);
  return { pagesChecked: pages.length, warnings, errors, orphans: orphans.length };
}

function checkReadability() {
  const MIN_PARAGRAPH_LENGTH = 60; // chars per paragraph (approximate Russian)
  const MAX_LENGTH = 3000;
  let shortParas = 0;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.md')) {
        const src = fs.readFileSync(p, 'utf8');
        const fmMatch = /^---\n([\s\S]*?)\n---\n/.exec(src);
        const body = src.slice(fmMatch ? fmMatch[0].length : 0);
        const paragraphs = body.split(/\n\n+/).filter(x => x.trim().length > 20);
        for (const para of paragraphs) {
          if (para.length < MIN_PARAGRAPH_LENGTH && !para.startsWith('##') && !para.startsWith('- ')) {
            shortParas++;
            // Only warn if there are many short paragraphs
          }
        }
      }
    }
  }
  walk(path.join(ROOT, 'content'));
  console.log(`Readability: short paragraphs (<${MIN_PARAGRAPH_LENGTH} chars): ${shortParas}`);
}

const result = checkOrphans();
checkReadability();
console.log('Quality check complete:', result);
