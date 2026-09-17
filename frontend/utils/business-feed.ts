import { priceListProducts } from './products'
import { siteUrl } from './seo-routes'
import { businessRequisites } from './business'

/**
 * YML-фид товаров для источника «YML-фид» в блоке «Товары и услуги»
 * рекламных материалов рекламной подписки Яндекс Бизнеса.
 *
 * @note цена каждого оффера берётся из `utils/products.ts` — единственного
 *       источника цен на сайте — по `id`, а не хранится здесь повторно: так
 *       фид не может разойтись с ценами в каталоге и корзине. Здесь заданы
 *       только атрибуты, которые нужны исключительно для рекламного фида и
 *       которые не следует брать из карточки каталога: короткое название
 *       под формат объявления, посадочная ссылка на сайте и описание без
 *       служебных фраз каталога.
 * @note набор из 8 позиций и их состав согласованы отдельно и не выводятся
 *       автоматически из полного прайс-листа: в фид входят только позиции
 *       с посадочной страницей и предсказуемой ценой, без вариантов «цена
 *       по запросу».
 */
export interface BusinessFeedOfferSource {
  /** Идентификатор позиции, совпадает с `id` в `utils/products.ts`. */
  id: string
  /** Название предложения в фиде. */
  name: string
  /** Путь посадочной страницы товара на сайте, без домена. */
  path: string
  /** Путь к изображению товара в `public/images`, без домена. */
  picture: string
  /** Краткое описание предложения для фида. */
  description: string
}

/** Единственная товарная категория фида: у сайта один ассортимент — пиломатериалы. */
export const businessFeedCategoryId = 1

/** Название единственной категории фида. */
export const businessFeedCategoryName = 'Пиломатериалы'

/** Код валюты фида — российский рубль. */
export const businessFeedCurrencyId = 'RUR'

export const businessFeedOfferSources: BusinessFeedOfferSource[] = [
  {
    id: 'doska-ev-sort-2',
    name: 'Доска обрезная ЕВ, II сорт',
    path: '/doska',
    picture: '/images/sawn-board-stack-2025-04-02.jpg',
    description: 'Доска естественной влажности второго сорта, хвоя. Сечения 25×100–50×200 мм, длина 6 м. Цена за куб, на сайте — за штуку.',
  },
  {
    id: 'doska-ev-sort-3',
    name: 'Доска обрезная ЕВ, III сорт',
    path: '/doska',
    picture: '/images/lumber-stack-2025-03-07.jpg',
    description: 'Доска третьего сорта для опалубки, обрешётки и временных конструкций. Сечения 25×100–50×200 мм, длина 6 м.',
  },
  {
    id: 'doska-suhaya-kamernoi-sushki',
    name: 'Доска сухая камерной сушки',
    path: '/suhaya-doska',
    picture: '/images/doska-kamernoi-sushki-25x100.jpg',
    description: 'Сушим в своей камере. Сечения 25×100/125/150, 40×100/150/200, 50×100/150/200 мм.',
  },
  {
    id: 'doska-suhaya-stroganaya',
    name: 'Доска сухая строганая',
    path: '/suhaya-doska',
    picture: '/images/doska-suhaya-stroganaya-45x95.jpg',
    description: 'Сухая строганая доска, сечения 20×95–45×195 мм, длина 3 и 6 м.',
  },
  {
    id: 'imitatsiya-brusa-20x145',
    name: 'Имитация бруса 20×145 мм',
    path: '/imitatsiya-brusa',
    picture: '/images/imitatsiya-brusa-20x145.jpg',
    description: 'Профилируем сами, длина 3 и 6 м. Расчёт на фасад по площади.',
  },
  {
    id: 'vagonka-shtil-12-5x120x3000',
    name: 'Вагонка «Штиль» 12,5×120×3000 мм',
    path: '/vagonka',
    picture: '/images/vagonka-shtil-12-5x120x3000.png',
    description: 'Хвоя, своё производство. Цена за штуку, расчёт по площади стен.',
  },
  {
    id: 'evrovagonka-12-5x95x3000',
    name: 'Евровагонка 12,5×95×3000 мм',
    path: '/vagonka',
    picture: '/images/vagonka-shtil-12-5x120x3000.png',
    description: 'Хвоя, своё производство. Цена за штуку, расчёт по площади стен.',
  },
  {
    id: 'doska-ev-ognebio-sort-2',
    name: 'Доска с огнебиозащитой, II сорт',
    path: '/ognebiozashchita',
    picture: '/images/doska-s-ognebiozashchitoi.jpg',
    description: 'Доска естественной влажности II сорта с огнебиозащитной обработкой на площадке. Доплата 2 000 ₽/м³ к цене доски.',
  },
]

