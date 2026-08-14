// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import {
  businessAddress,
  businessEmail,
  businessMapsUrl,
  businessMaxUrl,
  businessOpeningHoursSpecification,
  businessPhoneInternational,
  businessRequisites,
} from './utils/business'
import { indexableRoutes, siteUrl } from './utils/seo-routes'

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "form-action 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "media-src 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
  ].join('; '),
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-24',
  devtools: { enabled: true },
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

  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [{ name: 'theme-color', content: '#183126' }],
    },
  },

  // SSG: `nuxt generate` пререндерит каждый маршрут в статический HTML.
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        ...indexableRoutes.map((route) => route.loc),
        '/cart',
        '/korzina',
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
    groups: [
      {
        userAgent: '*',
        allow: '/',
        cleanParam: ['utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid /'],
      },
    ],
    mergeWithRobotsTxtPath: false,
    credits: false,
  },

  sitemap: {
    exclude: [],
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
      legalName: businessRequisites.fullName,
      url: siteUrl,
      telephone: businessPhoneInternational,
      email: businessEmail,
      sameAs: [businessMapsUrl, businessMaxUrl],
      image: `${siteUrl}/images/lentochnaya-pilorama-raspil.jpg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessAddress,
        addressLocality: 'деревня Разбегаево',
        addressRegion: 'Ленинградская область',
        addressCountry: 'RU',
      },
      openingHoursSpecification: businessOpeningHoursSpecification,
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
  vite: {
    plugins: [tailwindcss()],
  },
})
