<script setup lang="ts">
import type { PriceListProduct } from '~/utils/products'

definePageMeta({
  path: '/pilomaterialy',
})

type CatalogFilterValue = 'all' | 'natural' | 'fireProtection' | 'dryBoard' | 'planedBoard' | 'brusokReika' | 'imitatsiyaBrusa' | 'vagonka'

const selectedCategory = ref<CatalogFilterValue>('all')
const filteredProducts = computed<PriceListProduct[]>(() => priceListProducts.filter((product) =>
  isProductInSelectedFilter(product, selectedCategory.value),
))
const filteredProductsCount = computed(() => filteredProducts.value.length)

/** Группы карточек каталога с собственным H2 (контракт п.5): пустые группы после фильтра скрываются. */
const catalogProductGroups: { id: string, heading: string, categories: PriceListProduct['category'][] }[] = [
  { id: 'ev-group', heading: 'Доска естественной влажности', categories: ['doska-estestvennoi-vlazhnosti', 'doska-ev-ognebio'] },
  { id: 'dry-group', heading: 'Сухая и строганая доска', categories: ['doska-suhaya', 'doska-suhaya-ognebio', 'doska-suhaya-stroganaya'] },
  { id: 'brusok-group', heading: 'Брусок и рейка', categories: ['brusok-i-reika'] },
  { id: 'finish-group', heading: 'Отделочные материалы', categories: ['imitatsiya-brusa', 'vagonka'] },
]

const groupedFilteredProducts = computed(() => catalogProductGroups
  .map((group) => ({
    id: group.id,
    heading: group.heading,
    // Тип параметра указан явно: вывод типов здесь замыкается на саму
    // `groupedFilteredProducts` и без аннотации даёт `any`.
    products: filteredProducts.value.filter((product: PriceListProduct) => group.categories.includes(product.category)),
  }))
  .filter((group) => group.products.length > 0))

const selectedProduct = ref<PriceListProduct | null>(null)
const { addProduct, totalQuantity } = useCart()
const productDialog = useTemplateRef<HTMLDialogElement>('product-dialog')
const closeDialogButton = useTemplateRef<HTMLButtonElement>('close-dialog-button')
const catalogFilterScroll = useTemplateRef<HTMLDivElement>('catalog-filter-scroll')
/** Размерные таблицы всех позиций — калькулятору по-прежнему нужны все сразу. */
const sizeTables = getSizeTablesForProducts(priceListProducts.map((product) => product.id))

/**
 * Компактные ссылки на секции размеров посадочных вместо пяти полных таблиц
 * каталога (контракт: дубли таблиц между /pilomaterialy и посадочными).
 * @note цена «от» за куб — минимум по позициям группы, посчитан из products.ts,
 *       а не переписан числом, чтобы не разойтись с прайсом при его изменении
 */
interface CatalogSizeLink {
  label: string
  to: string
  priceFrom: number
}

const catalogSizeLinkGroups: { label: string, to: string, productIds: string[] }[] = [
  { label: 'Доска обрезная естественной влажности', to: '/doska#sizes', productIds: ['doska-ev-sort-1', 'doska-ev-sort-2', 'doska-ev-sort-3'] },
  { label: 'Сухая и строганая доска, брусок и рейка', to: '/suhaya-doska#sizes', productIds: ['doska-suhaya-kamernoi-sushki', 'doska-suhaya-stroganaya', 'brusok-45x45', 'reika-20x45'] },
  { label: 'Доска с огнебиозащитой', to: '/ognebiozashchita#sizes', productIds: ['doska-ev-ognebio-sort-1', 'doska-ev-ognebio-sort-2', 'doska-ev-ognebio-sort-3'] },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa#sizes', productIds: ['imitatsiya-brusa-20x145'] },
]

