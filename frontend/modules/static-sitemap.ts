import { defineNuxtModule } from '@nuxt/kit'

const staticRoutes = [
  '/sitemap.xml',
]

function addStaticRoutes(routes: Array<string | undefined>) {
  for (const route of staticRoutes) {
    if (!routes.includes(route)) {
      routes.push(route)
    }
  }
}

export default defineNuxtModule({
  meta: {
    name: 'static-sitemap',
  },
  setup(_options, nuxt) {
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes ||= []

      addStaticRoutes(nitroConfig.prerender.routes)
    })

    nuxt.hook('nitro:init', (nitro) => {
      nitro.options.prerender.routes ||= []

      addStaticRoutes(nitro.options.prerender.routes)
    })
  },
})
