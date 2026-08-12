import { describe, expect, it } from 'vitest'
import { indexableRoutes, siteUrl } from '../../utils/seo-routes'

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
})
