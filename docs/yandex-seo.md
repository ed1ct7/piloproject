# SEO под Яндекс: требования на уровне кода

Технические правила вёрстки и разметки, чтобы страницы хорошо индексировались и ранжировались в поиске Яндекса. Примеры даны под стек проекта — **Nuxt 3 в режиме SSG** (статический HTML краулится лучше всего).

## 1. Семантика и структура страницы

- **Один `<h1>` на страницу.** Дальше иерархия `h2 → h3` без перескоков уровней.
- Семантические теги-ориентиры: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
- Обязательно указывать язык: `<html lang="ru">`.
- У каждого `<img>` — осмысленный атрибут `alt`.
- Уникальные `<title>` и `<meta name="description">` на каждой странице.

## 2. Мета-теги

В Nuxt задаются через `useSeoMeta` / `useHead`:

```ts
useSeoMeta({
  title: 'Пиломатериалы в Разбегаево — доска, брус',
  description: 'Пиломатериалы от производителя оптом и в розницу. Доставка по СПб и ЛО.',
  ogTitle: 'Пиломатериалы в Разбегаево',
  ogDescription: '...',
  ogType: 'website',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://site.ru/tovary/doska' }],
})
```

- **`canonical`** на каждой странице — защищает от дублей.
- `viewport` Nuxt добавляет сам; мобильная адаптивность учитывается в ранжировании.

## 3. Микроразметка Schema.org (JSON-LD)

Яндекс активно использует структурированные данные. Для организации — тип `LocalBusiness`:

```ts
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Пилорама Разбегаево',
      telephone: '+7...',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Разбегаево',
        addressRegion: 'Ленинградская область',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.6',
        reviewCount: '11',
      },
    }),
  }],
})
```

Другие полезные типы:
- `Product` + `Offer` — карточки товаров.
- `BreadcrumbList` — хлебные крошки.

## 4. robots.txt (специфика Яндекса)

```
User-agent: *
Allow: /
Sitemap: https://site.ru/sitemap.xml

# Clean-param — директива ТОЛЬКО Яндекса: склеивает URL с мусорными GET-параметрами
Clean-param: utm_source&utm_medium&sort /
```

- **`Clean-param`** — уникальная директива Яндекса, убирает дубли по GET-параметрам. Google её игнорирует.
- **`Host`** — устарела, Яндекс перестал её учитывать (~2018). Вместо неё — 301-редирект + `canonical` на главное зеркало.

## 5. sitemap.xml

Карта сайта со всеми индексируемыми URL. В Nuxt генерируется модулем `@nuxtjs/sitemap`. Файл указывается в `robots.txt` и загружается в Яндекс.Вебмастер.

## 6. Подтверждение в Яндекс.Вебмастере

Мета-тег на главной странице:

```html
<meta name="yandex-verification" content="XXccode" />
```

После подтверждения: залить sitemap, отслеживать индексацию, ошибки обхода и ИКС (индекс качества сайта).

## 7. Производительность

Яндекс учитывает скорость и стабильность страницы не меньше Google.

- **Core Web Vitals**: LCP, CLS, INP.
- Ленивая загрузка изображений: `loading="lazy"`; современные форматы WebP/AVIF (в Nuxt — модуль `@nuxt/image`).
- SSG уже даёт быстрый первый рендер — плюс к оценке.
- Обязательны HTTPS и ЧПУ-URL (`/tovary/doska`, а не `?id=123`).

## Полезные модули Nuxt

| Задача                     | Модуль            |
|----------------------------|-------------------|
| Карта сайта                | `@nuxtjs/sitemap` |
| robots.txt                 | `@nuxtjs/robots`  |
| Микроразметка Schema.org   | `nuxt-schema-org` |
| Оптимизация изображений    | `@nuxt/image`     |
