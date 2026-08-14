<script setup lang="ts">
import type { PriceListProduct } from '~/utils/products'

definePageMeta({
  path: '/pilomaterialy',
})

type CatalogFilterValue = 'all' | 'natural' | 'fireProtection' | 'dryBoard' | 'planedBoard' | 'imitatsiyaBrusa' | 'vagonka'

const selectedCategory = ref<CatalogFilterValue>('all')
const filteredProducts = computed(() => priceListProducts.filter((product) =>
  isProductInSelectedFilter(product, selectedCategory.value),
))
const filteredProductsCount = computed(() => filteredProducts.value.length)
const selectedProduct = ref<PriceListProduct | null>(null)
const { addProduct, totalQuantity } = useCart()
const productDialog = useTemplateRef<HTMLDialogElement>('product-dialog')
const closeDialogButton = useTemplateRef<HTMLButtonElement>('close-dialog-button')
const catalogFilterScroll = useTemplateRef<HTMLDivElement>('catalog-filter-scroll')
const catalogStatusMessage = ref('')
const dialogStatusMessage = ref('')
const filterCanScrollForward = ref(false)
const recentlyAddedProduct = ref<{ id: string, source: 'catalog' | 'dialog' } | null>(null)
let productDialogTrigger: HTMLElement | null = null
let catalogStatusTimeout: ReturnType<typeof setTimeout> | undefined
let dialogStatusTimeout: ReturnType<typeof setTimeout> | undefined
let recentlyAddedTimeout: ReturnType<typeof setTimeout> | undefined

const categoryFilterOptions: { label: string, value: CatalogFilterValue }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Доска ЕВ', value: 'natural' },
  { label: 'Огнебио', value: 'fireProtection' },
  { label: 'Сухая', value: 'dryBoard' },
  { label: 'Строганая', value: 'planedBoard' },
  { label: 'Имитация бруса', value: 'imitatsiyaBrusa' },
  { label: 'Вагонка', value: 'vagonka' },
]

type ProductCategoryGroup = 'ev' | 'evOgnebio' | 'dryBoard' | 'imitatsiyaBrusa' | 'vagonka'

/** Текстовый ярлык категории на карточке: категорию кодирует подпись, не цвет фона. */
const productCategoryLabels: Record<ProductCategoryGroup, string> = {
  ev: 'Доска ЕВ',
  evOgnebio: 'ЕВ · огнебио',
  dryBoard: 'Сухая доска',
  imitatsiyaBrusa: 'Имитация бруса',
  vagonka: 'Вагонка',
}

function getProductCategoryGroup(product: PriceListProduct): ProductCategoryGroup {
  if (product.id.startsWith('doska-ev-ognebio')) {
    return 'evOgnebio'
  }

  if (product.id.startsWith('doska-ev-')) {
    return 'ev'
  }

  if (product.id.startsWith('doska-suhaya')) {
    return 'dryBoard'
  }

  if (product.id.startsWith('imitatsiya-brusa')) {
    return 'imitatsiyaBrusa'
  }

  return 'vagonka'
}

function getProductCategoryLabel(product: PriceListProduct): string {
  return productCategoryLabels[getProductCategoryGroup(product)]
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
  title: 'Пиломатериалы в Разбегаево – доска, вагонка и цены',
  description: 'Каталог пилорамы в Разбегаево: доска естественной влажности по сортам, сухая и строганая доска, огнебиозащита, имитация бруса и вагонка.',
  ogTitle: 'Пиломатериалы в Разбегаево — каталог с ценами',
  ogDescription: 'Актуальные группы пиломатериалов с минимальными ценами за м³ и штуку от производителя.',
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
    itemListElement: priceListProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: `${siteUrl}${product.image}`,
        offers: product.price === null
          ? undefined
          : {
              '@type': 'AggregateOffer',
              lowPrice: product.price,
              priceCurrency: 'RUB',
              offerCount: 1,
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
      <div class="max-w-[760px] [&_h1]:mb-0">
        <h1>Каталог пиломатериалов</h1>
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

      <TransitionGroup name="catalog-products" tag="div" class="grid auto-rows-fr grid-cols-4 gap-5 py-10 max-[1180px]:grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:py-8">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card flex h-full min-w-0 flex-col border border-(--color-line) bg-(--color-paper)"
        >
          <figure data-parallax="6" class="h-[165px] overflow-hidden border-b border-(--color-line) bg-(--color-sand) max-[900px]:h-[185px] max-[560px]:h-[190px] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
            <NuxtImg
              :src="product.image"
              :alt="product.alt"
              width="900"
              height="1200"
              sizes="xs:100vw sm:50vw lg:34vw"
              densities="1"
              format="webp"
              loading="lazy"
            />
          </figure>

          <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
            <header class="mb-3 min-h-[50px] max-[560px]:min-h-0">
              <p class="mb-1.5 font-[Segoe_UI,Arial,sans-serif] text-[0.68rem] font-[760] uppercase tracking-[0.08em] text-(--color-ink)/70">{{ getProductCategoryLabel(product) }}</p>
              <h2 class="mb-0 !text-[clamp(1.15rem,1.35vw,1.45rem)] !leading-[1.12]">{{ product.displayTitle }}</h2>
            </header>

            <div class="grid gap-3 border-t border-(--color-line) pt-4">
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

      <div class="mt-7 flex justify-end max-[560px]:justify-start">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper) disabled:cursor-not-allowed disabled:opacity-50" to="/kontakty">Уточнить наличие</NuxtLink>
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
