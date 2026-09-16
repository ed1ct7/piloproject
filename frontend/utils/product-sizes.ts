/**
 * Сечения, длины и расчёт цены за штуку для позиций прайса.
 *
 * Единственный источник размерных таблиц на посадочных и в каталоге
 * `/pilomaterialy`, а также данных калькулятора объёма и стоимости.
 * Цена за кубометр берётся из `priceListProducts` и здесь не дублируется:
 * внутри позиции она одинакова для любого сечения, поэтому цена за штуку
 * всегда считается как объём штуки × цена м³ и подаётся как минимальная («от»).
 * Цены и сечения сухой и строганой доски, имитации и вагонки — из прайса владельца
 * (08.08 и 16.09.2026). Сечения и длина 6 м доски естественной влажности приняты
 * по аналогии с сухой доской и помечены «под заказ» — владелец их отдельно не перечислял.
 */
import { priceListProducts } from './products'
import type { PriceListProduct } from './products'

/** Сечение пиломатериала: толщина и ширина в миллиметрах. */
export type LumberSection = readonly [thicknessMm: number, widthMm: number]

/** Колонка таблицы: позиция прайса и её короткая подпись в шапке. */
export interface SizeTableColumn {
  /** Идентификатор позиции из `priceListProducts`. */
  productId: string
  /** Подпись колонки: «I сорт», «Цена за штуку». */
  label: string
}

/** Размерная таблица одной или нескольких позиций с общим набором сечений. */
export interface ProductSizeTable {
  /** Стабильный идентификатор таблицы для ключей вёрстки. */
  id: string
  /** Заголовок таблицы. */
  title: string
  /** Позиции прайса, для которых считается цена за штуку. */
  columns: SizeTableColumn[]
  /** Сечения в порядке вывода. */
  sections: LumberSection[]
  /** Длины в миллиметрах в порядке вывода. */
  lengthsMm: number[]
  /** Подпись под таблицей — только подтверждённые владельцем оговорки. */
  note?: string
  /**
   * Цена за штуку — нижняя оценка.
   * @note ширина в сечении габаритная, с шипом; рабочая ширина меньше
   */
  lowerEstimate?: boolean
}

/** Строка размерной таблицы: сечение, длина и объём одной штуки. */
export interface SizeTableRow {
  section: LumberSection
  lengthMm: number
  /** Объём одной штуки в м³. */
  pieceVolume: number
}

/** Единица количества в калькуляторе. */
export type LumberQuantityUnit = 'шт.' | 'м³'

/** Входные данные расчёта объёма и стоимости. */
export interface LumberCalculationInput {
  thicknessMm: number
  widthMm: number
  lengthMm: number
  /** Цена за кубометр из прайса. */
  pricePerCubicMeter: number
  /** Количество в штуках или кубометрах — см. `unit`. */
  quantity: number
  unit: LumberQuantityUnit
}

/** Результат расчёта: объёмы, целое число штук и суммы «от». */
export interface LumberCalculation {
  /** Объём одной штуки, м³. */
  pieceVolume: number
  /** Целое число штук; при вводе в м³ округлено вверх до целой доски. */
  pieces: number
  /** Объём партии из целого числа штук, м³. */
  totalVolume: number
  /** Цена одной штуки, округлённая вверх до рубля. */
  piecePrice: number
  /** Стоимость партии по общему объёму, округлённая вверх до рубля. */
  totalPrice: number
}

/** Максимальное количество штук, которое принимает калькулятор. */
export const maxCalculatorPieces = 100_000

/** Максимальный объём в м³, который принимает калькулятор. */
export const maxCalculatorVolume = 10_000

/** Сечения доски естественной влажности и камерной сушки. */
const boardSections: LumberSection[] = [
  [25, 100],
  [25, 125],
  [25, 150],
  [40, 100],
  [40, 150],
  [40, 200],
  [50, 100],
  [50, 150],
  [50, 200],
]

/** Сечения сухой строганой доски. */
const planedBoardSections: LumberSection[] = [
  [20, 95],
  [20, 120],
  [20, 145],
  [45, 95],
  [45, 145],
  [45, 195],
]

const boardGradeColumns: SizeTableColumn[] = [
  { productId: 'doska-ev-sort-1', label: 'I сорт' },
  { productId: 'doska-ev-sort-2', label: 'II сорт' },
  { productId: 'doska-ev-sort-3', label: 'III сорт' },
]

