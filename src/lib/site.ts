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
export const waLink = (service?: string, pageUrl?: string) => {
  const msg = service
    ? `Здравствуйте! Пишу с сайта ${site.url.replace('https://','')}, страница: «${service}». Можно узнать подробнее?`
    : `Здравствуйте! Пишу с сайта ${site.url.replace('https://','')}. Нужен электрик — подскажите по стоимости и срокам.`;
  return `${site.whatsapp}?text=${encodeURIComponent(msg)}`;
};
export const mailtoLink = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const SITE_EMAIL = site.email;
