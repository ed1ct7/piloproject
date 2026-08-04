<script setup lang="ts">
definePageMeta({
  path: '/pilomaterialy',
})

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
    <section class="page-masthead page-masthead--catalog">
      <div class="page-masthead__mark">
        <span>КАТАЛОГ / 2026</span>
        <span>РАЗБЕГАЕВО</span>
      </div>
      <div class="page-masthead__title">
        <p class="technical-label">Пиломатериалы от производителя</p>
        <h1>Каталог с ценами за кубометр</h1>
      </div>
      <p class="page-masthead__intro">
        Восемь основных позиций производства с фотографиями и ценами за м³, плюс группы
        под заказ. Состав партий меняется, поэтому наличие подтверждается перед расчётом.
      </p>
    </section>

    <section class="catalog-sheet" aria-label="Каталог пиломатериалов с ценами">
      <article v-for="product in priceListProducts" :key="product.number" class="catalog-entry">
        <header>
          <span class="catalog-entry__number">{{ product.number }}</span>
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
          <NuxtLink class="text-link" to="/kontakty">Уточнить эту позицию</NuxtLink>
        </div>
      </article>
    </section>

    <section class="custom-order" aria-labelledby="custom-order-title">
      <header class="custom-order__head">
        <div>
          <span class="section-index">09</span>
          <p class="technical-label">Под заказ</p>
        </div>
        <h2 id="custom-order-title">Группы без фиксированной цены в прайсе</h2>
        <p>
          Стоимость этих позиций зависит от сечения, объёма партии и обработки, поэтому
          рассчитывается по запросу. Возможен распил под размер покупателя.
        </p>
      </header>

      <div class="custom-order__grid">
        <article v-for="group in customOrderGroups" :key="group.title">
          <h3>{{ group.title }}</h3>
          <p>{{ group.text }}</p>
        </article>
      </div>
    </section>

    <section class="material-note">
      <div>
        <span class="section-index">10</span>
        <p class="technical-label">Перед обращением</p>
        <h2>Какие данные нужны для точного расчёта</h2>
      </div>
      <div class="material-note__body">
        <p>
          Укажите название материала, размеры, количество штук или общий объём. Если нужен
          распил либо обработка поверхности, добавьте это требование сразу. Цены указаны
          за кубометр и подтверждаются вместе с наличием.
        </p>
        <p>
          Для доставки потребуется адрес и информация о подъезде к месту разгрузки. Эти данные
          позволяют подобрать способ получения без предположений и повторных уточнений.
        </p>
        <div class="section-actions">
          <a class="button button--signal" :href="businessWhatsAppUrl" target="_blank" rel="noopener">
            Написать в WhatsApp
          </a>
          <NuxtLink class="button button--outline" to="/dostavka">Условия получения</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
