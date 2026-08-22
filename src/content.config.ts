import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fmBase = z.object({
  title: z.string(), description: z.string(), h1: z.string(),
  lead: z.string().optional(), type: z.string(), slug: z.string(),
  updated: z.string().optional(), date: z.string().optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  citations: z.array(z.string()).optional(), tags: z.array(z.string()).optional(),
  keyword: z.string().optional(),
});

export const collections = {
  services: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/services' }),
    schema: fmBase.extend({
      category: z.string(), category_name: z.string().optional(),
      price_min: z.coerce.number(), price_max: z.coerce.number(), unit: z.string(), time: z.string(),
    }),
  }),
  geo: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/geo' }),
    schema: fmBase.extend({
      service_slug: z.string(), location_slug: z.string(),
      price_min: z.coerce.number(), price_max: z.coerce.number(), unit: z.string(), time: z.string(),
      distance_km: z.coerce.number(), travel_fee: z.coerce.number(),
    }),
  }),
  locations: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/locations' }),
    schema: fmBase.extend({ name: z.string(), distance_km: z.coerce.number(), travel_fee: z.coerce.number(), zone: z.string().optional() }),
  }),
  categories: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/categories' }),
    schema: fmBase.extend({ services: z.array(z.string()).default([]) }),
  }),
  tags: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/tags' }),
    schema: fmBase.extend({ services: z.array(z.string()).default([]) }),
  }),
  blog: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/blog' }),
    schema: fmBase,
  }),
};
