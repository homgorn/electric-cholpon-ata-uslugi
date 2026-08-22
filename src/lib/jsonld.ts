import { site } from './site';
export const electricianLd = (areaServed: string[]) => ({
  '@type': 'Electrician',
  '@id': '#electrician',
  name: 'Электрик Чолпон-Ата — услуги электрика',
  description: 'Электромонтажные работы в Чолпон-Ате и сёлах Иссык-Кульской области: проводка, розетки, щиты, освещение, бойлеры. Гарантия 12 месяцев.',
  url: site.url,
  telephone: site.phone_raw,
  priceRange: '150–138000 KGS',
  address: { '@type': 'PostalAddress', addressLocality: 'Чолпон-Ата', addressRegion: 'Иссык-Кульская область', addressCountry: 'KG' },
  areaServed: areaServed.map((n) => ({ '@type': 'Place', name: n })),
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '08:00', closes: '22:00' },
  sameAs: [site.telegram, site.whatsapp],
});

export const faqLd = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceLd = ({ name, description, min, max, unit, area }) => ({
  '@type': 'Service',
  serviceType: name,
  description,
  provider: { '@id': '#electrician' },
  areaServed: { '@type': 'Place', name: area },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'KGS',
    priceSpecification: { '@type': 'PriceSpecification', minPrice: min, maxPrice: max, priceCurrency: 'KGS', unitText: unit },
  },
});

export const breadcrumbsLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((b, i) => ({
    '@type': 'ListItem', position: i + 1, name: b.name,
    ...(b.url ? { item: site.url + b.url } : {}),
  })),
});

export const articleLd = ({ title, description, date, slug, keyword }) => ({
  '@type': 'BlogPosting',
  headline: title, description,
  datePublished: date, dateModified: date,
  keywords: keyword,
  author: { '@type': 'Person', name: site.founder },
  publisher: { '@id': '#electrician' },
  mainEntityOfPage: `${site.url}/blog/${slug}/`,
});