const catalogSizeLinks: CatalogSizeLink[] = catalogSizeLinkGroups.flatMap(({ label, to, productIds }) => {
  const prices = productIds
    .map((id) => priceListProducts.find((product) => product.id === id)?.price)
    .filter((price): price is number => typeof price === 'number')

  return prices.length ? [{ label, to, priceFrom: Math.min(...prices) }] : []
})
const catalogStatusMessage = ref('')
const dialogStatusMessage = ref('')
const filterCanScrollForward = ref(false)
const recentlyAddedProduct = ref<{ id: string, source: 'catalog' | 'dialog' } | null>(null)
let productDialogTrigger: HTMLElement | null = null
let catalogStatusTimeout: ReturnType<typeof setTimeout> | undefined
let dialogStatusTimeout: ReturnType<typeof setTimeout> | undefined
let recentlyAddedTimeout: ReturnType<typeof setTimeout> | undefined

/** Ссылки на посадочные страницы поисковых кластеров каталога. */
const catalogTopicLinks = [
  { label: 'Доска обрезная', to: '/doska' },
  { label: 'Сухая и строганая доска', to: '/suhaya-doska' },
  { label: 'Вагонка', to: '/vagonka' },
  { label: 'Имитация бруса', to: '/imitatsiya-brusa' },
  { label: 'Огнебиозащита', to: '/ognebiozashchita' },
  { label: 'Доставка по СПб и области', to: '/dostavka' },
]

const categoryFilterOptions: { label: string, value: CatalogFilterValue }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Доска ЕВ', value: 'natural' },
  { label: 'Огнебио', value: 'fireProtection' },
  { label: 'Сухая', value: 'dryBoard' },
  { label: 'Строганая', value: 'planedBoard' },
  { label: 'Брусок и рейка', value: 'brusokReika' },
  { label: 'Имитация бруса', value: 'imitatsiyaBrusa' },
  { label: 'Вагонка', value: 'vagonka' },
]

type ProductCategoryGroup = 'ev' | 'evOgnebio' | 'dryBoard' | 'brusokReika' | 'imitatsiyaBrusa' | 'vagonka'

/** Текстовый ярлык категории на карточке: категорию кодирует подпись, не цвет фона. */
const productCategoryLabels: Record<ProductCategoryGroup, string> = {
  ev: 'Доска ЕВ',
  evOgnebio: 'ЕВ · огнебио',
  dryBoard: 'Сухая доска',
  brusokReika: 'Брусок и рейка',
  imitatsiyaBrusa: 'Имитация бруса',
  vagonka: 'Вагонка',
}

/** Ярлык категории ведёт на посадочную страницу кластера (контракт п.5). */
const productCategoryLandingRoutes: Record<ProductCategoryGroup, string> = {
  ev: '/doska',
  evOgnebio: '/ognebiozashchita',
  dryBoard: '/suhaya-doska',
  brusokReika: '/suhaya-doska',
  imitatsiyaBrusa: '/imitatsiya-brusa',
  vagonka: '/vagonka',
}

/**
 * Сопоставление категории прайса (`utils/products.ts`) с группой ярлыка каталога.
 * @note группа определяется по `product.category`, а не по префиксу `id`: раньше
 *       любой id, не начинавшийся на известный префикс, молча получал ярлык
 *       «Вагонка». `Record<ProductCategory, …>` требует ветку для каждой категории —
 *       новая категория без записи здесь не скомпилируется, а не тихо съедет в vagonka.
 */
const categoryGroupByCategory: Record<PriceListProduct['category'], ProductCategoryGroup> = {
  'doska-estestvennoi-vlazhnosti': 'ev',
  'doska-ev-ognebio': 'evOgnebio',
  'doska-suhaya': 'dryBoard',
  'doska-suhaya-ognebio': 'dryBoard',
  'doska-suhaya-stroganaya': 'dryBoard',
  'brusok-i-reika': 'brusokReika',
  'imitatsiya-brusa': 'imitatsiyaBrusa',
  'vagonka': 'vagonka',
}

function getProductCategoryGroup(product: PriceListProduct): ProductCategoryGroup {
  return categoryGroupByCategory[product.category]
}

function getProductCategoryLabel(product: PriceListProduct): string {
  return productCategoryLabels[getProductCategoryGroup(product)]
}

function getProductCategoryLink(product: PriceListProduct): string {
  return productCategoryLandingRoutes[getProductCategoryGroup(product)]
}

