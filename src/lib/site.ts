import siteData from '../../data/site.json';
import categories from '../../data/categories.json';
import locations from '../../data/locations.json';
import tags from '../../data/tags.json';
import citationsJson from '../../data/citations.json';
import mastersJson from '../../data/masters.json';

export const site = siteData;
export { categories, locations, tags };
export const citations = Object.fromEntries(citationsJson.map((c) => [c.key, c])) as Record<string, { title: string; url: string; fact: string }>;
export const masters = mastersJson;
export const waLink = (service?: string) =>
  `${site.whatsapp}?text=${encodeURIComponent(service ? `Здравствуйте! Интересует услуга: ${service}. Подскажите стоимость и когда сможете приехать.` : 'Здравствуйте! Нужен электрик. Подскажите стоимость и когда сможете приехать.')}`;
