/**
 * Актуальный прайс-лист пилорамы.
 *
 * Единственный источник товарных позиций для главной страницы, каталога
 * `/pilomaterialy`, корзины и микроразметки. Значение `price: null` означает,
 * что стоимость необходимо подтвердить у менеджера до добавления в корзину.
 */
export interface PriceListProduct {
  /** Стабильный идентификатор позиции для корзины и localStorage. */
  id: string
  /** Порядковый номер позиции в каталоге, отображается в вёрстке. */
  number: string
  /** Категория, согласованная с новой структурой каталога. */
  category: ProductCategory
  /** Полное название позиции. */
  title: string
  /** Короткое название для карточки каталога. */
  displayTitle: string
  /** Минимальная или фиксированная цена; `null` — цена по запросу. */
  price: number | null
  /** Показывать цену как минимальную: «от 18 000 ₽/м³». */
  pricePrefix?: 'от'
  /** Единица измерения цены и количества. */
  unit: 'м³' | 'шт.'
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
  { value: 'doska-estestvennoi-vlazhnosti', label: 'Доска естественной влажности' },
  { value: 'doska-ev-ognebio', label: 'Доска с огнебиозащитой' },
  { value: 'doska-suhaya', label: 'Доска сухая' },
  { value: 'doska-suhaya-ognebio', label: 'Сухая с огнебиозащитой' },
  { value: 'doska-suhaya-stroganaya', label: 'Доска сухая строганая' },
  { value: 'imitatsiya-brusa', label: 'Имитация бруса' },
  { value: 'vagonka', label: 'Вагонка' },
] as const

export type ProductCategory = (typeof productCategories)[number]['value']

