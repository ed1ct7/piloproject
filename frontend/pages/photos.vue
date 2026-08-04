<script setup lang="ts">
definePageMeta({
  path: '/foto',
})

/** Фотографии производственной площадки для галереи. */
const photos = [
  {
    image: '/images/lentochnaya-pilorama-raspil.jpg',
    alt: 'Ленточная пилорама с бревном на рельсах перед распилом',
    caption: 'Ленточная пилорама перед распилом бревна',
  },
  {
    image: '/images/pilorama-stanok-brevno.jpg',
    alt: 'Пилорамный станок с бревном на подаче под навесом производства',
    caption: 'Подача бревна на пилорамный станок',
  },
  {
    image: '/images/sklad-obrabotannoi-doski.jpg',
    alt: 'Штабели обработанной доски на крытом складе пилорамы',
    caption: 'Крытый склад обработанной доски',
  },
  {
    image: '/images/shtabel-suhoi-doski.jpg',
    alt: 'Штабели сухой доски в пачках на складе',
    caption: 'Пачки сухой доски на складе',
  },
  {
    image: '/images/bruski-na-sklade.jpg',
    alt: 'Штабели строганого бруска на складе производства',
    caption: 'Строганый брусок в штабелях',
  },
  {
    image: '/images/pachki-reiki-i-bruska.jpg',
    alt: 'Пачки рейки и бруска, подготовленные к отгрузке',
    caption: 'Рейка и брусок в пачках',
  },
  {
    image: '/images/imitatsiya-brusa-upakovka.jpg',
    alt: 'Имитация бруса в защитной упаковке на складе',
    caption: 'Имитация бруса в упаковке',
  },
  {
    image: '/images/doska-s-ognebiozashchitoi.jpg',
    alt: 'Штабель доски, обработанной огнебиозащитным составом',
    caption: 'Доска после обработки огнебиозащитой',
  },
  {
    image: '/images/ploshchadka-otgruzka-pilomaterialov.jpg',
    alt: 'Производственная площадка с партией доски и машиной на отгрузке',
    caption: 'Комплектование партии на площадке',
  },
  {
    image: '/images/dostavka-pilomaterialov.jpg',
    alt: 'Машина с пиломатериалами на доставке у участка заказчика',
    caption: 'Доставка заказа на участок',
  },
  {
    image: '/images/brushing-1.jpg',
    alt: 'Крупный план обработанной хвойной доски на производственной линии',
    caption: 'Поверхность доски после обработки',
  },
  {
    image: '/images/lumber-stack-2025-03-07.jpg',
    alt: 'Партия окрашенных досок на производственной линии',
    caption: 'Партия доски перед комплектованием',
  },
  {
    image: '/images/sawn-board-stack-2025-04-02.jpg',
    alt: 'Штабель распиленной доски на площадке',
    caption: 'Штабель распиленной доски',
  },
  {
    image: '/images/lumber-yard-2025-05-21.jpg',
    alt: 'Окрашенные доски серого цвета после обработки',
    caption: 'Доска с готовым покрытием',
  },
  {
    image: '/images/timber-order-2025-05-16.jpg',
    alt: 'Образцы окрашенной древесины с различными вариантами покрытия',
    caption: 'Образцы вариантов покрытия',
  },
  {
    image: '/images/sawmill-yard-1.jpg',
    alt: 'Образцы досок с разными вариантами окрашенной поверхности',
    caption: 'Варианты обработки поверхности',
  },
]

useSeoMeta({
  title: 'Фото пилорамы в Разбегаево – производство, склад, отгрузка',
  description: 'Фотографии производственной площадки пилорамы в Разбегаево: ленточная пилорама, распил бревна, склад сухой доски и бруска, обработка огнебиозащитой, отгрузка и доставка.',
  ogTitle: 'Фото производства пилорамы в Разбегаево',
  ogDescription: 'Фотографии площадки: станки, склад, готовые пиломатериалы и отгрузка.',
  ogImage: `${siteUrl}/images/pilorama-stanok-brevno.jpg`,
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/foto` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Фото производства', item: '/foto' },
    ],
  }),
  defineWebPage({
    name: 'Фото производства пилорамы в Разбегаево',
    description: 'Фотографии станков, склада и отгрузки пиломатериалов на производственной площадке.',
  }),
])
</script>

<template>
  <main>
    <section class="page-masthead page-masthead--catalog">
      <div class="page-masthead__mark" aria-hidden="true" />
      <div class="page-masthead__title">
        <h1>Фото пилорамы и склада</h1>
      </div>
      <p class="page-masthead__intro">
        Производственная площадка, пилорама, склад, готовые пиломатериалы и отгрузка.
      </p>
    </section>

    <section class="photo-wall" aria-label="Фотографии производственной площадки">
      <figure v-for="photo in photos" :key="photo.image">
        <NuxtImg
          :src="photo.image"
          :alt="photo.alt"
          width="720"
          height="900"
          sizes="xs:100vw sm:50vw md:33vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>{{ photo.caption }}</figcaption>
      </figure>
    </section>

  </main>
</template>
