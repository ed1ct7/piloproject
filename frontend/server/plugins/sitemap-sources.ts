import type { SitemapSourcesHookCtx } from '@nuxtjs/sitemap'
import { indexableRoutes } from '../../utils/seo-routes'

export default defineNitroPlugin((nitro) => {
  const hookSitemapSources = nitro.hooks.hook as (
    name: 'sitemap:sources',
    handler: (ctx: SitemapSourcesHookCtx) => void,
  ) => void

  hookSitemapSources('sitemap:sources', (ctx) => {
    ctx.sources.push({
      context: {
        name: 'piloproject:indexable-routes',
        description: 'Static public routes from frontend/utils/seo-routes.ts.',
      },
      urls: indexableRoutes.map((route) => ({ ...route })),
    })
  })
})
