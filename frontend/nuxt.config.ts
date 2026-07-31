// https://nuxt.com/docs/api/configuration/nuxt-config
import { indexableRoutes, siteUrl } from './utils/seo-routes'

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src 'self' http://localhost:8080 http://127.0.0.1:8080 ${siteUrl}`,
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: https:",
    "media-src 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
  ].join('; '),
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

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
        '/admin',
        '/system-status',
        '/robots.txt',
        '/sitemap.xml',
      ],
    },
  },
  routeRules: {
    '/**': {
      headers: securityHeaders,
    },
  },

  robots: {
    sitemap: `${siteUrl}/sitemap.xml`,
    allow: '/',
    disallow: ['/admin', '/system-status'],
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/system-status'],
        cleanParam: ['utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid /'],
      },
    ],
    mergeWithRobotsTxtPath: false,
    credits: false,
  },

  sitemap: {
    exclude: ['/admin', '/system-status'],
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
      image: `${siteUrl}/images/paint-shop-4.jpg`,
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