function getProductDialogImageSrcset(product: PriceListProduct): string {
  const imagePath = product.image.replace(/^\//, '')
  return [
    `/_ipx/f_webp&q_82&s_480x640/${imagePath} 480w`,
    `/_ipx/f_webp&q_82&s_720x960/${imagePath} 720w`,
  ].join(', ')
}

function isProductInSelectedFilter(product: PriceListProduct, filter: CatalogFilterValue): boolean {
  if (filter === 'all') {
    return true
  }

  if (filter === 'natural') {
    return product.category === 'doska-estestvennoi-vlazhnosti'
  }

  if (filter === 'fireProtection') {
    return product.category === 'doska-ev-ognebio' || product.category === 'doska-suhaya-ognebio'
  }

  if (filter === 'dryBoard') {
    return product.category === 'doska-suhaya'
  }

  if (filter === 'planedBoard') {
    return product.category === 'doska-suhaya-stroganaya'
  }

  if (filter === 'brusokReika') {
    return product.category === 'brusok-i-reika'
  }

  if (filter === 'imitatsiyaBrusa') {
    return product.category === 'imitatsiya-brusa'
  }

  return product.category === 'vagonka'
}

async function openProductDetails(product: PriceListProduct, event?: Event): Promise<void> {
  productDialogTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null
  selectedProduct.value = product
  await nextTick()

  if (productDialog.value && !productDialog.value.open) {
    productDialog.value.showModal()
    closeDialogButton.value?.focus()
  }
}

function closeProductDetails(): void {
  if (productDialog.value?.open) {
    productDialog.value.close()
    return
  }

  finishClosingProductDetails()
}

function finishClosingProductDetails(): void {
  selectedProduct.value = null
  nextTick(() => productDialogTrigger?.focus())
}

function handleDialogBackdropClick(event: MouseEvent): void {
  if (event.target === productDialog.value) {
    closeProductDetails()
  }
}

function updateFilterScrollAffordance(): void {
  const filterScroll = catalogFilterScroll.value
  if (!filterScroll) {
    filterCanScrollForward.value = false
    return
  }

  filterCanScrollForward.value = filterScroll.scrollLeft + filterScroll.clientWidth < filterScroll.scrollWidth - 2
}

function isProductRecentlyAdded(productId: string, source: 'catalog' | 'dialog'): boolean {
  return recentlyAddedProduct.value?.id === productId && recentlyAddedProduct.value.source === source
}

function showStatusMessage(message: string, source: 'catalog' | 'dialog'): void {
  const messageRef = source === 'dialog' ? dialogStatusMessage : catalogStatusMessage
  const activeTimeout = source === 'dialog' ? dialogStatusTimeout : catalogStatusTimeout
  messageRef.value = message
  if (activeTimeout) {
    clearTimeout(activeTimeout)
  }

  const nextTimeout = setTimeout(() => {
    messageRef.value = ''
  }, 2600)
  if (source === 'dialog') {
    dialogStatusTimeout = nextTimeout
  }
  else {
    catalogStatusTimeout = nextTimeout
  }
}

function addProductWithFeedback(product: PriceListProduct, source: 'catalog' | 'dialog'): void {
  addProduct(product.id)
  recentlyAddedProduct.value = { id: product.id, source }
  if (recentlyAddedTimeout) {
    clearTimeout(recentlyAddedTimeout)
  }
  recentlyAddedTimeout = setTimeout(() => {
    recentlyAddedProduct.value = null
  }, 2200)
  showStatusMessage(`${product.displayTitle}: добавлено в заявку. Товаров в заявке: ${totalQuantity.value}`, source)
}

onMounted(() => {
  nextTick(updateFilterScrollAffordance)
  window.addEventListener('resize', updateFilterScrollAffordance)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateFilterScrollAffordance)
  if (catalogStatusTimeout) {
    clearTimeout(catalogStatusTimeout)
  }
  if (dialogStatusTimeout) {
    clearTimeout(dialogStatusTimeout)
  }
  if (recentlyAddedTimeout) {
    clearTimeout(recentlyAddedTimeout)
  }
})

