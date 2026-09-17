import { expect, test } from '@playwright/test'
import { indexableRoutes, siteUrl } from '../../utils/seo-routes'

/**
 * SEO-инварианты индексируемых маршрутов (без JavaScript — так же, как их
 * видит поисковый робот): canonical, уникальные title/description в пределах
 * длины, единственный H1, валидный JSON-LD с BreadcrumbList, уникальные `id`
 * на странице, отсутствие ссылок на несуществующий `_payload.json`, состав
 * `sitemap.xml` и тело страницы 404. Тексты конкретных страниц (title, H1,
 * description) правят другие субагенты релиза — здесь проверяются только
 * инварианты, а не конкретные формулировки.
 */
test.use({ javaScriptEnabled: false })

/** Итоговая длина `<title>` с учётом суффикса `titleTemplate` из `app.vue`. */
const maxTitleLength = 73
/** Официального лимита у Яндекса нет, ориентир — раздел 8.2 аудита. */
const maxDescriptionLength = 170

/** Плоский список всех `@type` узлов JSON-LD верхнего уровня (`@graph`). */
function collectJsonLdTypes(graphNodes: Array<{ '@type'?: string | string[] }>): string[] {
  return graphNodes.flatMap((node) => {
    const type = node['@type']
    if (Array.isArray(type)) {
      return type
    }
    return type === undefined ? [] : [type]
  })
}

test.describe('SEO-инварианты индексируемых страниц', () => {
  const routeByTitle = new Map<string, string>()
  const routeByDescription = new Map<string, string>()

  for (const { loc } of indexableRoutes) {
    test(`${loc}: canonical, мета-теги, JSON-LD и уникальные id`, async ({ page }) => {
      const response = await page.goto(loc)
      expect(response?.status(), `код ответа ${loc}`).toBe(200)

      // Canonical всегда указывает на текущий маршрут без параметров и без утм-меток.
      const expectedCanonical = loc === '/' ? `${siteUrl}/` : `${siteUrl}${loc}`
      await expect(page.locator('link[rel="canonical"]'), `canonical на ${loc}`).toHaveAttribute('href', expectedCanonical)

      // Title непустой, уникальный по всем маршрутам и укладывается в лимит с суффиксом бренда.
      const title = await page.title()
      expect(title.trim().length, `пустой title на ${loc}`).toBeGreaterThan(0)
      expect(title.length, `title длиннее ${maxTitleLength} на ${loc}: «${title}» (${title.length})`).toBeLessThanOrEqual(maxTitleLength)
      const routeWithSameTitle = routeByTitle.get(title)
      expect(routeWithSameTitle, `title «${title}» уже занят маршрутом ${routeWithSameTitle}`).toBeUndefined()
      routeByTitle.set(title, loc)

      // Description непустой, уникальный и в пределах длины.
      const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? ''
      expect(description.trim().length, `пустой description на ${loc}`).toBeGreaterThan(0)
      expect(description.length, `description длиннее ${maxDescriptionLength} на ${loc} (${description.length})`).toBeLessThanOrEqual(maxDescriptionLength)
      const routeWithSameDescription = routeByDescription.get(description)
      expect(routeWithSameDescription, `description уже занят маршрутом ${routeWithSameDescription}`).toBeUndefined()
      routeByDescription.set(description, loc)

      // Ровно один H1.
      await expect(page.locator('h1'), `количество h1 на ${loc}`).toHaveCount(1)

      // Каждый script[type=application/ld+json] должен быть валидным JSON.
      const jsonLdContents = await page.locator('script[type="application/ld+json"]').allTextContents()
      expect(jsonLdContents.length, `нет JSON-LD на ${loc}`).toBeGreaterThan(0)
      const parsedBlocks = jsonLdContents.map((content, index) => {
        try {
          return JSON.parse(content) as { '@graph'?: unknown[] }
        }
        catch (error) {
          throw new Error(`JSON-LD блок #${index} на ${loc} не парсится: ${(error as Error).message}`)
        }
      })

      // BreadcrumbList обязателен на всех страницах, кроме главной.
      const allNodes = parsedBlocks.flatMap((block) => Array.isArray(block['@graph']) ? block['@graph'] : [block])
      const types = collectJsonLdTypes(allNodes as Array<{ '@type'?: string | string[] }>)
      if (loc !== '/') {
        expect(types, `BreadcrumbList не найден в JSON-LD на ${loc}`).toContain('BreadcrumbList')
      }

      // Якоря размерных таблиц и другие id не должны сталкиваться друг с другом.
      const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id))
      expect(new Set(ids).size, `дублирующиеся id на ${loc}: ${ids.join(', ')}`).toBe(ids.length)

      // `payloadExtraction: false` убирает preload и любые ссылки на payload.
      const headHtml = await page.locator('head').innerHTML()
      expect(headHtml, `preload _payload.json в head на ${loc}`).not.toContain('_payload.json')
      const pageHtml = await page.content()
      expect(pageHtml, `ссылка на _payload.json на ${loc}`).not.toContain('_payload.json')
    })
  }
})

test('sitemap.xml содержит ровно indexableRoutes и не содержит lastmod', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)

  const body = await response.text()
  expect(body).not.toContain('<lastmod>')

  const actualLocs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const expectedLocs = indexableRoutes.map(({ loc }) => loc === '/' ? `${siteUrl}/` : `${siteUrl}${loc}`)
  expect(new Set(actualLocs)).toEqual(new Set(expectedLocs))
})

test('несуществующий адрес отдаёт статус 404 с телом страницы not-found', async ({ page }) => {
  const response = await page.goto('/takoy-stranicy-net')
  expect(response?.status()).toBe(404)

  const title = await page.title()
  expect(title.trim().length).toBeGreaterThan(0)

  await expect(page.locator('a[href="/pilomaterialy"]').first()).toBeVisible()
})