const fireProtectedGradeColumns: SizeTableColumn[] = [
  { productId: 'doska-ev-ognebio-sort-1', label: 'I сорт' },
  { productId: 'doska-ev-ognebio-sort-2', label: 'II сорт' },
  { productId: 'doska-ev-ognebio-sort-3', label: 'III сорт' },
]

const customSizesNote = 'Другие сечения и длины — под заказ.'

export const productSizeTables: ProductSizeTable[] = [
  {
    id: 'doska-ev',
    title: 'Доска естественной влажности',
    columns: boardGradeColumns,
    sections: boardSections,
    lengthsMm: [6000],
    note: customSizesNote,
  },
  {
    id: 'doska-ev-ognebio',
    title: 'Доска естественной влажности с огнебиозащитой',
    columns: fireProtectedGradeColumns,
    sections: boardSections,
    lengthsMm: [6000],
    note: `Цена включает доплату 2 000 ₽/м³ за обработку. ${customSizesNote}`,
  },
  {
    id: 'doska-suhaya',
    title: 'Доска сухая камерной сушки',
    columns: [{ productId: 'doska-suhaya-kamernoi-sushki', label: 'Цена за штуку' }],
    sections: boardSections,
    lengthsMm: [6000],
  },
  {
    id: 'doska-suhaya-stroganaya',
    title: 'Доска сухая строганая',
    columns: [{ productId: 'doska-suhaya-stroganaya', label: 'Цена за штуку' }],
    sections: planedBoardSections,
    lengthsMm: [3000, 6000],
  },
  {
    id: 'imitatsiya-brusa',
    title: 'Имитация бруса',
    columns: [{ productId: 'imitatsiya-brusa-20x145', label: 'Цена за штуку' }],
    sections: [[20, 145]],
    lengthsMm: [3000, 6000],
    lowerEstimate: true,
    note: '145 мм — габаритная ширина с шипом, поэтому цена за штуку — нижняя оценка.',
  },
]

/** Брус в прайсе отдельной позицией не выделен: одна строка текста у таблиц. */
export const timberNote = 'Брус естественной влажности I сорта — от 18 000 ₽/м³, сечения под заказ.'

/**
 * Проверяет, что значение — конечное положительное число
 * @param value проверяемое значение
 * @returns true для конечного числа больше нуля
 */
function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

/**
 * Округляет сумму вверх до рубля, предварительно убрав шум плавающей точки
 * @note без округления до копеек 0,045 × 18 000 даёт 810,0000000000001 и ceil вернул бы 811
 * @param value сумма в рублях
 * @returns целое число рублей, не меньше исходной суммы
 */
function ceilRoubles(value: number): number {
  return Math.ceil(Math.round(value * 100) / 100)
}

/**
 * Считает объём одной штуки по внешним размерам
 * @note для профилированных изделий это объём по габариту, без вычета пазов
 * @param thicknessMm толщина в миллиметрах
 * @param widthMm     ширина в миллиметрах
 * @param lengthMm    длина в миллиметрах
 * @returns объём в м³ либо null, если хотя бы один размер не положительное конечное число
 */
export function getPieceVolume(thicknessMm: number, widthMm: number, lengthMm: number): number | null {
  if (![thicknessMm, widthMm, lengthMm].every(isPositiveNumber)) {
    return null
  }

  return (thicknessMm * widthMm * lengthMm) / 1_000_000_000
}

/**
 * Считает цену одной штуки по объёму и цене кубометра
 * @param pieceVolume       объём штуки в м³
 * @param pricePerCubicMeter цена за кубометр в рублях
 * @returns цену в рублях, округлённую вверх до рубля, либо null при некорректных данных
 */
export function getPiecePrice(pieceVolume: number, pricePerCubicMeter: number): number | null {
  if (!isPositiveNumber(pieceVolume) || !isPositiveNumber(pricePerCubicMeter)) {
    return null
  }

  const price = ceilRoubles(pieceVolume * pricePerCubicMeter)
  return Number.isFinite(price) ? price : null
}

/**
 * Переводит объём в целое число штук
 * @param volume      нужный объём в м³
 * @param pieceVolume объём одной штуки в м³
 * @returns число штук, округлённое вверх до целой доски, либо null при некорректных данных
 */