useSeoMeta({
  // Тексты 8.2 аудита: страница переведена в прайс-лист под покупательский запрос.
  title: 'Каталог пиломатериалов: цены за куб и за штуку',
  description: 'Прайс-лист пилорамы в Разбегаево: 14 позиций — доска, сухая и строганая, огнебиозащита, брусок, рейка, имитация бруса, вагонка. Цены за м³ и за штуку, калькулятор объёма.',
  ogTitle: 'Каталог пиломатериалов от производителя — цены за куб и за штуку',
  ogDescription: 'Доска, сухая и строганая, брусок, рейка, имитация бруса и вагонка с производства в Разбегаево. Цены от производителя, доставка по Ленобласти и Санкт-Петербургу.',
  ogImage: `${siteUrl}/images/sawn-board-stack-2025-04-02.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/pilomaterialy`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/pilomaterialy` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Пиломатериалы', item: '/pilomaterialy' },
    ],
  }),
  defineItemList({
    name: 'Пиломатериалы пилорамы в Разбегаево',
    // Позиции с ценой «по запросу» (price: null) исключены: Product без offers —
    // ошибка структурированных данных в Google, а не просто пустое поле.
    itemListElement: priceListProducts
      .filter((product): product is PriceListProduct & { price: number } => product.price !== null)
      .map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: `${siteUrl}${product.image}`,
          offers: {
            // AggregateOffer с lowPrice — это цена «от …» из прайса.
            '@type': 'AggregateOffer',
            lowPrice: product.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/pilomaterialy`,
          },
        },
      })),
  }),
])
</script>

