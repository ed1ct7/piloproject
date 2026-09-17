import { describe, expect, it } from 'vitest'
import { seoLandings } from '../../utils/seo-landings'
import { indexableRoutes, landingSlugs } from '../../utils/seo-routes'

/** Длина суффикса ` · Пилорама Разбегаево`, который `titleTemplate` в `app.vue` добавляет к title. */
const brandSuffixLength = 22
const brandName = 'Пилорама Разбегаево'
const maxTitleLength = 73
const maxDescriptionLength = 170

describe('посадочные страницы seoLandings', () => {
  it('слаги seoLandings совпадают с landingSlugs и входят в indexableRoutes', () => {
    const seoLandingSlugs = seoLandings.map((landing) => landing.slug)
    expect(new Set(seoLandingSlugs)).toEqual(new Set(landingSlugs))

    const routes = new Set(indexableRoutes.map(({ loc }) => loc))
    for (const landing of seoLandings) {
      expect(routes.has(`/${landing.slug}`), `/${landing.slug} отсутствует в indexableRoutes`).toBe(true)
    }
  })

  it('title укладывается в 73 знака с учётом суффикса бренда из titleTemplate', () => {
    for (const landing of seoLandings) {
      // Суффикс добавляется, только если бренд ещё не упомянут в title буквально.
      const limit = landing.title.includes(brandName) ? maxTitleLength : maxTitleLength - brandSuffixLength
      expect(
        landing.title.length,
        `${landing.slug}: title «${landing.title}» — ${landing.title.length} знаков, лимит ${limit}`,
      ).toBeLessThanOrEqual(limit)
    }
  })

  it('metaDescription не длиннее 170 знаков', () => {
    for (const landing of seoLandings) {
      expect(
        landing.metaDescription.length,
        `${landing.slug}: metaDescription — ${landing.metaDescription.length} знаков`,
      ).toBeLessThanOrEqual(maxDescriptionLength)
    }
  })

  it('title и metaDescription уникальны среди посадочных', () => {
    const titles = seoLandings.map((landing) => landing.title)
    const descriptions = seoLandings.map((landing) => landing.metaDescription)

    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
  })
})
