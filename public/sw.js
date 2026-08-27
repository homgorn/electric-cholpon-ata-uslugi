const CACHE = 'v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    '/', '/uslugi/', '/ceny/', '/kalkulyator/',
    '/llms.txt', '/robots.txt', '/manifest.json',
    '/_astro/_geo_.Dp_9JGts.css',
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
