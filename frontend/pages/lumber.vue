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
const selectedProductTone = computed(() => selectedProduct.value
  ? getProductCardTone(selectedProduct.value)
  : {})
const { addProduct } = useCart()

const categoryFilterOptions: { label: string, value: CatalogFilterValue }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Доска ЕВ', value: 'natural' },
  { label: 'Огнебио', value: 'fireProtection' },
  { label: 'Сухая', value: 'dryBoard' },
  { label: 'Строганая', value: 'planedBoard' },
  { label: 'Имитация бруса', value: 'imitatsiyaBrusa' },
  { label: 'Вагонка', value: 'vagonka' },
]

type ProductColorGroup = 'ev' | 'evOgnebio' | 'dryBoard' | 'imitatsiyaBrusa' | 'vagonka'

const productCardToneStyles: Record<ProductColorGroup, Record<string, string>> = {
  ev: {
    '--card-accent': '#7a451e',
    '--card-bg': '#f1dcc2',
    '--card-line': '#c49d73',
    '--card-panel': '#e3bf92',
  },
  evOgnebio: {
    '--card-accent': '#a8461e',
    '--card-bg': '#ead0bf',
    '--card-line': '#c88c6f',
    '--card-panel': '#d88b68',
  },
  dryBoard: {
    '--card-accent': '#2f5b45',
    '--card-bg': '#dce7d6',
    '--card-line': '#9bb18f',
    '--card-panel': '#c7d9bf',
  },
  imitatsiyaBrusa: {
    '--card-accent': '#365f68',
    '--card-bg': '#dbe5e2',
    '--card-line': '#97afb1',
    '--card-panel': '#b9ced0',
  },
  vagonka: {
    '--card-accent': '#756516',
    '--card-bg': '#ece1b8',
    '--card-line': '#b5a35a',
    '--card-panel': '#d8ca72',
  },
}