/** Оффер фида с ценой из прайс-листа и абсолютными ссылками. */
export interface BusinessFeedOffer extends BusinessFeedOfferSource {
  /** Цена в рублях, целое число, взята из `utils/products.ts` по `id`. */
  price: number
  /** Абсолютная ссылка на посадочную страницу товара. */
  url: string
  /** Абсолютная ссылка на изображение товара. */
  pictureUrl: string
}

/**
 * Подставляет в источники офферов актуальную цену из прайс-листа и
 * достраивает абсолютные ссылки на посадочную страницу и картинку.
 * @param sources источники офферов фида
 * @param baseUrl абсолютный адрес сайта для ссылок и картинок
 * @returns офферы, готовые для рендера в XML
 */
export function buildBusinessFeedOffers(
  sources: BusinessFeedOfferSource[] = businessFeedOfferSources,
  baseUrl: string = siteUrl,
): BusinessFeedOffer[] {
  return sources.map((source) => {
    const product = priceListProducts.find((item) => item.id === source.id)
    if (!product) {
      throw new Error(`Позиция фида "${source.id}" не найдена в utils/products.ts`)
    }
    if (product.price === null) {
      throw new Error(`У позиции фида "${source.id}" цена по запросу — такую позицию нельзя включать в фид`)
    }

    return {
      ...source,
      price: product.price,
      url: `${baseUrl}${source.path}`,
      pictureUrl: `${baseUrl}${source.picture}`,
    }
  })
}

/** Экранирует спецсимволы XML (`&`, `<`, `>`, `"`, `'`) в текстовом узле или значении атрибута. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Строит XML YML-фида целиком: `yml_catalog` → `shop` → `offers`.
 * @param options.date    время сборки фида, подставляется в атрибут `date` `yml_catalog` (по умолчанию — текущее время)
 * @param options.baseUrl абсолютный адрес сайта для ссылок магазина, офферов и картинок (по умолчанию — `siteUrl`)
 * @returns строка с XML-документом фида в кодировке UTF-8
 */
export function renderBusinessFeedXml(options: { date?: Date, baseUrl?: string } = {}): string {
  const date = options.date ?? new Date()
  const baseUrl = options.baseUrl ?? siteUrl
  const offers = buildBusinessFeedOffers(businessFeedOfferSources, baseUrl)

  const offersXml = offers
    .map((offer) => [
      `      <offer id="${escapeXml(offer.id)}">`,
      `        <url>${escapeXml(offer.url)}</url>`,
      `        <price>${offer.price}</price>`,
      `        <currencyId>${businessFeedCurrencyId}</currencyId>`,
      `        <categoryId>${businessFeedCategoryId}</categoryId>`,
      `        <picture>${escapeXml(offer.pictureUrl)}</picture>`,
      `        <name>${escapeXml(offer.name)}</name>`,
      `        <description>${escapeXml(offer.description)}</description>`,
      '      </offer>',
    ].join('\n'))
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date.toISOString()}">
  <shop>
    <name>${escapeXml('Пилорама Разбегаево')}</name>
    <company>${escapeXml(businessRequisites.shortName)}</company>
    <url>${escapeXml(baseUrl)}/</url>
    <currencies>
      <currency id="${businessFeedCurrencyId}" rate="1"/>
    </currencies>
    <categories>
      <category id="${businessFeedCategoryId}">${escapeXml(businessFeedCategoryName)}</category>
    </categories>
    <offers>
${offersXml}
    </offers>
  </shop>
</yml_catalog>
`
}
