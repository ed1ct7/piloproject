<script setup lang="ts">
definePageMeta({
  path: '/pilomaterialy',
})

useSeoMeta({
  title: 'Пиломатериалы в Разбегаево – цены на доску, брусок, рейку за м³',
  description: 'Каталог пилорамы в Разбегаево с ценами за кубометр: сухой строганый брусок, рейка, доска камерной сушки, имитация бруса и доска с огнебиозащитной обработкой.',
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
    <section class="page-masthead page-masthead--catalog">
      <div class="page-masthead__mark" aria-hidden="true" />
      <div class="page-masthead__title">
        <h1>Каталог с ценами за кубометр</h1>
      </div>
      <p class="page-masthead__intro">
        Восемь позиций с фотографиями, размерами и ценами за м³.
      </p>
    </section>

    <section class="catalog-sheet" aria-label="Каталог пиломатериалов с ценами">
      <article v-for="product in priceListProducts" :key="product.number" class="catalog-entry">
        <header>
          <h2>{{ product.title }}</h2>
          <p class="catalog-entry__price">{{ formatPricePerCubicMeter(product.price) }}</p>
        </header>

        <figure>
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

        <div class="catalog-entry__content">
          <p>{{ product.description }}</p>
          <dl class="spec-table">
            <div v-for="row in product.specs" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          </dl>
        </div>
      </article>

      <div class="section-action">
        <NuxtLink class="text-link" to="/kontakty">Уточнить наличие</NuxtLink>
      </div>
    </section>
  </main>
</template>
