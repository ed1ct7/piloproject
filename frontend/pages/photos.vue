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
  ogDescription: 'Реальные фотографии площадки: станки, склад, готовые пиломатериалы и отгрузка.',
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
    <section class="max-[840px]:grid-cols-1 max-[840px]:min-h-0 max-[560px]:block max-[560px]:px-[18px] max-[560px]:pb-10 max-[560px]:pt-[34px] grid min-h-[310px] grid-cols-[64px_minmax(380px,1.45fr)_minmax(280px,0.75fr)] items-center gap-8 border-b border-[#171916] px-[max(24px,calc((100vw_-_1280px)/2))] pb-10 pt-14 bg-[#d8d2c6]">
      <div aria-hidden="true" />
      <div class="max-w-[760px] [&_h1]:mb-0">
        <h1>Фото пилорамы и склада</h1>
      </div>
      <p class="mb-0 max-w-[480px] text-[1.03rem] leading-[1.65] text-[#393d37]">
        Производственная площадка, пилорама, склад, готовые пиломатериалы и отгрузка.
      </p>
    </section>

    <section class="grid grid-cols-4 gap-5 bg-[#f5f2eb] px-[max(24px,calc((100vw_-_1280px)/2))] pb-20 pt-14 max-[1100px]:grid-cols-3 max-[840px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-4 max-[560px]:px-[18px] max-[560px]:pb-14" aria-label="Фотографии производственной площадки">
      <figure v-for="photo in photos" :key="photo.image" class="border border-[#171916] bg-[#d8d2c6] shadow-[0_14px_30px_rgba(23,25,22,0.08)] [&_img]:aspect-[4/3] [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          :src="photo.image"
          :alt="photo.alt"
          width="720"
          height="900"
          sizes="xs:100vw sm:50vw md:33vw lg:25vw"
          densities="1"
          format="webp"
          loading="lazy"
        />
        <figcaption>{{ photo.caption }}</figcaption>
      </figure>
    </section>

  </main>
</template>