<template>
  <main>
    <section class="max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 grid min-h-[280px] items-end border-b border-[#171916] bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14 max-[560px]:[&_h1]:!text-[2.75rem] max-[390px]:[&_h1]:!text-[2.55rem]">
      <div class="max-w-[860px] [&_h1]:mb-0">
        <p class="eyebrow">Цены производства</p>
        <h1>Каталог пиломатериалов и цены за куб и за штуку</h1>
        <p class="mb-0 mt-4 max-w-[680px] leading-[1.6] text-(--color-ink)/85">
          Купить пиломатериалы от производителя в Разбегаево: доска обрезная от 4 500 ₽/м³,
          сухая и строганая доска, брусок и рейка, имитация бруса и вагонка от 125 ₽/шт.
          Работаем оптом и в розницу, доставляем по Санкт-Петербургу и Ленинградской области;
          доступен самовывоз с площадки в Ломоносовском районе.
        </p>
        <p class="mb-0 mt-4 max-w-[680px] leading-[1.6] text-(--color-ink)/85">
          Наличие и итоговую стоимость партии подтвердит менеджер. Оплата — по факту отгрузки.
          <a href="#purchase-conditions" class="underline underline-offset-4">Как оформить заказ</a>
        </p>
      </div>
    </section>

    <section class="max-[560px]:px-[18px] bg-(--color-cream) px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-0 max-[560px]:pb-14" aria-label="Каталог пиломатериалов с ценами">
      <div class="sticky top-[76px] z-20 -mx-[max(24px,calc((100vw_-_1280px)/2))] border-y border-(--color-sand) bg-(--color-cream)/95 px-[max(24px,calc((100vw_-_1280px)/2))] py-1.5 backdrop-blur max-[1100px]:top-[120px] max-[840px]:top-16 max-[560px]:-mx-[18px] max-[560px]:px-[18px] max-[560px]:py-1">
        <div class="flex min-w-0 items-center gap-2">
          <div class="relative min-w-0 flex-1">
            <div
              ref="catalog-filter-scroll"
              class="flex min-w-0 gap-1.5 overflow-x-auto overscroll-x-contain py-0.5 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Фильтр по категории"
              @scroll="updateFilterScrollAffordance"
            >
              <button
                v-for="option in categoryFilterOptions"
                :key="option.value"
                class="min-h-11 shrink-0 cursor-pointer rounded-[6px] border px-3 font-[Segoe_UI,Arial,sans-serif] text-[0.82rem] font-[760] leading-none transition-colors duration-150 max-[560px]:text-[0.8rem]"
                :class="selectedCategory === option.value ? 'border-(--color-forest) bg-(--color-forest) text-(--color-paper) shadow-[inset_0_-3px_0_var(--color-copper)]' : 'border-(--color-sand) bg-(--color-paper) text-(--color-ink) hover:bg-(--color-sand)'"
                type="button"
                :aria-pressed="selectedCategory === option.value"
                @click="selectedCategory = option.value"
              >{{ option.label }}</button>
            </div>

            <span
              v-if="filterCanScrollForward"
              class="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-(--color-cream) via-(--color-cream)/90 to-transparent pr-1 text-lg font-bold text-(--color-forest)"
              aria-hidden="true"
            >→</span>
          </div>

          <span class="inline-flex min-h-11 shrink-0 items-center rounded-[6px] border border-(--color-line) px-2 font-[Segoe_UI,Arial,sans-serif] text-[0.74rem] font-[760] leading-none text-(--color-forest) max-[560px]:text-[0.7rem]" aria-live="polite" aria-atomic="true">{{ filteredProductsCount }} поз.</span>
        </div>
      </div>

      <div class="catalog-groups grid gap-14 py-10 max-[560px]:gap-10 max-[560px]:py-8">
        <section
          v-for="group in groupedFilteredProducts"
          :key="group.id"
          :aria-labelledby="group.id"
        >
          <h2 :id="group.id" class="catalog-group__title">{{ group.heading }}</h2>

          <TransitionGroup name="catalog-products" tag="div" class="grid auto-rows-fr grid-cols-4 gap-5 max-[1180px]:grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            <article
              v-for="product in group.products"
              :key="product.id"
              class="product-card flex h-full min-w-0 flex-col border border-(--color-line) bg-(--color-paper)"
            >
              <figure data-parallax="6" class="h-[165px] overflow-hidden border-b border-(--color-line) bg-(--color-sand) max-[900px]:h-[185px] max-[560px]:h-[190px] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                <NuxtImg
                  :src="product.image"
                  :alt="product.alt"
                  width="900"
                  height="506"
                  sizes="xs:100vw sm:50vw md:40vw lg:34vw xl:26vw xxl:22vw"
                  densities="1 2"
                  format="webp"
                  loading="lazy"
                />
              </figure>

              <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
                <header class="mb-3 min-h-[50px] max-[560px]:min-h-0">
                  <NuxtLink
                    :to="getProductCategoryLink(product)"
                    class="mb-1.5 inline-block font-[Segoe_UI,Arial,sans-serif] text-[0.68rem] font-[760] uppercase tracking-[0.08em] text-(--color-ink)/70 no-underline transition-colors duration-150 hover:text-(--color-copper)"
                  >{{ getProductCategoryLabel(product) }}</NuxtLink>
                  <h3 class="mb-0 !text-[clamp(1.15rem,1.35vw,1.45rem)] !leading-[1.12]">{{ product.displayTitle }}</h3>
                </header>

                <dl class="product-card__specs mb-5 grid gap-2 text-[0.88rem] leading-[1.5] text-(--color-ink)/85">
                  <div v-for="[label, value] in product.specs" :key="label">
                    <dt class="font-semibold">{{ label }}</dt>
                    <dd class="m-0">{{ value }}</dd>
                  </div>
                </dl>

                <div class="mt-auto grid gap-3 border-t border-(--color-line) pt-4">
                  <div>
                    <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)/70">Цена за 1 {{ product.unit }}</p>
                    <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.18rem,1.5vw,1.45rem)] font-extrabold leading-none text-(--color-copper)">{{ formatProductPrice(product) }}</p>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <button
                      class="catalog-card-action inline-flex min-h-11 w-max items-center border-0 border-b-2 border-current bg-transparent px-1 font-[Segoe_UI,Arial,sans-serif] text-[0.88rem] font-[760] text-(--color-ink) transition-colors duration-150 hover:text-(--color-copper)"
                      type="button"
                      @click="openProductDetails(product, $event)"
                    >Подробнее</button>
                    <button
                      v-if="product.price !== null"
                      class="catalog-card-action inline-flex min-h-11 w-max shrink-0 cursor-pointer items-center border-0 border-b-2 border-current bg-transparent px-2 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-extrabold leading-none text-(--color-copper) transition-colors duration-150 hover:text-(--color-copper-dark)"
                      :class="{ 'recently-added-action': isProductRecentlyAdded(product.id, 'catalog') }"
                      type="button"
                      :aria-label="`Добавить в заявку: ${product.title}`"
                      @click="addProductWithFeedback(product, 'catalog')"
                    ><span aria-hidden="true">{{ isProductRecentlyAdded(product.id, 'catalog') ? 'Добавлено ✓' : 'В заявку' }}</span></button>
                    <NuxtLink
                      v-else
                      class="catalog-card-action inline-flex min-h-11 w-max shrink-0 items-center border-0 border-b-2 border-current bg-transparent px-1 font-[Segoe_UI,Arial,sans-serif] text-[0.88rem] font-[760] text-(--color-copper) no-underline transition-colors duration-150 hover:text-(--color-copper-dark)"
                      to="/kontakty"
                    >Уточнить цену</NuxtLink>
                  </div>
                </div>
              </div>
            </article>
          </TransitionGroup>
        </section>
      </div>

      <div class="mt-7 flex justify-end max-[560px]:justify-start">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper) disabled:cursor-not-allowed disabled:opacity-50" to="/kontakty">Уточнить наличие</NuxtLink>
      </div>

      <nav class="mt-10 flex flex-wrap gap-x-7 gap-y-3.5 border-t border-(--color-line) pt-6" aria-label="Разделы каталога">
        <NuxtLink
          v-for="topic in catalogTopicLinks"
          :key="topic.to"
          class="inline-block w-max border-b border-current font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[740] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)"
          :to="topic.to"
        >{{ topic.label }}</NuxtLink>
      </nav>
    </section>

    <section
      id="sizes"
      class="border-t border-(--color-line) bg-(--color-paper) px-[max(24px,calc((100vw_-_1280px)/2))] py-14 max-[560px]:px-[18px] max-[560px]:py-10"
      aria-labelledby="catalog-sizes-title"
    >
      <header class="mb-8 max-w-[760px]">
        <p class="eyebrow">Сечения и расчёт</p>
        <h2 id="catalog-sizes-title" class="mb-4">Сечения и цена за штуку</h2>
        <p class="mb-0 leading-[1.6] text-(--color-ink)/85">
          Полные таблицы сечений с ценой за штуку — на странице каждого материала. Здесь —
          минимальная цена за кубометр по группе и ссылка на нужную таблицу.
        </p>
      </header>

      <ul class="catalog-size-links">
        <li v-for="link in catalogSizeLinks" :key="link.to">
          <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          <span>от {{ formatRoubles(link.priceFrom) }}/м³</span>
        </li>
      </ul>

      <p class="mb-0 mt-6 max-w-[760px] leading-[1.6] text-(--color-ink)/85">{{ timberNote }}</p>

      <div class="mt-10 border-t border-(--color-line) pt-8">
        <ProductCalculator :tables="sizeTables" />
      </div>
    </section>

    <section id="purchase-conditions" class="catalog-purchase" aria-labelledby="purchase-title">
      <header>
        <p class="eyebrow">Заказ с производства</p>
        <h2 id="purchase-title">Как купить пиломатериалы</h2>
      </header>
      <ol class="catalog-purchase__steps">
        <li>
          <h3>Выберите материал</h3>
          <p>Добавьте позиции в предварительную заявку. У доски и имитации бруса количество считается в м³, у вагонки — в штуках. Подготовьте нужные сечения, длины и объём партии.</p>
        </li>
        <li>
          <h3>Передайте список менеджеру</h3>
          <p>Откройте <NuxtLink to="/cart">предварительную заявку</NuxtLink>, скопируйте список и самостоятельно отправьте его в MAX. Также можно позвонить и назвать материалы и размеры.</p>
        </li>
        <li>
          <h3>Согласуйте получение и оплату</h3>
          <p>Менеджер подтвердит наличие, итоговую цену и условия получения. Заказ считается подтверждённым после его звонка. Оплата — по факту отгрузки.</p>
        </li>
      </ol>
      <div class="catalog-purchase__delivery">
        <div>
          <h3>Доставка по Ленобласти и Санкт-Петербургу</h3>
          <p>Стоимость доставки рассчитывается по адресу и объёму партии. Машину и день доставки согласуем с менеджером. Можно забрать материал самостоятельно с производства в Разбегаево.</p>
          <nav aria-label="Условия получения пиломатериалов">
            <NuxtLink to="/dostavka">Условия доставки</NuxtLink>
            <NuxtLink to="/kontakty">Адрес и самовывоз</NuxtLink>
          </nav>
        </div>
        <div>
          <p class="font-semibold">Уточнить наличие и стоимость</p>
          <a :href="businessPhoneHref">{{ businessPhone }}</a>
          <p>{{ businessWorkingHours }}</p>
          <a :href="businessMaxUrl" target="_blank" rel="noopener noreferrer">Обсудить заказ в MAX</a>
        </div>
      </div>
    </section>

    <dialog
      v-if="selectedProduct"
      ref="product-dialog"
      class="fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-screen max-w-none place-items-center border-0 bg-[rgba(23,25,22,0.54)] px-5 py-8 open:grid"
      :aria-labelledby="`product-details-${selectedProduct.id}`"
      @click="handleDialogBackdropClick"
      @close="finishClosingProductDetails"
    >
      <article class="grid max-h-[min(760px,calc(100vh_-_48px))] w-[min(940px,100%)] grid-cols-[minmax(260px,0.86fr)_minmax(0,1.14fr)] overflow-auto border-t-[6px] border-t-(--color-forest) bg-(--color-paper) shadow-[0_28px_80px_rgba(23,25,22,0.36)] max-[760px]:grid-cols-1">
        <figure class="min-h-[420px] overflow-hidden border-r border-(--color-line) bg-(--color-sand) max-[760px]:min-h-[260px] max-[760px]:border-r-0 max-[760px]:border-b [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          <img
            :src="selectedProduct.image"
            :srcset="getProductDialogImageSrcset(selectedProduct)"
            sizes="(max-width: 760px) calc(100vw - 40px), 400px"
            :alt="selectedProduct.alt"
            width="900"
            height="1200"
            loading="eager"
            decoding="async"
          />
        </figure>

        <div class="flex min-w-0 flex-col p-7 max-[560px]:p-5">
          <div class="mb-6 flex items-start justify-between gap-5">
            <div>
              <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.78rem] font-[760] uppercase tracking-[0.08em] text-(--color-ink)/70">{{ getProductCategoryLabel(selectedProduct) }}</p>
              <h2 :id="`product-details-${selectedProduct.id}`" class="mb-0 !text-[clamp(1.55rem,2.3vw,2.4rem)]">{{ selectedProduct.displayTitle }}</h2>
            </div>
            <button
              ref="close-dialog-button"
              class="grid size-11 shrink-0 place-items-center border border-(--color-ink) bg-(--color-paper) text-2xl leading-none transition-colors hover:bg-(--color-ink) hover:text-(--color-paper)"
              type="button"
              aria-label="Закрыть подробности"
              @click="closeProductDetails"
            >×</button>
          </div>

          <p class="mb-6 max-w-[560px] text-[1rem] leading-[1.6] text-(--color-ink)/85">{{ selectedProduct.description }}</p>

          <dl class="m-0 mb-7 border-t border-(--color-line) [&_div]:grid [&_div]:grid-cols-[minmax(120px,0.45fr)_1fr] [&_div]:gap-4 [&_div]:border-b [&_div]:border-(--color-line) [&_div]:px-4 [&_div]:py-3 [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:font-semibold [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.76rem] [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:tracking-[0.04em] [&_dt]:text-(--color-ink)/70 max-[560px]:[&_div]:grid-cols-1 max-[560px]:[&_div]:gap-1">
            <div v-for="row in selectedProduct.specs" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          </dl>

          <div class="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-(--color-line) px-4 pb-4 pt-5">
            <div>
              <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-(--color-ink)/70">Цена за 1 {{ selectedProduct.unit }}</p>
              <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.35rem,2vw,1.9rem)] font-extrabold leading-none text-(--color-copper)">{{ formatProductPrice(selectedProduct) }}</p>
            </div>
            <button
              v-if="selectedProduct.price !== null"
              class="min-h-11 cursor-pointer border-0 bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) transition-colors duration-150 hover:bg-(--color-copper-dark)"
              :class="{ 'recently-added-dialog-action': isProductRecentlyAdded(selectedProduct.id, 'dialog') }"
              type="button"
              :aria-label="`Добавить в заявку: ${selectedProduct.title}`"
              @click="addProductWithFeedback(selectedProduct, 'dialog')"
            ><span aria-hidden="true">{{ isProductRecentlyAdded(selectedProduct.id, 'dialog') ? 'Добавлено ✓' : 'В заявку' }}</span></button>
            <NuxtLink
              v-else
              class="inline-flex min-h-11 items-center justify-center bg-(--color-copper) px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-paper) no-underline transition-colors duration-150 hover:bg-(--color-copper-dark)"
              to="/kontakty"
            >Уточнить цену</NuxtLink>
          </div>
          <UiStatusMessage class="mt-4" :message="dialogStatusMessage" />
        </div>
      </article>
    </dialog>

    <UiStatusMessage :message="catalogStatusMessage" floating />

  </main>
