// scripts/lib/validator.ts — QA validation with strict types
import { PageFrontmatter } from './types.js';
import { valiLogger } from './logger.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export interface ValidationResult {
  pagesChecked: number;
  warnings: string[];
  errors: string[];
}

interface ValidationOptions {
  root: string;
  postbuild: boolean;
}

const ROOT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export async function validateAll(opts: ValidationOptions): Promise<ValidationResult> {
  const { root = ROOT_DIR, postbuild = false } = opts;
  const errors: string[] = [];
  const warnings: string[] = [];
  let pagesChecked = 0;

  const parseFm = (src: string): { fm: Partial<PageFrontmatter>; body: string } => {
    const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
    if (!m) return { fm: {}, body: src };
    const raw = m[1];
    const fm: Partial<PageFrontmatter> = {};
    const scalar = (k: string) => new RegExp(`^${k}: "(.*)"`, 'm').exec(raw)?.[1] ?? '';
    for (const k of ['title', 'description', 'h1', 'lead', 'type', 'slug', 'category', 'category_name', 'date', 'keyword', 'updated', 'unit', 'time'])
      fm[k] = scalar(k);
    for (const k of ['price_min', 'price_max', 'distance_km', 'travel_fee']) fm[k] = Number(scalar(k)) || undefined;
    for (const k of ['tags', 'citations', 'services']) {
      const block = new RegExp(`^${k}:\\n((?:  - ".*"\\n?)*)`, 'm').exec(raw)?.[1] ?? '';
      fm[k] = [...block.matchAll(/  - "(.*)"/g)].map(x => x[1]);
    }
    fm.faq = [...raw.matchAll(/  - q: "([^"]+)"\n\s*a: "([^"]+)"/g)].map(x => ({ q: x[1], a: x[2] }));
    return { fm, body: src.slice(m[0].length) };
  };

  function checkFile(file: string) {
    const src = fs.readFileSync(file, 'utf8');
    const { fm, body } = parseFm(src);
    pagesChecked++;
    const rel = path.relative(root, file);

    // Constitution: body length for landings
    if (['service', 'geo', 'location'].includes(fm.type || '') && body.length < 3000)
      errors.push(`${rel}: body ${body.length} < 3000 chars`);

    // Constitution: lead answer with digit in first 100 chars
    const landing = ['service', 'geo', 'location'].includes(fm.type || '');
    if (landing) {
      if (!fm.lead) errors.push(`${rel}: no lead`);
      else {
        const first100 = String(fm.lead).slice(0, 100);
        if (!/\d{2,}/.test(first100)) errors.push(`${rel}: lead first 100 chars missing digit`);
      }
    }

    // Title/description checks
    if (!fm.title) errors.push(`${rel}: no title`);
    else if (fm.title && fm.title.length > 70) warnings.push(`${rel}: title ${fm.title.length} chars (>70)`);
    if (!fm.description) errors.push(`${rel}: no description`);
    else if (fm.description && (fm.description.length < 80 || fm.description.length > 175))
      warnings.push(`${rel}: description ${String(fm.description).length} chars`);

    // FAQ minimum for landings
    if (landing && (!Array.isArray(fm.faq) || fm.faq.length < 3))
      errors.push(`${rel}: FAQ < 3`);

    // Citations minimum
    if (landing && (!Array.isArray(fm.citations) || fm.citations.length < 2))
      errors.push(`${rel}: citations < 2`);

    // H1 presence
    if (!body.includes('# ') && !fm.h1) errors.push(`${rel}: no H1`);

    // CTA presence on landings
    if (['service', 'geo', 'location', 'category'].includes(fm.type || '') && !body.includes('wa.me'))
      errors.push(`${rel}: missing WhatsApp CTA`);

    // JSON-LD presence (at least one script tag)
    if (landing && !body.includes('application/ld+json'))
      errors.push(`${rel}: missing JSON-LD`);
  }

  function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) checkFile(p);
    }
  }
  walk(path.join(root, 'content'));

  // Duplicate titles check
  const titles = new Map<string, number>();
  function collectTitles(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) collectTitles(p);
      else if (e.name.endsWith('.md')) {
        const t = /title: "(.+)"/.exec(fs.readFileSync(p, 'utf8'))?.[1];
        if (t) titles.set(t, (titles.get(t) ?? 0) + 1);
      }
    }
  }
  collectTitles(path.join(root, 'content'));
  for (const [t, n] of titles) if (n > 1) errors.push(`Duplicate title (${n}x): ${t}`);

  // Post-build checks
  if (postbuild) {
    const dist = path.join(root, 'dist');
    if (fs.existsSync(dist)) {
      for (const f of ['robots.txt', 'llms.txt', 'llms-full.txt']) {
        if (!fs.existsSync(path.join(dist, f))) errors.push(`dist/${f} missing`);
      }
      if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) errors.push('dist/sitemap-index.xml missing');
    } else warnings.push('dist/ not found — skipping postbuild checks');
  }

  valiLogger.info({ pagesChecked, warnings: warnings.length, errors: errors.length }, 'Validation complete');
  return { pagesChecked, warnings, errors };
}