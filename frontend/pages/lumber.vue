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
  title: 'Пиломатериалы в Разбегаево – цены на доску, брусок, рейку за м³',
  description: 'Каталог пилорамы в Разбегаево с ценами за кубометр: сухой строганый брусок, рейка, доска камерной сушки, имитация бруса, огнебиозащитная обработка. Брус и заборная доска под заказ.',
  ogTitle: 'Пиломатериалы в Разбегаево — каталог с ценами',
  ogDescription: 'Сухая строганая доска, брусок, рейка и имитация бруса с ценами за м³ от производителя.',
  ogImage: `${siteUrl}/images/brusok-suhoi-stroganyi-45x45.jpg`,
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
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'RUB',
          url: `${siteUrl}/pilomaterialy`,
        },
      },
    })),
  }),
])
</script>

<template>
  <main>
    <section class="max-[840px]:grid-cols-1 max-[840px]:min-h-0 max-[560px]:block max-[560px]:px-[18px] max-[560px]:pb-10 max-[560px]:pt-[34px] grid min-h-[310px] grid-cols-[64px_minmax(380px,1.45fr)_minmax(280px,0.75fr)] items-center gap-8 border-b border-[#171916] px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14 bg-[#d8d2c6]">
      <div aria-hidden="true" />
      <div class="max-w-[760px] [&_h1]:mb-0">
        <h1>Каталог с ценами за кубометр</h1>
      </div>
      <p class="mb-0 max-w-[480px] text-[1.03rem] leading-[1.65] text-[#393d37]">
        Восемь позиций с фотографиями, размерами и ценами за м³.
      </p>
    </section>

    <section class="max-[560px]:px-[18px] bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-0 max-[560px]:pb-14" aria-label="Каталог пиломатериалов с ценами">
      <div class="border-b border-[#171916] py-7">
        <label class="font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase" for="catalog-category">Категория</label>
        <select id="catalog-category" v-model="selectedCategory" class="ml-4 min-h-11 border border-[#171916] bg-[#fffdf7] px-3 text-base">
          <option value="all">Все товары</option>
          <option v-for="category in productCategories" :key="category.value" :value="category.value">{{ category.label }}</option>
        </select>
      </div>

      <article v-for="product in filteredProducts" :key="product.id" class="max-[1100px]:grid-cols-[minmax(200px,0.56fr)_minmax(240px,0.58fr)_minmax(260px,1fr)] max-[1100px]:gap-8 max-[840px]:grid-cols-[0.58fr_1fr] max-[560px]:grid-cols-1 max-[560px]:gap-[26px] grid grid-cols-[minmax(210px,0.52fr)_minmax(260px,0.58fr)_minmax(320px,1fr)] gap-10 border-b border-[#171916] py-14 max-[560px]:py-10">
        <header>
          <h2>{{ product.title }}</h2>
          <p class="whitespace-nowrap font-[Segoe_UI,Arial,sans-serif] font-extrabold text-[#a53e10] mt-[22px] text-[clamp(1.4rem,2vw,1.9rem)] leading-none">{{ formatPricePerCubicMeter(product.price) }}</p>
        </header>

        <figure class="aspect-[4/3] overflow-hidden bg-[#d8d2c6] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          <NuxtImg
            :src="product.image"
            :alt="product.alt"
            width="900"
            height="1200"
            sizes="xs:100vw sm:45vw md:36vw"
            densities="1"
            format="webp"
            loading="lazy"
          />
        </figure>

        <div class="max-[840px]:col-span-full flex flex-col justify-end">
          <dl class="m-0 mb-7 border-b border-[#171916] [&_div]:grid [&_div]:grid-cols-[minmax(92px,0.42fr)_1fr] [&_div]:gap-4 [&_div]:border-t [&_div]:border-[#aaa69b] [&_div]:py-[9px] [&_dd]:m-0 [&_dd]:text-[0.94rem] [&_dt]:mb-2 [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase">
            <div v-for="row in product.specs" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          </dl>
          <button
            class="w-max cursor-pointer border-0 bg-[#d65a1f] px-5 py-3 font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#fffdf7] transition-colors duration-150 hover:bg-[#a53e10]"
            type="button"
            :aria-label="`Добавить в корзину: ${product.title}`"
            @click="addProduct(product.id)"
          >В корзину</button>
        </div>
      </article>

      <div class="mt-7 flex justify-end max-[560px]:justify-start">
        <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50" to="/kontakty">Уточнить наличие</NuxtLink>
      </div>
    </section>

  </main>
</template>
