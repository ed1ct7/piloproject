import { describe, expect, it } from 'vitest'
import {
  businessFeedCategoryId,
  businessFeedCurrencyId,
  businessFeedOfferSources,
  buildBusinessFeedOffers,
  escapeXml,
  renderBusinessFeedXml,
} from '../../utils/business-feed'
import { priceListProducts } from '../../utils/products'

/**
 * Минимальная проверка, что строка — well-formed XML: теги парами закрыты,
 * порядок закрытия соблюдён, самозакрывающиеся и объявление `<?xml …?>`
 * пропускаются. Без внешнего XML-парсера (в проекте его нет и он не нужен
 * для рантайма), но достаточно, чтобы поймать несбалансированную разметку
 * или неэкранированный спецсимвол, ломающий структуру тегов.
 * @param xml проверяемая строка
 */
function assertWellFormedXml(xml: string): void {
  const tags = Array.from(xml.matchAll(/<([^>]+)>/g), (match) => match[1]!.trim())
  const stack: string[] = []

  for (const tag of tags) {
    if (tag.startsWith('?') || tag.startsWith('!') || tag.endsWith('/')) {
      continue
    }
    if (tag.startsWith('/')) {
      const name = tag.slice(1).trim()
      expect(stack.pop(), `закрывающий тег </${name}> без открывающего`).toBe(name)
      continue
    }
    const name = tag.split(/\s/)[0]!
    stack.push(name)
  }

  expect(stack, `остались незакрытые теги: ${stack.join(', ')}`).toEqual([])
}

describe('businessFeedOfferSources', () => {
  it('содержит ровно 8 позиций с уникальными идентификаторами', () => {
    expect(businessFeedOfferSources).toHaveLength(8)
    expect(new Set(businessFeedOfferSources.map(({ id }) => id)).size).toBe(8)
  })

  it('каждый идентификатор существует в прайс-листе и имеет цену', () => {
    for (const source of businessFeedOfferSources) {
      const product = priceListProducts.find((item) => item.id === source.id)
      expect(product, `позиция "${source.id}" отсутствует в utils/products.ts`).toBeDefined()
      expect(product?.price, `у позиции "${source.id}" цена по запросу`).not.toBeNull()
    }
  })
})

describe('buildBusinessFeedOffers', () => {
  const offers = buildBusinessFeedOffers(businessFeedOfferSources, 'https://pilorama-razbegaevo.ru')

  it('берёт цену каждого оффера из utils/products.ts', () => {
    for (const offer of offers) {
      const product = priceListProducts.find((item) => item.id === offer.id)
      expect(offer.price).toBe(product?.price)
      expect(Number.isInteger(offer.price)).toBe(true)
    }
  })

  it('строит абсолютные ссылки на посадочную страницу и картинку', () => {
    for (const offer of offers) {
      expect(offer.url).toBe(`https://pilorama-razbegaevo.ru${offer.path}`)
      expect(offer.pictureUrl).toBe(`https://pilorama-razbegaevo.ru${offer.picture}`)
      expect(offer.url).toMatch(/^https:\/\/pilorama-razbegaevo\.ru\//)
      expect(offer.pictureUrl).toMatch(/^https:\/\/pilorama-razbegaevo\.ru\/images\//)
    }
  })

  it('выбрасывает ошибку для позиции без цены', () => {
    expect(() =>
      buildBusinessFeedOffers([
        { id: 'doska-suhaya-ognebio', name: 'x', path: '/x', picture: '/images/x.jpg', description: 'x' },
      ]),
    ).toThrow()
  })

  it('выбрасывает ошибку для неизвестного идентификатора', () => {
    expect(() =>
      buildBusinessFeedOffers([
        { id: 'unknown-id', name: 'x', path: '/x', picture: '/images/x.jpg', description: 'x' },
      ]),
    ).toThrow()
  })
})

describe('escapeXml', () => {
  it('экранирует амперсанд, угловые скобки и кавычки', () => {
    expect(escapeXml(`Доска "экстра" & <не проверено> сорта 'A'`))
      .toBe('Доска &quot;экстра&quot; &amp; &lt;не проверено&gt; сорта &apos;A&apos;')
  })
})

describe('renderBusinessFeedXml', () => {
  const fixedDate = new Date('2026-09-17T05:00:00.000Z')
  const xml = renderBusinessFeedXml({ date: fixedDate, baseUrl: 'https://pilorama-razbegaevo.ru' })

  it('является корректно сформированным XML', () => {
    assertWellFormedXml(xml)
  })

  it('содержит ровно 8 offer и дату сборки в yml_catalog', () => {
    expect(xml.match(/<offer id=/g)).toHaveLength(8)
    expect(xml).toContain(`<yml_catalog date="${fixedDate.toISOString()}">`)
  })

  it('у каждого оффера есть url, picture, name, price, currencyId и categoryId, а цена совпадает с прайсом', () => {
    const offerBlocks = xml.split('<offer ').slice(1)
    expect(offerBlocks).toHaveLength(8)

    for (const block of offerBlocks) {
      const id = block.match(/^id="([^"]+)"/)?.[1]
      expect(id).toBeTruthy()
      const product = priceListProducts.find((item) => item.id === id)
      expect(product, `позиция "${id}" отсутствует в utils/products.ts`).toBeDefined()

      expect(block).toMatch(/<url>https:\/\/pilorama-razbegaevo\.ru\/[^<]+<\/url>/)
      expect(block).toMatch(/<picture>https:\/\/pilorama-razbegaevo\.ru\/images\/[^<]+<\/picture>/)
      expect(block).toMatch(/<name>[^<]+<\/name>/)
      expect(block).toContain(`<currencyId>${businessFeedCurrencyId}</currencyId>`)
      expect(block).toContain(`<categoryId>${businessFeedCategoryId}</categoryId>`)

      const price = Number(block.match(/<price>(\d+)<\/price>/)?.[1])
      expect(price).toBe(product?.price)
    }
  })

  it('не содержит служебных пометок черновика и не ссылается на несуществующий каталог', () => {
    expect(xml).not.toMatch(/черновик/i)
    expect(xml).not.toContain('/catalog/')
  })

  it('использует UTF-8 в XML-декларации', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
  })
})