export function getPiecesForVolume(volume: number, pieceVolume: number): number | null {
  if (!isPositiveNumber(volume) || !isPositiveNumber(pieceVolume)) {
    return null
  }

  // Отношение, кратное целому, не должно уходить в следующую штуку из-за шума плавающей точки.
  return Math.ceil(Math.round((volume / pieceVolume) * 1_000_000) / 1_000_000)
}

/**
 * Считает объём, число штук и стоимость партии «от»
 * @note стоимость партии считается по общему объёму, а не как штуки × цена штуки,
 *       поэтому может отличаться от произведения на несколько рублей
 * @param input размеры, цена кубометра, количество и его единица
 * @returns расчёт либо null, если размеры, цена или количество некорректны
 */
export function calculateLumber(input: LumberCalculationInput): LumberCalculation | null {
  const pieceVolume = getPieceVolume(input.thicknessMm, input.widthMm, input.lengthMm)
  const piecePrice = pieceVolume === null ? null : getPiecePrice(pieceVolume, input.pricePerCubicMeter)
  if (pieceVolume === null || piecePrice === null) {
    return null
  }

  let pieces: number | null
  if (input.unit === 'шт.') {
    pieces = Number.isInteger(input.quantity) && input.quantity >= 1 && input.quantity <= maxCalculatorPieces
      ? input.quantity
      : null
  }
  else if (input.unit === 'м³') {
    pieces = isPositiveNumber(input.quantity) && input.quantity <= maxCalculatorVolume
      ? getPiecesForVolume(input.quantity, pieceVolume)
      : null
  }
  else {
    pieces = null
  }

  if (pieces === null) {
    return null
  }

  const totalVolume = pieceVolume * pieces
  const totalPrice = ceilRoubles(totalVolume * input.pricePerCubicMeter)
  if (!Number.isFinite(totalVolume) || !Number.isFinite(totalPrice)) {
    return null
  }

  return { pieceVolume, pieces, totalVolume, piecePrice, totalPrice }
}

/**
 * Разворачивает таблицу в строки «сечение — длина — объём штуки»
 * @param table размерная таблица
 * @returns строки в порядке: сначала все сечения первой длины, затем следующей
 */
export function getSizeTableRows(table: ProductSizeTable): SizeTableRow[] {
  return table.lengthsMm.flatMap((lengthMm) =>
    table.sections.flatMap((section) => {
      const pieceVolume = getPieceVolume(section[0], section[1], lengthMm)
      return pieceVolume === null ? [] : [{ section, lengthMm, pieceVolume }]
    }),
  )
}

/**
 * Выбирает таблицы, все позиции которых входят в переданный список
 * @param productIds идентификаторы позиций прайса, например `landing.productIds`
 * @returns таблицы в порядке `productSizeTables`
 */
export function getSizeTablesForProducts(productIds: readonly string[]): ProductSizeTable[] {
  return productSizeTables.filter((table) =>
    table.columns.every((column) => productIds.includes(column.productId)),
  )
}

/**
 * Находит позицию прайса с ценой за кубометр для колонки таблицы
 * @param column колонка размерной таблицы
 * @returns позицию с числовой ценой за м³ либо undefined, если цена по запросу или единица не м³
 */
export function getSizeTableProduct(column: SizeTableColumn): (PriceListProduct & { price: number }) | undefined {
  const product = priceListProducts.find((item) => item.id === column.productId)
  return product && product.price !== null && product.unit === 'м³'
    ? { ...product, price: product.price }
    : undefined
}

/**
 * Форматирует сечение для вывода: «50×150»
 * @param section сечение
 * @returns строку с знаком умножения без единиц
 */
export function formatSection(section: LumberSection): string {
  return `${section[0]}×${section[1]}`
}

/**
 * Форматирует объём в м³ с четырьмя знаками после запятой
 * @param volume объём в м³
 * @returns строку вида «0,0450»
 */
export function formatVolume(volume: number): string {
  return volume.toLocaleString('ru-RU', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

/**
 * Форматирует сумму в рублях с разделителями групп
 * @param value сумма в рублях
 * @returns строку вида «18 000 ₽»
 */
export function formatRoubles(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`
}