</template>

<style scoped>
.catalog-purchase {
  scroll-margin-top: 140px;
  border-block: 1px solid var(--color-line);
  padding: 56px max(24px, calc((100vw - 1280px) / 2));
  background: var(--color-sand);
}
.catalog-purchase h2 { margin-bottom: 32px; }
.catalog-purchase h3 { margin-bottom: 16px; font-size: 1.3rem; }
.catalog-purchase p { margin-bottom: 16px; line-height: 1.6; }
.catalog-purchase__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-bottom: 32px;
  padding-left: 24px;
  list-style: decimal;
}
.catalog-purchase__steps li { padding-left: 8px; }
.catalog-purchase__steps li::marker { font-weight: 800; }
.catalog-purchase__delivery {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 40px;
  border-top: 1px solid var(--color-line);
  padding-top: 32px;
}
.catalog-purchase a { color: var(--color-forest); text-decoration: underline; text-underline-offset: 4px; }
.catalog-purchase nav { display: flex; flex-wrap: wrap; gap: 12px 24px; }
.catalog-purchase nav a, .catalog-purchase__delivery > div > a { display: inline-flex; min-height: 44px; align-items: center; }
@media (max-width: 840px) {
  .catalog-purchase__steps, .catalog-purchase__delivery { grid-template-columns: minmax(0, 1fr); gap: 24px; }
}
@media (max-width: 560px) {
  .catalog-purchase { padding: 40px 18px; }
}

