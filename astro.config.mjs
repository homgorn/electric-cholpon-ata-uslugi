import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Домен: пока Cloudflare Pages subdomain. При покупке домена — поменять site + canonical.
const SITE = process.env.SITE_URL || 'https://uslugi-electrica-cholpon-ata-issyk-kol.pages.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // .md версии для нейронок не включаем в XML sitemap
      filter: (page) => !page.endsWith('.md'),
    }),
  ],
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
