// https://nuxt.com/docs/api/configuration/nuxt-config
import { indexableRoutes, siteUrl } from './utils/seo-routes'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-24',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    './modules/static-sitemap',
    '@nuxt/image',
    'nuxt-schema-org',
  ],
  site: {
    url: siteUrl,
    name: 'Пилорама Разбегаево',
    defaultLocale: 'ru',
  },

  // SSG: `nuxt generate` пререндерит каждый маршрут в статический HTML.
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        ...indexableRoutes.map((route) => route.loc),
        '/system-status',
        '/robots.txt',
        '/sitemap.xml',
      ],
    },
  },

  robots: {
    sitemap: `${siteUrl}/sitemap.xml`,
    allow: '/',
    disallow: ['/system-status'],
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/system-status'],
        cleanParam: ['utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid /'],
      },
    ],
    mergeWithRobotsTxtPath: false,
    credits: false,
  },

  sitemap: {
    exclude: ['/system-status'],
    autoLastmod: true,
    credits: false,
  },

  image: {
    format: ['webp', 'avif', 'jpg'],
    quality: 82,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  schemaOrg: {
    identity: {
      '@id': `${siteUrl}/#localbusiness`,
      '@type': 'HomeAndConstructionBusiness',
      name: 'Пилорама Разбегаево',
      url: siteUrl,
      image: `${siteUrl}/images/sawmill-hero.webp`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Разбегаево',
        addressRegion: 'Ленинградская область',
        addressCountry: 'RU',
      },
      areaServed: [
        'Разбегаево',
        'Ломоносовский район',
        'Красное Село',
        'Ропша',
        'Петергоф',
        'Стрельна',
        'Гатчина',
        'Санкт-Петербург',
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Базовый URL Rust-backend, переопределяется через NUXT_PUBLIC_API_BASE.
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080',
    },
  },
})
