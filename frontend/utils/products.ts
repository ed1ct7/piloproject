/**
 * Прайс-лист пилорамы.
 *
 * Единственный источник товарных позиций для главной страницы, каталога
 * `/pilomaterialy` и микроразметки Product/Offer. Цены указаны в рублях
 * за кубометр; перед расчётом наличие и стоимость подтверждаются.
 */
export interface PriceListProduct {
  /** Стабильный идентификатор позиции для корзины и localStorage. */
  id: string
  /** Порядковый номер позиции в каталоге, отображается в вёрстке. */
  number: string
  /** Реальная категория исходного каталога. */
  category: ProductCategory
  /** Название позиции с размерами. */
  title: string
  /** Цена в рублях за кубометр. */
  price: number
  /** Единица измерения цены и количества. */
  unit: 'м³'
  /** Путь к фотографии позиции в `public/images`. */
  image: string
  /** Альтернативный текст фотографии. */
  alt: string
  /** Краткое фактическое описание позиции. */
  description: string
  /** Пары «характеристика — значение» для таблицы спецификации. */
  specs: [string, string][]
}

export const productCategories = [
  { value: 'brusok-suhoi-stroganyi', label: 'Брусок сухой строганый' },
  { value: 'doska-estestvennoi-vlazhnosti', label: 'Доска естественной влажности' },
  { value: 'doska-kamernoi-sushki', label: 'Доска камерной сушки' },
  { value: 'doska-suhaya', label: 'Доска сухая' },
  { value: 'imitatsiya-brusa', label: 'Имитация бруса' },
  { value: 'reika-suhaya-stroganaya', label: 'Рейка сухая строганая' },
] as const

export type ProductCategory = (typeof productCategories)[number]['value']