function getProductColorGroup(product: PriceListProduct): ProductColorGroup {
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

function getProductCardTone(product: PriceListProduct): Record<string, string> {
  return productCardToneStyles[getProductColorGroup(product)]
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

function openProductDetails(product: PriceListProduct): void {
  selectedProduct.value = product
}

function closeProductDetails(): void {
  selectedProduct.value = null
}

useSeoMeta({
  title: 'Пиломатериалы в Разбегаево – доска, вагонка и цены',
  description: 'Каталог пилорамы в Разбегаево: доска естественной влажности по сортам, сухая и строганая доска, огнебиозащита, имитация бруса и вагонка.',
  ogTitle: 'Пиломатериалы в Разбегаево — каталог с ценами',
  ogDescription: 'Актуальные группы пиломатериалов с минимальными ценами за м³ и штуку от производителя.',
  ogImage: `${siteUrl}/images/sawn-board-stack-2025-04-02.jpg`,
  ogType: 'website',
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
    <section class="max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 grid min-h-[280px] items-end border-b border-[#171916] bg-[#d6ded0] px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14 max-[560px]:[&_h1]:!text-[2.75rem] max-[390px]:[&_h1]:!text-[2.55rem]">
      <div class="max-w-[760px] [&_h1]:mb-0">
        <h1>Каталог пиломатериалов</h1>
      </div>
    </section>

    <section class="max-[560px]:px-[18px] bg-[#efe6d7] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-0 max-[560px]:pb-14" aria-label="Каталог пиломатериалов с ценами">
      <div class="sticky top-[72px] z-20 -mx-[max(24px,calc((100vw_-_1280px)/2))] border-y border-[#cbb99d] bg-[#efe6d7]/95 px-[max(24px,calc((100vw_-_1280px)/2))] py-1.5 shadow-[0_6px_14px_rgba(23,25,22,0.07)] backdrop-blur max-[840px]:top-16 max-[560px]:-mx-[18px] max-[560px]:px-[18px] max-[560px]:py-1">
        <div class="flex min-w-0 items-center gap-2">
          <div class="flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Фильтр по категории">
            <button
              v-for="option in categoryFilterOptions"
              :key="option.value"
              class="h-9 shrink-0 cursor-pointer rounded-[6px] border px-3 font-[Segoe_UI,Arial,sans-serif] text-[0.82rem] font-[760] leading-none transition-colors duration-150 hover:border-[#9b8d78] hover:bg-[#e3d6bf] max-[560px]:h-11 max-[560px]:px-3 max-[560px]:text-[0.8rem]"
              :class="selectedCategory === option.value ? 'border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7] shadow-[inset_0_-3px_0_#a8461e]' : 'border-[#cbb99d] bg-[#fff8eb] text-[#171916]'"
              type="button"
              :aria-pressed="selectedCategory === option.value"
              @click="selectedCategory = option.value"
            >{{ option.label }}</button>
          </div>

          <span class="shrink-0 rounded-[6px] border border-[#9aa98f] bg-[#d6ded0] px-2 py-1.5 font-[Segoe_UI,Arial,sans-serif] text-[0.74rem] font-[760] leading-none text-[#1f3a2f] max-[560px]:text-[0.7rem]">{{ filteredProductsCount }} поз.</span>
        </div>
      </div>

      <div class="grid auto-rows-fr grid-cols-4 gap-5 py-10 max-[1180px]:grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:py-8">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="flex h-full min-w-0 cursor-pointer flex-col border border-t-[6px] border-[#171916] border-t-[var(--card-accent)] bg-[var(--card-bg)] shadow-[0_14px_30px_rgba(23,25,22,0.13)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(23,25,22,0.2)]"
          :style="getProductCardTone(product)"
          tabindex="0"
          @click="openProductDetails(product)"
          @keydown.enter.prevent="openProductDetails(product)"
          @keydown.space.prevent="openProductDetails(product)"
        >
          <figure data-parallax="6" class="h-[165px] overflow-hidden border-b-4 border-[var(--card-accent)] bg-[var(--card-panel)] max-[900px]:h-[185px] max-[560px]:h-[190px] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
            <NuxtImg
              :src="product.image"
              :alt="product.alt"
              width="900"
              height="1200"
              sizes="xs:100vw sm:50vw lg:34vw"
              densities="1"
              format="webp"
              loading="eager"
            />
          </figure>

          <div class="flex flex-1 flex-col px-4 pb-4 pt-4">
            <header class="mb-3 min-h-[50px] max-[560px]:min-h-0">
              <h2 class="mb-0 !text-[clamp(1.15rem,1.35vw,1.45rem)] !leading-[1.12]">{{ product.displayTitle }}</h2>
            </header>

            <div class="grid gap-3 border-t-2 border-[var(--card-accent)] bg-[rgba(255,253,247,0.28)] px-3 pb-3 pt-4">
              <div>
                <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-[#5e625c]">Цена за 1 {{ product.unit }}</p>
                <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.18rem,1.5vw,1.45rem)] font-extrabold leading-none text-[var(--card-accent)]">{{ formatProductPrice(product) }}</p>
              </div>
              <div class="flex items-center justify-between gap-4">
                <button
                  class="w-max border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] text-[0.88rem] font-[760] text-[#1f3a2f] transition-colors duration-150 hover:text-[var(--card-accent)]"
                  type="button"
                  @click.stop="openProductDetails(product)"
                >Подробнее</button>
                <button
                  v-if="product.price !== null"
                  class="inline-flex w-max shrink-0 cursor-pointer items-center border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-extrabold leading-none text-[var(--card-accent)] transition-colors duration-150 hover:text-[#171916]"
                  type="button"
                  :aria-label="`Добавить в заявку: ${product.title}`"
                  @click.stop="addProduct(product.id)"
                >В заявку</button>
                <NuxtLink
                  v-else
                  class="w-max shrink-0 border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] text-[0.88rem] font-[760] text-[var(--card-accent)] no-underline transition-colors duration-150 hover:text-[#171916]"
                  to="/kontakty"
                  @click.stop
                >Уточнить цену</NuxtLink>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-7 flex justify-end max-[560px]:justify-start">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#a8461e] disabled:cursor-not-allowed disabled:opacity-50" to="/kontakty">Уточнить наличие</NuxtLink>
      </div>
    </section>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 grid place-items-center bg-[rgba(23,25,22,0.54)] px-5 py-8"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`product-details-${selectedProduct.id}`"
      @click.self="closeProductDetails"
      @keydown.esc="closeProductDetails"
    >
      <article class="grid max-h-[min(760px,calc(100vh_-_48px))] w-[min(940px,100%)] grid-cols-[minmax(260px,0.86fr)_minmax(0,1.14fr)] overflow-auto border border-t-[8px] border-[#171916] border-t-[var(--card-accent)] bg-[var(--card-bg)] shadow-[0_28px_80px_rgba(23,25,22,0.36)] max-[760px]:grid-cols-1" :style="selectedProductTone">
        <figure class="min-h-[420px] overflow-hidden border-r border-[#171916] bg-[var(--card-panel)] max-[760px]:min-h-[260px] max-[760px]:border-r-0 max-[760px]:border-b [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          <NuxtImg
            :src="selectedProduct.image"
            :alt="selectedProduct.alt"
            width="900"
            height="1200"
            sizes="xs:100vw md:45vw lg:38vw"
            densities="1"
            format="webp"
            loading="eager"
          />
        </figure>

        <div class="flex min-w-0 flex-col p-7 max-[560px]:p-5">
          <div class="mb-6 flex items-start justify-between gap-5">
            <div>
              <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.78rem] font-[760] uppercase tracking-[0.08em] text-[#4f554d]">Подробности</p>
              <h2 :id="`product-details-${selectedProduct.id}`" class="mb-0 !text-[clamp(1.55rem,2.3vw,2.4rem)]">{{ selectedProduct.displayTitle }}</h2>
            </div>
            <button
              class="grid size-11 shrink-0 place-items-center border border-[#171916] bg-[#fff8eb] text-2xl leading-none transition-colors hover:bg-[#171916] hover:text-[#fffdf7]"
              type="button"
              aria-label="Закрыть подробности"
              @click="closeProductDetails"
            >×</button>
          </div>

          <p class="mb-6 max-w-[560px] text-[1rem] leading-[1.6] text-[#30332e]">{{ selectedProduct.description }}</p>

          <dl class="m-0 mb-7 border-t border-[var(--card-line)] bg-[rgba(255,253,247,0.3)] [&_div]:grid [&_div]:grid-cols-[minmax(120px,0.45fr)_1fr] [&_div]:gap-4 [&_div]:border-b [&_div]:border-[var(--card-line)] [&_div]:px-4 [&_div]:py-3 [&_dd]:m-0 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:font-semibold [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.76rem] [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:tracking-[0.04em] [&_dt]:text-[#4f554d] max-[560px]:[&_div]:grid-cols-1 max-[560px]:[&_div]:gap-1">
            <div v-for="row in selectedProduct.specs" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          </dl>

          <div class="mt-auto flex flex-wrap items-end justify-between gap-4 border-t-2 border-[var(--card-accent)] bg-[rgba(255,253,247,0.24)] px-4 pb-4 pt-5">
            <div>
              <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-[#5e625c]">Цена за 1 {{ selectedProduct.unit }}</p>
              <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.35rem,2vw,1.9rem)] font-extrabold leading-none text-[var(--card-accent)]">{{ formatProductPrice(selectedProduct) }}</p>
            </div>
            <button
              v-if="selectedProduct.price !== null"
              class="min-h-11 cursor-pointer border-0 bg-[var(--card-accent)] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] shadow-[0_8px_18px_rgba(23,25,22,0.16)] transition-colors duration-150 hover:bg-[#171916]"
              type="button"
              :aria-label="`Добавить в заявку: ${selectedProduct.title}`"
              @click="addProduct(selectedProduct.id)"
            >В заявку</button>
            <NuxtLink
              v-else
              class="inline-flex min-h-11 items-center justify-center bg-[var(--card-accent)] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline shadow-[0_8px_18px_rgba(23,25,22,0.16)] transition-colors duration-150 hover:bg-[#171916]"
              to="/kontakty"
            >Уточнить цену</NuxtLink>
          </div>
        </div>
      </article>
    </div>

  </main>
</template>
