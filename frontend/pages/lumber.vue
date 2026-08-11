<script setup lang="ts">
import type { ProductCategory } from '~/utils/products'

definePageMeta({
  path: '/pilomaterialy',
})

const selectedCategory = ref<'all' | ProductCategory>('all')
const filteredProducts = computed(() => selectedCategory.value === 'all'
  ? priceListProducts
  : priceListProducts.filter((product) => product.category === selectedCategory.value))
const { addProduct } = useCart()

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
    <section class="max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:pb-9 max-[560px]:pt-8 grid min-h-[280px] items-end border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] pb-12 pt-14">
      <div class="max-w-[760px] [&_h1]:mb-0">
        <h1>Каталог пиломатериалов</h1>
      </div>
    </section>

    <section class="max-[560px]:px-[18px] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-0 max-[560px]:pb-14" aria-label="Каталог пиломатериалов с ценами">
      <div class="border-b border-[#171916] py-7">
        <p class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.75rem] font-[760] uppercase tracking-[0.08em] text-[#5e625c]">Показать</p>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Фильтр по категории">
          <button
            class="min-h-10 cursor-pointer border border-[#77796f] bg-transparent px-4 py-2 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[700] transition-colors hover:border-[#1f3a2f] hover:text-[#1f3a2f]"
            :class="selectedCategory === 'all' ? 'border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7]' : 'text-[#393d37]'"
            type="button"
            :aria-pressed="selectedCategory === 'all'"
            @click="selectedCategory = 'all'"
          >Все</button>
          <button
            v-for="category in productCategories"
            :key="category.value"
            class="min-h-10 cursor-pointer border border-[#77796f] bg-transparent px-4 py-2 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[700] transition-colors hover:border-[#1f3a2f] hover:text-[#1f3a2f]"
            :class="selectedCategory === category.value ? 'border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7]' : 'text-[#393d37]'"
            type="button"
            :aria-pressed="selectedCategory === category.value"
            @click="selectedCategory = category.value"
          >{{ category.label }}</button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-x-6 gap-y-8 py-10 max-[1040px]:grid-cols-2 max-[680px]:grid-cols-1 max-[560px]:py-8">
        <article v-for="product in filteredProducts" :key="product.id" class="flex min-w-0 flex-col border border-[#aaa69b] bg-[#fffdf7]">
          <figure class="aspect-[4/3] overflow-hidden border-b border-[#aaa69b] bg-[#d8d2c6] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
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

          <div class="flex flex-1 flex-col px-5 pb-5 pt-5 max-[560px]:px-4">
            <header class="mb-5">
              <h2 class="mb-0 !text-[clamp(1.35rem,1.8vw,1.75rem)] !leading-[1.12]">{{ product.displayTitle }}</h2>
            </header>

            <dl class="m-0 mb-6 border-t border-[#aaa69b] [&_div]:grid [&_div]:grid-cols-[minmax(92px,0.68fr)_1fr] [&_div]:gap-3 [&_div]:border-b [&_div]:border-[#d3cec3] [&_div]:py-2.5 [&_dd]:m-0 [&_dd]:text-[0.92rem] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.72rem] [&_dt]:font-[760] [&_dt]:uppercase [&_dt]:tracking-[0.04em] [&_dt]:text-[#5e625c]">
              <div v-for="row in product.specs" :key="row[0]">
                <dt>{{ row[0] }}</dt>
                <dd>{{ row[1] }}</dd>
              </div>
            </dl>

            <div class="mt-auto flex items-end justify-between gap-4 border-t-2 border-[#171916] pt-5">
              <div>
                <p class="mb-1 font-[Segoe_UI,Arial,sans-serif] text-[0.72rem] font-[760] uppercase tracking-[0.06em] text-[#5e625c]">Цена за 1 {{ product.unit }}</p>
                <p class="mb-0 whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] text-[clamp(1.3rem,1.8vw,1.7rem)] font-extrabold leading-none text-[#a53e10]">{{ formatProductPrice(product) }}</p>
              </div>
              <button
                v-if="product.price !== null"
                class="min-h-11 shrink-0 cursor-pointer border-0 bg-[#d65a1f] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] transition-colors duration-150 hover:bg-[#a53e10]"
                type="button"
                :aria-label="`Добавить в заявку: ${product.title}`"
                @click="addProduct(product.id)"
              >В заявку</button>
              <NuxtLink
                v-else
                class="inline-flex min-h-11 shrink-0 items-center bg-[#d65a1f] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] no-underline transition-colors duration-150 hover:bg-[#a53e10]"
                to="/kontakty"
              >Уточнить цену</NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-7 flex justify-end max-[560px]:justify-start">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/kontakty">Уточнить наличие</NuxtLink>
      </div>
    </section>

  </main>
</template>
