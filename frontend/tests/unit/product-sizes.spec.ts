import { describe, expect, it } from 'vitest'
import { priceListProducts } from '../../utils/products'
import {
  calculateLumber,
  formatRoubles,
  formatSection,
  formatVolume,
  getPiecePrice,
  getPiecesForVolume,
  getPieceVolume,
  getSizeTableProduct,
  getSizeTableRows,
  getSizeTablesForProducts,
  maxCalculatorPieces,
  maxCalculatorVolume,
  productSizeTables,
  timberNote,
} from '../../utils/product-sizes'

describe('getPieceVolume', () => {
  it('считает объём доски по трём размерам в миллиметрах', () => {
    expect(getPieceVolume(50, 150, 6000)).toBeCloseTo(0.045, 10)
    expect(getPieceVolume(25, 100, 6000)).toBeCloseTo(0.015, 10)
    expect(getPieceVolume(20, 145, 3000)).toBeCloseTo(0.0087, 10)
  })

  it('возвращает null для нуля, отрицательных и нечисловых размеров', () => {
    expect(getPieceVolume(0, 150, 6000)).toBeNull()
    expect(getPieceVolume(50, -150, 6000)).toBeNull()
    expect(getPieceVolume(50, 150, Number.NaN)).toBeNull()
    expect(getPieceVolume(50, 150, Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('getPiecePrice', () => {
  it('умножает объём на цену кубометра и округляет вверх до рубля', () => {
    // 0,045 × 18 000 = 810 — граничный случай шума плавающей точки, не должен стать 811.
    expect(getPiecePrice(0.045, 18000)).toBe(810)
    // 0,01875 × 18 000 = 337,5 → вверх до 338.
    expect(getPiecePrice(0.01875, 18000)).toBe(338)
    // 0,0087 × 33 000 = 287,1 → вверх до 288.
    expect(getPiecePrice(0.0087, 33000)).toBe(288)
  })

  it('возвращает null при некорректном объёме или цене', () => {
    expect(getPiecePrice(0, 18000)).toBeNull()
    expect(getPiecePrice(0.045, 0)).toBeNull()
    expect(getPiecePrice(Number.NaN, 18000)).toBeNull()
    expect(getPiecePrice(0.045, -1)).toBeNull()
  })
})

describe('getPiecesForVolume', () => {
  it('округляет число штук вверх до целой доски', () => {
    expect(getPiecesForVolume(1, 0.045)).toBe(23)
    expect(getPiecesForVolume(0.045, 0.045)).toBe(1)
    expect(getPiecesForVolume(0.09, 0.045)).toBe(2)
  })

  it('не уходит в лишнюю штуку из-за шума плавающей точки на кратном объёме', () => {
    const pieceVolume = getPieceVolume(25, 150, 6000) ?? 0
    expect(getPiecesForVolume(pieceVolume * 3, pieceVolume)).toBe(3)
    expect(getPiecesForVolume(4.5, 0.0225)).toBe(200)
  })

  it('возвращает null для нулевых и отрицательных значений', () => {
    expect(getPiecesForVolume(0, 0.045)).toBeNull()
    expect(getPiecesForVolume(1, 0)).toBeNull()
    expect(getPiecesForVolume(-1, 0.045)).toBeNull()
  })
})

describe('calculateLumber', () => {
  const board = { thicknessMm: 50, widthMm: 150, lengthMm: 6000, pricePerCubicMeter: 18000 }

  it('считает одну доску 50×150×6000 I сорта как 0,045 м³ и 810 ₽', () => {
    expect(calculateLumber({ ...board, quantity: 1, unit: 'шт.' })).toEqual({
      pieceVolume: 0.045,
      pieces: 1,
      totalVolume: 0.045,
      piecePrice: 810,
      totalPrice: 810,
    })
  })

  it('считает партию по общему объёму', () => {
    const result = calculateLumber({ ...board, quantity: 10, unit: 'шт.' })
    expect(result?.pieces).toBe(10)
    expect(result?.totalVolume).toBeCloseTo(0.45, 10)
    expect(result?.totalPrice).toBe(8100)
  })

  it('переводит кубометры в целое число штук и считает объём по ним', () => {
    const result = calculateLumber({ ...board, quantity: 1, unit: 'м³' })
    expect(result?.pieces).toBe(23)
    expect(result?.totalVolume).toBeCloseTo(1.035, 10)
    expect(result?.totalPrice).toBe(18630)
  })

  it('принимает граничные количества и отклоняет выход за пределы', () => {
    expect(calculateLumber({ ...board, quantity: maxCalculatorPieces, unit: 'шт.' })?.pieces).toBe(maxCalculatorPieces)
    expect(calculateLumber({ ...board, quantity: maxCalculatorPieces + 1, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, quantity: maxCalculatorVolume, unit: 'м³' })).not.toBeNull()
    expect(calculateLumber({ ...board, quantity: maxCalculatorVolume + 1, unit: 'м³' })).toBeNull()
  })

  it('возвращает null для дробных, нулевых и нечисловых штук', () => {
    expect(calculateLumber({ ...board, quantity: 1.5, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, quantity: 0, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, quantity: Number.NaN, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, quantity: 0, unit: 'м³' })).toBeNull()
  })

  it('возвращает null при некорректных размерах, цене или единице', () => {
    expect(calculateLumber({ ...board, thicknessMm: 0, quantity: 1, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, pricePerCubicMeter: 0, quantity: 1, unit: 'шт.' })).toBeNull()
    expect(calculateLumber({ ...board, quantity: 1, unit: 'кг' as 'шт.' })).toBeNull()
  })
})

describe('productSizeTables', () => {
  it('ссылается только на позиции прайса с ценой за кубометр', () => {
    const productIds = new Set(priceListProducts.map(({ id }) => id))
    for (const table of productSizeTables) {
      expect(table.columns.length).toBeGreaterThan(0)
      for (const column of table.columns) {
        expect(productIds.has(column.productId), column.productId).toBe(true)
        expect(getSizeTableProduct(column)?.unit).toBe('м³')
      }
    }
  })

  it('содержит подтверждённые владельцем сечения, длины и уникальные идентификаторы', () => {
    expect(new Set(productSizeTables.map(({ id }) => id)).size).toBe(productSizeTables.length)
    const byId = Object.fromEntries(productSizeTables.map((table) => [table.id, table]))
    expect(byId['doska-ev']?.sections).toHaveLength(9)
    expect(byId['doska-ev']?.lengthsMm).toEqual([6000])
    expect(byId['doska-ev-ognebio']?.sections).toEqual(byId['doska-ev']?.sections)
    expect(byId['doska-suhaya']?.sections).toEqual(byId['doska-ev']?.sections)
    expect(byId['doska-suhaya-stroganaya']?.sections).toEqual([[20, 95], [20, 120], [20, 145], [45, 95], [45, 145], [45, 195]])
    expect(byId['doska-suhaya-stroganaya']?.lengthsMm).toEqual([3000, 6000])
    expect(byId['imitatsiya-brusa']?.sections).toEqual([[20, 145]])
    expect(byId['imitatsiya-brusa']?.lengthsMm).toEqual([3000, 6000])
    expect(byId['imitatsiya-brusa']?.lowerEstimate).toBe(true)
    expect(timberNote).toContain('18 000')
  })

  it('не содержит сухую доску с огнебиозащитой — цена по запросу', () => {
    const productIds = productSizeTables.flatMap((table) => table.columns.map(({ productId }) => productId))
    expect(productIds).not.toContain('doska-suhaya-ognebio')
    expect(productIds).not.toContain('evrovagonka-12-5x95x3000')
  })
})

describe('getSizeTableRows', () => {
  it('разворачивает сечения по каждой длине с объёмом штуки', () => {
    const rows = getSizeTableRows({
      id: 'test',
      title: 'Тест',
      columns: [],
      sections: [[25, 100], [50, 150]],
      lengthsMm: [3000, 6000],
    })
    expect(rows.map(({ section, lengthMm }) => `${formatSection(section)}×${lengthMm}`))
      .toEqual(['25×100×3000', '50×150×3000', '25×100×6000', '50×150×6000'])
    expect(rows[3]?.pieceVolume).toBeCloseTo(0.045, 10)
  })

  it('пропускает строки с некорректными размерами и возвращает пустой список без сечений', () => {
    expect(getSizeTableRows({ id: 'e', title: 'Пусто', columns: [], sections: [], lengthsMm: [6000] })).toEqual([])
    expect(getSizeTableRows({ id: 'b', title: 'Брак', columns: [], sections: [[0, 100]], lengthsMm: [6000] })).toEqual([])
  })
})

describe('getSizeTablesForProducts', () => {
  it('возвращает таблицы, все позиции которых есть в списке посадочной', () => {
    expect(getSizeTablesForProducts(['doska-ev-sort-1', 'doska-ev-sort-2', 'doska-ev-sort-3']).map(({ id }) => id))
      .toEqual(['doska-ev'])
    expect(getSizeTablesForProducts(['doska-suhaya-kamernoi-sushki', 'doska-suhaya-stroganaya', 'doska-suhaya-ognebio']).map(({ id }) => id))
      .toEqual(['doska-suhaya', 'doska-suhaya-stroganaya'])
    expect(getSizeTablesForProducts(priceListProducts.map(({ id }) => id))).toHaveLength(productSizeTables.length)
  })

  it('не возвращает таблицу, если в списке только часть её сортов, и пуст для вагонки', () => {
    expect(getSizeTablesForProducts(['doska-ev-sort-1'])).toEqual([])
    expect(getSizeTablesForProducts(['evrovagonka-12-5x95x3000', 'vagonka-shtil-12-5x120x3000'])).toEqual([])
    expect(getSizeTablesForProducts([])).toEqual([])
  })
})

describe('getSizeTableProduct', () => {
  it('возвращает позицию с числовой ценой за кубометр', () => {
    expect(getSizeTableProduct({ productId: 'doska-ev-sort-1', label: 'I сорт' })?.price).toBe(18000)
  })

  it('возвращает undefined для цены по запросу, штучной цены и неизвестной позиции', () => {
    expect(getSizeTableProduct({ productId: 'doska-suhaya-ognebio', label: 'Сухая' })).toBeUndefined()
    expect(getSizeTableProduct({ productId: 'evrovagonka-12-5x95x3000', label: 'Вагонка' })).toBeUndefined()
    expect(getSizeTableProduct({ productId: 'unknown', label: '—' })).toBeUndefined()
  })
})

describe('форматирование', () => {
  it('выводит сечение, объём с четырьмя знаками и рубли с разделителями', () => {
    expect(formatSection([50, 150])).toBe('50×150')
    expect(formatVolume(0.045)).toBe('0,0450')
    expect(formatVolume(1.035)).toBe('1,0350')
    expect(formatRoubles(810)).toBe('810 ₽')
    expect(formatRoubles(18630).replace(/ /g, ' ')).toBe('18 630 ₽')
  })
})
