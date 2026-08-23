// scripts/lib/types.ts — TypeScript types for the catalog generator

export interface SiteConfig {
  brand: string;
  domain_note: string;
  url: string;
  city: string;
  region: string;
  region_short: string;
  phone_display: string;
  phone_raw: string;
  whatsapp: string;
  telegram: string;
  work_hours: string;
  eta_city: string;
  cta_whatsapp_template: string;
  geo_radius_km: number;
  founder: string;
  experience_years: number;
}

export interface Category {
  slug: string;
  name: string;
  h1: string;
  icon?: string;
  description: string;
}

export interface Location {
  slug: string;
  name: string;
  distance_km: number;
  travel_fee: number;
  zone: 'city' | 'core' | 'mid' | 'far' | 'extended';
  population?: number;
  coords?: [number, number];
  facts: string[];
  pre: string; // prepositional case: "в Чолпон-Ате"
}

export interface Tag {
  slug: string;
  name: string;
  description: string;
}

export interface Citation {
  key: string;
  title: string;
  url: string;
  fact: string;
}

export interface Service {
  slug: string;
  name: string;
  name_gen: string; // genitive case
  category: string;
  price_min: number;
  price_max: number;
  unit: string;
  time: string;
  tags: string[];
  geo_priority: boolean;
  includes: string[];
  steps: string[];
  symptoms: string[];
}

export interface Master {
  id: number;
  name: string;
  status: 'todo' | 'active';
  phone: string;
  whatsapp: string;
  telegram: string;
  rating: number;
  jobs_done: number;
  experience_years: number;
  specialties: string[];
  areas: string[];
  bio: string;
}

export interface BlogTopic {
  slug: string;
  title: string;
  keyword: string;
  sources: string[];
  status: 'todo' | 'fetched' | 'draft' | 'published';
}

export interface BlogPlan {
  note: string;
  pipeline: string[];
  topics: BlogTopic[];
}

export interface MastersData {
  note: string;
  apply_cta: string;
  masters: Master[];
}

export interface GeneratorInput {
  site: SiteConfig;
  categories: Category[];
  locations: Location[];
  tags: Tag[];
  citations: Citation[];
  services: Service[];
  masters: MastersData;
  blogPlan: BlogPlan;
}

export interface PageFrontmatter {
  title: string;
  description: string;
  h1: string;
  lead: string;
  type: 'service' | 'geo' | 'location' | 'category' | 'tag' | 'blog';
  slug: string;
  category?: string;
  category_name?: string;
  service_slug?: string;
  location_slug?: string;
  price_min?: number;
  price_max?: number;
  unit?: string;
  time?: string;
  tags?: string[];
  faq: Array<{ q: string; a: string }>;
  citations: string[];
  updated: string;
  date?: string;
  keyword?: string;
  name?: string;
  distance_km?: number;
  travel_fee?: number;
  zone?: string;
  coords?: [number, number];
  services?: string[];
  name_gen?: string;
}

export interface GeneratedPage {
  relPath: string;
  frontmatter: PageFrontmatter;
  body: string;
  chars: number;
}

export interface GenerationReport {
  date: string;
  total_pages: number;
  under_3000: number;
  avg_chars: number;
  breakdown: {
    services: number;
    geo: number;
    locations: number;
    categories: number;
    tags: number;
    blog: number;
  };
}

export interface PoolTemplates {
  LEAD_TEMPLATES: string[];
  PRICE_INTRO: string[];
  WHY_US_POOL: string[];
  REGION_BLOCKS: Array<{ title: string; paras: string[] }>;
  GUARANTEE_PARAS: string[];
  SAFETY_PARA: string[];
  FAQ_VARIANTS: {
    price_q: string[];
    price_a: string[];
    eta_q: string[];
    eta_a: string[];
    warranty_q: string[];
    warranty_a: string[];
    urgent_q: string[];
    urgent_a: string[];
    pay_q: string[];
    pay_a: string[];
  };
  CTA_TEXTS: string[];
  ETA_BY_ZONE: Record<string, string>;
  BISHKEK_MIN_BY_CATEGORY: Record<string, number>;
  CURRENCY: string;
}

export interface MorphologyResult {
  prepositional: string; // "в Чолпон-Ате"
  accusativeUnit: string; // "за точку"
}

export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
  child: (bindings: Record<string, unknown>) => Logger;
}