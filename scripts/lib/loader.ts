// scripts/lib/loader.ts — Load all data/*.json files
import { GeneratorInput, SiteConfig, Category, Location, Tag, Citation, Service, MastersData, BlogPlan, PoolTemplates } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POOLS_FILE = path.join(process.cwd(), 'data/pools/pools.json');

export async function loadInputData(): Promise<GeneratorInput> {
  const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));

  const site = readJson<SiteConfig>('site.json');
  const categories = readJson<Category[]>('categories.json');
  const locations = readJson<Location[]>('locations.json');
  const tags = readJson<Tag[]>('tags.json');
  const citations = readJson<Citation[]>('citations.json');
  const masters = readJson<MastersData>('masters.json');
  const blogPlan = readJson<BlogPlan>('blog-plan.json');
  const pools = readJson<PoolTemplates>(POOLS_FILE);

  // Load services from category files
  const servicesDir = path.join(DATA_DIR, 'services');
  const services: any[] = [];
  if (fs.existsSync(servicesDir)) {
    for (const file of fs.readdirSync(servicesDir)) {
      if (file.endsWith('.json')) {
        const svcs = readJson<any[]>(`services/${file}`);
        services.push(...svcs);
      }
    }
  }

  return { site, categories, locations, tags, citations, services, masters, blogPlan, pools };
}