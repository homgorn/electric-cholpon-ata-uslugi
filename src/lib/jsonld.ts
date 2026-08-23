import { site } from './site';

// ============================================
// Core Business Schemas
// ============================================

export const electricianLd = (areaServed: string[]) => ({
  '@type': ['LocalBusiness', 'Electrician'],
  '@id': site.url + '#electrician',
  name: site.brand,
  description: 'Электромонтажные работы в ' + site.city + ' и сёлах ' + site.region_short + ': проводка, розетки, щиты, освещение, бойлеры. Гарантия 12 месяцев.',
  url: site.url,
  telephone: site.phone_raw,
  priceRange: '150–138000 KGS',
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'KG' },
  geo: { '@type': 'GeoCoordinates', latitude: 42.6492, longitude: 77.0839 },
  areaServed: areaServed.map((n) => ({ '@type': 'Place', name: n })),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '08:00',
    closes: '22:00',
  },
  sameAs: [site.telegram, site.whatsapp],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: site.phone_raw,
    contactType: 'customer service',
    availableLanguage: ['Russian', 'Kyrgyz'],
    hoursAvailable: 'Mo-Su 08:00-22:00',
  },
});

export const faqLd = (faq: Array<{ q: string; a: string }>) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceLd = (opts: { name: string; description: string; min: number; max: number; unit: string; area: string }) => ({
  '@type': 'Service',
  serviceType: opts.name,
  description: opts.description,
  provider: { '@id': site.url + '#electrician' },
  areaServed: { '@type': 'Place', name: opts.area },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'KGS',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: opts.min,
      maxPrice: opts.max,
      priceCurrency: 'KGS',
      unitText: opts.unit,
    },
  },
});

export const breadcrumbsLd = (items: Array<{ name: string; url?: string }>) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((b, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: b.name,
    ...(b.url ? { item: site.url + b.url } : {}),
  })),
});

export const articleLd = (opts: { title: string; description: string; date: string; slug: string; keyword: string }) => ({
  '@type': 'BlogPosting',
  headline: opts.title,
  description: opts.description,
  datePublished: opts.date,
  dateModified: opts.date,
  keywords: opts.keyword,
  author: { '@type': 'Person', name: site.founder },
  publisher: { '@id': site.url + '#electrician' },
  mainEntityOfPage: site.url + '/blog/' + opts.slug + '/',
});

// ============================================
// Enhanced Schema Types
// ============================================

export const collectionPageLd = (opts: { name: string; description: string; url: string; mainEntity: object }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: opts.name,
  description: opts.description,
  url: site.url + opts.url,
  mainEntity: opts.mainEntity,
});

export const itemListLd = (items: object[]) => ({
  '@type': 'ItemList',
  itemListElement: items,
});

export const howToLd = (steps: Array<{ name: string; text: string }>, name: string, description: string, totalTime?: string) => ({
  '@type': 'HowTo',
  name,
  description,
  totalTime,
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

export const reviewAggregateLd = (ratingValue: number, reviewCount: number) => ({
  '@type': 'AggregateRating',
  ratingValue: String(ratingValue),
  reviewCount: String(reviewCount),
  bestRating: '5',
  worstRating: '1',
});

export const reviewLd = (authorName: string, ratingValue: number, reviewBody: string, datePublished: string) => ({
  '@type': 'Review',
  author: { '@type': 'Person', name: authorName },
  reviewRating: { '@type': 'Rating', ratingValue, bestRating: '5' },
  reviewBody,
  datePublished,
});

export const webSiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': site.url + '#website',
  url: site.url,
  name: site.brand,
  description: site.brand + ' — электромонтажные услуги в ' + site.city + ' и сёлах ' + site.region_short,
  publisher: { '@id': site.url + '#electrician' },
  inLanguage: 'ru',
});

export const webPageLd = (url: string, name: string, description: string, breadcrumbs?: Array<{ name: string; url?: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url: site.url + url,
  name,
  description,
  isPartOf: { '@id': site.url + '#website' },
  breadcrumb: breadcrumbs ? breadcrumbsLd(breadcrumbs) : undefined,
  inLanguage: 'ru-RU',
});

export const contactPageLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      name: 'Контакты',
      description: 'Связаться с электриком ' + site.city + ': WhatsApp ' + site.phone_display + ', Telegram @realhikaz. Режим ' + site.work_hours + '.',
      url: site.url + '/kontakty/',
      isPartOf: { '@id': site.url + '#website' },
    },
    electricianLd([site.city]),
  ],
});
