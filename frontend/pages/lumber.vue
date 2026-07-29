<script setup lang="ts">
definePageMeta({
  path: '/pilomaterialy',
})

const catalog = [
  {
    number: '01',
    title: 'Обрезная доска',
    image: '/images/brushing-1.jpg',
    alt: 'Поверхность обработанной обрезной доски крупным планом',
    description: 'Материал используют в каркасах, перекрытиях, черновых полах, кровле и хозяйственных постройках.',
    rows: [
      ['Толщина', '25–50 мм'],
      ['Длина', '6 м'],
      ['Порода', 'Хвойная'],
      ['Наличие', 'Уточняется перед расчётом'],
    ],
  },
  {
    number: '02',
    title: 'Брус',
    image: '/images/paint-shop-1.jpg',
    alt: 'Производственная линия и подготовленные пиломатериалы в цехе',
    description: 'Брус подходит для опорных элементов, лаг, навесов, бань и других конструкций.',
    rows: [
      ['Сечение', '100×100 и 150×150 мм'],
      ['Подбор', 'Под назначение конструкции'],
      ['Распил', 'Возможность уточняется'],
      ['Наличие', 'Проверяется по запросу'],
    ],
  },
  {
    number: '03',
    title: 'Заборная доска',
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Серые окрашенные доски с выраженной древесной фактурой',
    description: 'Доска применяется для ограждений, временных конструкций и практических работ на участке.',
    rows: [
      ['Размер', 'Согласуется по партии'],
      ['Поверхность', 'Вариант обработки уточняется'],
      ['Назначение', 'Ограждения и участок'],
      ['Наличие', 'Проверяется перед заказом'],
    ],
  },
  {
    number: '04',
    title: 'Брусок и рейка',
    image: '/images/sawmill-yard-1.jpg',
    alt: 'Образцы досок с разными вариантами окрашенной поверхности',
    description: 'Материал используют для обрешётки, подсистем, отделки, упаковки и небольших работ.',
    rows: [
      ['Сечение', 'Уточняется по наличию'],
      ['Подбор', 'Под задачу покупателя'],
      ['Обработка', 'Согласуется отдельно'],
      ['Получение', 'Самовывоз или доставка'],
    ],
  },
]

useSeoMeta({
  title: 'Пиломатериалы в Разбегаево – доска, брус, рейка',
  description: 'Каталог пиломатериалов пилорамы в Разбегаево: обрезная доска, брус, заборная доска, брусок, рейка и возможность распила под размер.',
  ogTitle: 'Пиломатериалы в Разбегаево',
  ogDescription: 'Рабочий каталог обрезной доски, бруса, рейки, бруска и заборной доски.',
  ogType: 'website',
  robots: 'index, follow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: 'https://pilorama-razbegaevo.clients.site/pilomaterialy' }],
})

useSchemaOrg([
  defineItemList({
    name: 'Пиломатериалы пилорамы в Разбегаево',
    itemListElement: catalog.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
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
        <h1>Каталог доски, бруса и рейки</h1>
      </div>
      <p class="page-masthead__intro">
        Здесь собраны основные позиции для частной стройки, бригад и работ на участке.
        Размеры и наличие необходимо подтвердить перед расчётом, поскольку состав партий меняется.
      </p>
    </section>

    <section class="catalog-sheet" aria-label="Каталог пиломатериалов">
      <article v-for="product in catalog" :key="product.number" class="catalog-entry">
        <header>
          <span class="catalog-entry__number">{{ product.number }}</span>
          <h2>{{ product.title }}</h2>
        </header>

        <figure>
          <NuxtImg
            :src="product.image"
            :alt="product.alt"
            width="1200"
            height="900"
            sizes="xs:100vw sm:45vw md:36vw"
            densities="1"
            format="webp"
            loading="lazy"
          />
        </figure>

        <div class="catalog-entry__content">
          <p>{{ product.description }}</p>
          <dl class="spec-table">
            <div v-for="row in product.rows" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          </dl>
          <NuxtLink class="text-link" to="/kontakty">Уточнить эту позицию</NuxtLink>
        </div>
      </article>
    </section>

    <section class="material-note">
      <div>
        <span class="section-index">05</span>
        <p class="technical-label">Перед обращением</p>
        <h2>Какие данные нужны для точного расчёта</h2>
      </div>
      <div class="material-note__body">
        <p>
          Укажите название материала, размеры, количество штук или общий объём. Если нужен
          распил либо обработка поверхности, добавьте это требование сразу.
        </p>
        <p>
          Для доставки потребуется адрес и информация о подъезде к месту разгрузки. Эти данные
          позволяют подобрать способ получения без предположений и повторных уточнений.
        </p>
        <div class="section-actions">
          <NuxtLink class="button button--signal" to="/kontakty">Подготовить запрос</NuxtLink>
          <NuxtLink class="button button--outline" to="/dostavka">Условия получения</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
