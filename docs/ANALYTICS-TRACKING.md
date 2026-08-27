# ANALYTICS-TRACKING.md — Как вешать метрику на WhatsApp, калькулятор и заявок

> После деплоя подключите Яндекс.Метрику (или GA4) в Base.astro перед `</head>`.

---

## 1. Цели и события

### WhatsApp-клик (основная цель)
```javascript
// Вставьте в layout или страницы перед </body>
function trackWhatsApp() {
  document.querySelectorAll('a[href^="https://wa.me/"], a[href^="https://wa.me/"]').forEach(a => {
    a.addEventListener('click', () => {
      if (window.ym) window.ym(window.ymId, 'reachGoal', 'click_whatsapp');
      if (window.gtag) window.gtag('event', 'click_whatsapp', { location: window.location.pathname, service: a.href });
    });
  });
}
```

### Калькулятор — формирование заявки
```javascript
// В calc page или Base.astro
function trackCalcSend() {
  document.getElementById('waBtn')?.addEventListener('click', () => {
    const totalText = document.getElementById('total')?.textContent || '';
    window.gtag?.('event', 'calc_submit', { total_range: totalText.slice(0, 20), page: window.location.pathname });
  });
}
```

### Блог — чтение до конца
```javascript
window.addEventListener('scroll', () => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  if (pct > 85 && !window.blogReadTracked) {
    window.blogReadTracked = true;
    window.gtag?.('event', 'blog_read_85pct', { page: window.location.pathname });
  }
});
```

---

## 2. Как внедрить в сайт (без перестройки)

### Яндекс.Метрика (2 минуты)
```astro
<!-- В src/layouts/Base.astro перед </head> -->
<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].q=m[i].q||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(ВАШ_НОМЕР_МЕТРИКИ, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true });</script>
<noscript><img src="https://mc.yandex.ru/watch/ВАШ_НОМЕР_МЕТРИКИ" style="position:absolute;left:-9999px" alt="" /></noscript>
```

### GA4
```astro
<!-- В Base.astro -->
<script async src="https://www.googletagmanager.com/gtag/js?id=ВАШ_ID"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','ВАШ_ID');</script>
```

### Где найти номера целей в Метрике
- Цель `click_whatsapp`: Счётчик → Цели → Событие → JavaScript-событие с идентификатором `click_whatsapp`
- Цель `calc_submit`: идентификатор `calc_submit`
- Цель `blog_read_85pct`: идентификатор `blog_read_85pct`
- Воронка: Главная → Услуга → Калькулятор → WhatsApp

---

## 3. Чего избегать при измерении

- Не ставьте счётчик в `dist/` — вставьте в источник `Base.astro` (перегенерируется всё, но вы получите данные по всем 384 страницам)
- Не используйте одинаковые идентификаторы целей — иначе Метрика сольёт данные в одну цель
- Не считайте клики по обычным ссылкам как «конверсии» — только WhatsApp + калькулятор-отправка + звонок
- Не забывайте: `openchamber` — это браузер-инструмент для визуальной проверки; реальные данные — из Метрики/GSC

---

*Analytics guide v1.0 — готов к внедрению, не требует перестройки сайта*