/* Заголовок группы карточек — тот же Georgia через глобальный `.site-shell h2`,
   но мельче: на странице их четыре подряд, полноразмерный h2 был бы избыточен */
.catalog-group__title {
  margin-bottom: 24px;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 400;
}

/* Компактный список ссылок на секции размеров посадочных вместо пяти таблиц */
.catalog-size-links {
  display: grid;
  max-width: 760px;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-line);
}

.catalog-size-links li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-line);
}

.catalog-size-links a {
  color: var(--color-forest);
  font-weight: 740;
  text-decoration: none;
  border-bottom: 1px solid currentcolor;
  transition: color 160ms ease;
}

.catalog-size-links a:hover {
  color: var(--color-copper);
}

.catalog-size-links span {
  flex: none;
  color: var(--color-copper-dark);
  font-weight: 800;
  white-space: nowrap;
}

.product-card {
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.catalog-card-action {
  transition: color 160ms ease, background-color 160ms ease, transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
}

.recently-added-action {
  border-color: var(--color-forest);
  color: var(--color-forest);
}

.recently-added-dialog-action {
  background-color: var(--color-forest);
}

.catalog-products-enter-active,
.catalog-products-leave-active,
.catalog-products-move {
  transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

.catalog-products-enter-from,
.catalog-products-leave-to {
  opacity: 0;
  transform: scale(0.985);
}

@media (hover: hover) and (pointer: fine) {
  .product-card:hover {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .catalog-card-action {
    transition-property: color, background-color;
  }

  .catalog-products-enter-active,
  .catalog-products-leave-active,
  .catalog-products-move {
    transition: opacity 160ms ease;
  }

  .catalog-products-enter-from,
  .catalog-products-leave-to {
    transform: none;
  }
}
</style>
