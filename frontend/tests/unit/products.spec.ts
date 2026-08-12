import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  formatProductPrice,
  priceListProducts,
  productCategories,
} from '../../utils/products'

describe('formatProductPrice', () => {
  it('форматирует минимальную цену за кубический метр', () => {
    expect(formatProductPrice({ price: 18000, pricePrefix: 'от', unit: 'м³' }))
      .toBe('от 18 000 ₽/м³')
  })

  it('форматирует цену за штуку без префикса', () => {
    expect(formatProductPrice({ price: 125, unit: 'шт.' })).toBe('125 ₽/шт.')
  })

  it('возвращает понятный текст для цены по запросу', () => {
    expect(formatProductPrice({ price: null, unit: 'м³' })).toBe('Цена по запросу')
  })
})

describe('priceListProducts', () => {
  it('содержит уникальные стабильные идентификаторы и номера', () => {
    expect(new Set(priceListProducts.map(({ id }) => id)).size).toBe(priceListProducts.length)
    expect(new Set(priceListProducts.map(({ number }) => number)).size).toBe(priceListProducts.length)
  })

  it('ссылается только на локальные существующие изображения', () => {
    for (const product of priceListProducts) {
      expect(product.image).toMatch(/^\/images\/[a-z0-9.-]+$/)
      const imagePath = fileURLToPath(new URL(`../../public${product.image}`, import.meta.url))
      expect(existsSync(imagePath), product.image).toBe(true)
    }
  })

  it('использует известные категории и корректные цены', () => {
    const categories = new Set(productCategories.map(({ value }) => value))
    for (const product of priceListProducts) {
      expect(categories.has(product.category)).toBe(true)
      expect(product.price === null || (Number.isFinite(product.price) && product.price > 0)).toBe(true)
      expect(product.title.trim()).not.toBe('')
      expect(product.alt.trim()).not.toBe('')
      expect(product.specs.length).toBeGreaterThan(0)
    }
  })
})