export const priceListProducts: PriceListProduct[] = [
  {
    id: 'suhoi-stroganyi-brusok-45x45x3000',
    number: '01',
    category: 'brusok-suhoi-stroganyi',
    title: 'Сухой строганый брусок 45*45*3000 мм',
    price: 28000,
    unit: 'м³',
    image: '/images/brusok-suhoi-stroganyi-45x45.jpg',
    alt: 'Штабель сухого строганого бруска 45×45 мм на складе пилорамы',
    description:
      'Сухой строганый брусок сечением 45×45 мм и длиной 3000 мм.',
    specs: [
      ['Сечение', '45×45 мм'],
      ['Длина', '3000 мм'],
      ['Состояние', 'Сухой, строганый'],
    ],
  },
  {
    id: 'suhaya-stroganaya-reika-20x45x3000',
    number: '02',
    category: 'reika-suhaya-stroganaya',
    title: 'Сухая строганая рейка 20*45*3000 мм',
    price: 25000,
    unit: 'м³',
    image: '/images/reika-suhaya-stroganaya-20x45.jpg',
    alt: 'Пачки сухой строганой рейки 20×45 мм, подготовленные к отгрузке',
    description:
      'Сухая строганая рейка сечением 20×45 мм и длиной 3000 мм.',
    specs: [
      ['Сечение', '20×45 мм'],
      ['Длина', '3000 мм'],
      ['Состояние', 'Сухая, строганая'],
    ],
  },
  {
    id: 'suhaya-doska-kamernoi-sushki-25x100-25x125x6000',
    number: '03',
    category: 'doska-kamernoi-sushki',
    title: 'Сухая доска камерной сушки 25*100*6000 и 25*125*6000 мм',
    price: 21000,
    unit: 'м³',
    image: '/images/doska-kamernoi-sushki-25x100.jpg',
    alt: 'Штабель доски камерной сушки на площадке пилорамы',
    description:
      'Доска камерной сушки сечением 25×100 или 25×125 мм и длиной 6000 мм.',
    specs: [
      ['Сечение', '25×100, 25×125 мм'],
      ['Длина', '6000 мм'],
      ['Влажность', 'Камерная сушка'],
    ],
  },
  {
    id: 'imitatsiya-brusa-20x145x6000-ili-3000',
    number: '04',
    category: 'imitatsiya-brusa',
    title: 'Имитация бруса 20*145*6000 или 3000 мм',
    price: 38000,
    unit: 'м³',
    image: '/images/imitatsiya-brusa-20x145.jpg',
    alt: 'Упакованная имитация бруса 20×145 мм на складе',
    description:
      'Имитация бруса сечением 20×145 мм, длиной 6000 или 3000 мм.',
    specs: [
      ['Сечение', '20×145 мм'],
      ['Длина', '6000 / 3000 мм'],
      ['Тип', 'Имитация бруса'],
    ],
  },
  {
    id: 'suhaya-stroganaya-doska-45x95x6000-ili-3000',
    number: '05',
    category: 'doska-suhaya',
    title: 'Сухая строганая доска 45*95*6000 или 3000 мм',
    price: 30000,
    unit: 'м³',
    image: '/images/doska-suhaya-stroganaya-45x95.jpg',
    alt: 'Сухая строганая доска 45×95 мм в пачках',
    description:
      'Сухая строганая доска сечением 45×95 мм, длиной 6000 или 3000 мм.',
    specs: [
      ['Сечение', '45×95 мм'],
      ['Длина', '6000 / 3000 мм'],
      ['Влажность', 'Камерная сушка'],
    ],
  },
  {
    id: 'imitatsiya-brusa-av-20x145x6000-karelskii-ship',
    number: '06',
    category: 'imitatsiya-brusa',
    title: 'Имитация бруса АВ 20*145*6000 "Карельский шип"',
    price: 38000,
    unit: 'м³',
    image: '/images/imitatsiya-brusa-av-karelskii-ship.jpg',
    alt: 'Имитация бруса сорта АВ с профилем «Карельский шип»',
    description:
      'Имитация бруса сорта АВ сечением 20×145 мм, длиной 6000 мм, профиль «Карельский шип».',
    specs: [
      ['Сечение', '20×145 мм'],
      ['Длина', '6000 мм'],
      ['Сорт и профиль', 'АВ, «Карельский шип»'],
    ],
  },
  {
    id: 'doska-suhaya-ognebiozashchita',
    number: '07',
    category: 'doska-suhaya',
    title: 'Доска сухая, любого сечения, обработанная огнебиозащитным составом',
    price: 25000,
    unit: 'м³',
    image: '/images/doska-suhaya-ognebiozashchita.jpg',
    alt: 'Сухая доска, обработанная огнебиозащитным составом',
    description:
      'Сухая доска любого сечения с обработкой огнебиозащитным составом.',
    specs: [
      ['Сечение', 'Любое из наличия'],
      ['Обработка', 'Огнебиозащитный состав'],
      ['Влажность', 'Сухая'],
    ],
  },
  {
    id: 'doska-estestvennoi-vlazhnosti-ognebiozashchita',
    number: '08',
    category: 'doska-estestvennoi-vlazhnosti',
    title: 'Доска естественной влажности, любого сечения, обработанная огнебиозащитным составом',
    price: 20500,
    unit: 'м³',
    image: '/images/doska-estestvennoi-vlazhnosti-ognebiozashchita.jpg',
    alt: 'Доска естественной влажности после обработки огнебиозащитой',
    description:
      'Доска естественной влажности любого сечения с огнебиозащитной обработкой.',
    specs: [
      ['Сечение', 'Любое из наличия'],
      ['Обработка', 'Огнебиозащитный состав'],
      ['Влажность', 'Естественная'],
    ],
  },
]

/** Форматирует цену в рублях с пробелами между разрядами: `28 000 ₽/м³`. */
export function formatPricePerCubicMeter(price: number): string {
  return `${price.toLocaleString('ru-RU')} ₽/м³`
}
