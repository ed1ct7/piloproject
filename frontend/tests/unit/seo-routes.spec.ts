import { describe, expect, it } from 'vitest'
import { indexableRoutes, landingSlugs, siteUrl } from '../../utils/seo-routes'

describe('SEO routes', () => {
  it('использует HTTPS URL без завершающего слеша', () => {
    expect(siteUrl).toMatch(/^https:\/\/[^/]+$/)
  })

  it('содержит уникальные абсолютные пути и не индексирует заявку', () => {
    const routes = indexableRoutes.map(({ loc }) => loc)
    expect(new Set(routes).size).toBe(routes.length)
    expect(routes.every((route) => route.startsWith('/'))).toBe(true)
    expect(routes).toContain('/')
    expect(routes).toContain('/pilomaterialy')
    expect(routes).not.toContain('/cart')
    expect(routes).not.toContain('/korzina')
  })

  it('не включает служебную страницу /not-found — она закрыта от индексации', () => {
    const routes = indexableRoutes.map(({ loc }) => loc)
    expect(routes).not.toContain('/not-found')
  })
})

describe('landingSlugs', () => {
  it('содержит уникальные слаги без ведущего слеша, каждый — индексируемый маршрут', () => {
    expect(new Set(landingSlugs).size).toBe(landingSlugs.length)

    const routes = new Set(indexableRoutes.map(({ loc }) => loc))
    for (const slug of landingSlugs) {
      expect(slug.startsWith('/'), `${slug} не должен начинаться со слеша`).toBe(false)
      expect(routes.has(`/${slug}`), `/${slug} отсутствует в indexableRoutes`).toBe(true)
    }
  })
})