export const priceListProducts: PriceListProduct[] = [
  {
    id: 'doska-ev-sort-1',
    number: '01',
    category: 'doska-estestvennoi-vlazhnosti',
    title: 'Доска естественной влажности, I сорт',
    displayTitle: 'Доска ЕВ, I сорт',
    price: 18000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/sawn-board-stack-2025-04-02.jpg',
    alt: 'Штабель доски естественной влажности первого сорта',
    description: 'Доска естественной влажности первого сорта. Сечения и наличие подтверждает менеджер.',
    specs: [
      ['Сорт', 'I'],
      ['Влажность', 'Естественная'],
      ['Сечения', 'Уточняйте наличие'],
    ],
  },
  {
    id: 'doska-ev-sort-2',
    number: '02',
    category: 'doska-estestvennoi-vlazhnosti',
    title: 'Доска естественной влажности, II сорт',
    displayTitle: 'Доска ЕВ, II сорт',
    price: 13000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/lumber-stack-2025-03-07.jpg',
    alt: 'Штабель доски естественной влажности второго сорта',
    description: 'Доска естественной влажности второго сорта. Сечения и наличие подтверждает менеджер.',
    specs: [
      ['Сорт', 'II'],
      ['Влажность', 'Естественная'],
      ['Сечения', 'Уточняйте наличие'],
    ],
  },
  {
    id: 'doska-ev-sort-3',
    number: '03',
    category: 'doska-estestvennoi-vlazhnosti',
    title: 'Доска естественной влажности, III сорт',
    displayTitle: 'Доска ЕВ, III сорт',
    price: 4500,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Партия доски естественной влажности третьего сорта на площадке',
    description: 'Доска естественной влажности третьего сорта. Сечения и наличие подтверждает менеджер.',
    specs: [
      ['Сорт', 'III'],
      ['Влажность', 'Естественная'],
      ['Сечения', 'Уточняйте наличие'],
    ],
  },
  {
    id: 'doska-ev-ognebio-sort-1',
    number: '04',
    category: 'doska-ev-ognebio',
    title: 'Доска естественной влажности с огнебиозащитой, I сорт',
    displayTitle: 'Доска ЕВ с огнебиозащитой, I сорт',
    price: 20000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/doska-estestvennoi-vlazhnosti-ognebiozashchita.jpg',
    alt: 'Доска естественной влажности первого сорта после огнебиозащитной обработки',
    description: 'Доска первого сорта с огнебиозащитной обработкой. Цена включает доплату 2 000 ₽/м³.',
    specs: [
      ['Сорт', 'I'],
      ['Обработка', 'Огнебиозащитная'],
      ['Влажность', 'Естественная'],
    ],
  },
  {
    id: 'doska-ev-ognebio-sort-2',
    number: '05',
    category: 'doska-ev-ognebio',
    title: 'Доска естественной влажности с огнебиозащитой, II сорт',
    displayTitle: 'Доска ЕВ с огнебиозащитой, II сорт',
    price: 15000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/doska-s-ognebiozashchitoi.jpg',
    alt: 'Доска естественной влажности второго сорта с огнебиозащитной обработкой',
    description: 'Доска второго сорта с огнебиозащитной обработкой. Цена включает доплату 2 000 ₽/м³.',
    specs: [
      ['Сорт', 'II'],
      ['Обработка', 'Огнебиозащитная'],
      ['Влажность', 'Естественная'],
    ],
  },
  {
    id: 'doska-ev-ognebio-sort-3',
    number: '06',
    category: 'doska-ev-ognebio',
    title: 'Доска естественной влажности с огнебиозащитой, III сорт',
    displayTitle: 'Доска ЕВ с огнебиозащитой, III сорт',
    price: 6500,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/sklad-obrabotannoi-doski.jpg',
    alt: 'Обработанная огнебиозащитой доска третьего сорта на складе',
    description: 'Доска третьего сорта с огнебиозащитной обработкой. Цена включает доплату 2 000 ₽/м³.',
    specs: [
      ['Сорт', 'III'],
      ['Обработка', 'Огнебиозащитная'],
      ['Влажность', 'Естественная'],
    ],
  },
  {
    id: 'doska-suhaya-kamernoi-sushki',
    number: '07',
    category: 'doska-suhaya',
    title: 'Доска сухая камерной сушки',
    displayTitle: 'Доска сухая',
    price: 20500,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/doska-kamernoi-sushki-25x100.jpg',
    alt: 'Штабель сухой доски камерной сушки на складе',
    description: 'Сухая доска камерной сушки в основных строительных сечениях.',
    specs: [
      ['Сечения', '25×100/125/150; 40×100/150/200; 50×100/150/200 мм'],
      ['Влажность', 'Камерная сушка'],
    ],
  },
  {
    id: 'doska-suhaya-ognebio',
    number: '08',
    category: 'doska-suhaya-ognebio',
    title: 'Доска сухая с огнебиозащитной обработкой',
    displayTitle: 'Сухая доска с огнебиозащитой',
    price: null,
    unit: 'м³',
    image: '/images/doska-suhaya-ognebiozashchita.jpg',
    alt: 'Сухая доска после огнебиозащитной обработки',
    description: 'Сухая доска камерной сушки с огнебиозащитной обработкой. Стоимость подтверждает менеджер.',
    specs: [
      ['Сечения', 'Любые из наличия'],
      ['Обработка', 'Огнебиозащитная'],
      ['Цена', 'По запросу'],
    ],
  },
  {
    id: 'doska-suhaya-stroganaya',
    number: '09',
    category: 'doska-suhaya-stroganaya',
    title: 'Доска сухая строганая, любые сечения',
    displayTitle: 'Доска сухая строганая',
    price: 27000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/doska-suhaya-stroganaya-45x95.jpg',
    alt: 'Пачки сухой строганой доски на складе',
    description: 'Сухая строганая доска в сечениях по наличию и под заказ.',
    specs: [
      ['Сечения', 'Любые по согласованию'],
      ['Состояние', 'Сухая, строганая'],
    ],
  },
  {
    id: 'imitatsiya-brusa-20x145',
    number: '10',
    category: 'imitatsiya-brusa',
    title: 'Имитация бруса 20×145 мм',
    displayTitle: 'Имитация бруса',
    price: 33000,
    pricePrefix: 'от',
    unit: 'м³',
    image: '/images/imitatsiya-brusa-20x145.jpg',
    alt: 'Упакованная имитация бруса сечением 20×145 мм',
    description: 'Имитация бруса сечением 20×145 мм, длиной 3000 или 6000 мм.',
    specs: [
      ['Сечение', '20×145 мм'],
      ['Длина', '3000 / 6000 мм'],
    ],
  },
  {
    id: 'evrovagonka-12-5x95x3000',
    number: '11',
    category: 'vagonka',
    title: 'Евровагонка 12,5×95×3000 мм',
    displayTitle: 'Евровагонка',
    price: 125,
    pricePrefix: 'от',
    unit: 'шт.',
    image: '/images/evrovagonka-12-5x95x3000.png',
    alt: 'Штабель сосновой евровагонки с профилем шип-паз',
    description: 'Евровагонка из хвойной древесины размером 12,5×95×3000 мм.',
    specs: [
      ['Размер', '12,5×95×3000 мм'],
      ['Профиль', 'Евровагонка'],
    ],
  },
  {
    id: 'vagonka-shtil-12-5x120x3000',
    number: '12',
    category: 'vagonka',
    title: 'Вагонка «Штиль» 12,5×120×3000 мм',
    displayTitle: 'Вагонка «Штиль»',
    price: 145,
    pricePrefix: 'от',
    unit: 'шт.',
    image: '/images/vagonka-shtil-12-5x120x3000.png',
    alt: 'Штабель сосновой вагонки профиля Штиль',
    description: 'Вагонка профиля «Штиль» размером 12,5×120×3000 мм.',
    specs: [
      ['Размер', '12,5×120×3000 мм'],
      ['Профиль', 'Штиль'],
    ],
  },
]

/** Форматирует цену товара с учётом префикса и единицы измерения. */
export function formatProductPrice(product: Pick<PriceListProduct, 'price' | 'pricePrefix' | 'unit'>): string {
  if (product.price === null) {
    return 'Цена по запросу'
  }

  const prefix = product.pricePrefix ? `${product.pricePrefix} ` : ''
  return `${prefix}${product.price.toLocaleString('ru-RU')} ₽/${product.unit}`
}
