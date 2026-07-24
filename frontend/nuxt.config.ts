// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-24',
  devtools: { enabled: true },

  // SSG: `nuxt generate` пререндерит каждый маршрут в статический HTML.
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
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
