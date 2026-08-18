<script setup lang="ts">
definePageMeta({
  path: '/o-nas',
})

useSeoMeta({
  title: 'О пилораме – производство пиломатериалов в Ленинградской области',
  description: 'О производстве пиломатериалов в Разбегаево: распил, камерная сушка, строгание, огнебиозащитная обработка и доставка по Санкт-Петербургу и Ленинградской области.',
  ogTitle: 'О пилораме в Разбегаево',
  ogDescription: 'Собственное производство доски, вагонки и других пиломатериалов в Ломоносовском районе Ленинградской области.',
  ogImage: `${siteUrl}/images/pilorama-stanok-brevno.jpg`,
  ogType: 'website',
  ogUrl: `${siteUrl}/o-nas`,
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/o-nas` }],
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'О нас', item: '/o-nas' },
    ],
  }),
])
</script>

<template>
  <main>
    <section class="max-[840px]:grid-cols-1 grid min-h-[430px] grid-cols-[minmax(0,0.58fr)_minmax(340px,0.42fr)] border-b border-(--color-ink)">
      <div class="max-[560px]:px-[18px] max-[560px]:py-12 flex flex-col justify-center gap-5 bg-(--color-sand) py-10 pr-10 pl-[max(40px,calc((100vw_-_1280px)/2))]">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Собственное производство</p>
          <h1 class="max-w-[700px]">О пилораме в Разбегаево</h1>
        </div>
        <p class="mb-0 max-w-[650px] text-[1.08rem] leading-[1.6] text-(--color-ink)/85">
          Производим пиломатериалы для строительства и отделки на площадке в Ломоносовском районе Ленинградской области.
        </p>
      </div>

      <figure class="max-[840px]:h-auto max-[840px]:min-h-[420px] max-[840px]:border-l-0 max-[840px]:border-t max-[560px]:min-h-[340px] h-[clamp(430px,52vh,520px)] min-w-0 overflow-hidden border-l border-(--color-ink) bg-(--color-forest-deep) [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/pilorama-stanok-brevno.jpg"
          alt="Пилорамный станок с бревном на производственной площадке в Разбегаево"
          width="1200"
          height="1200"
          sizes="xs:100vw sm:100vw md:42vw lg:42vw xl:42vw xxl:42vw"
          densities="1 2"
          format="webp"
          loading="eager"
          preload
        />
      </figure>
    </section>

    <section class="border-b border-(--color-ink)" aria-labelledby="production-title">
      <div class="grid gap-5 py-[56px] pr-6 pl-[max(40px,calc((100vw_-_1280px)/2))] max-[560px]:px-[18px] max-[560px]:py-12">
        <div class="grid gap-4">
          <p class="eyebrow mb-0">Чем занимаемся</p>
          <h2 id="production-title">Что делаем</h2>
        </div>
        <div class="grid max-w-[760px] gap-3">
          <p>
            Пилорама {{ businessRequisites.shortName }} выпускает доску естественной влажности, сухую и сухую строганую доску, имитацию бруса и вагонку в востребованных размерах.
          </p>
          <p>
            На производстве доступны камерная сушка, строгание, покраска и обработка огнебиозащитным составом. Продукция регистрируется в ЛесЕГАИС.
          </p>
          <p class="mb-0">
            Отгружаем заказы с производственной площадки в Разбегаево и организуем доставку по Санкт-Петербургу и Ленинградской области.
          </p>
        </div>
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,7vw,104px)] border-b border-(--color-ink) bg-(--color-sand) px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] max-[560px]:py-14" aria-labelledby="next-step-title">
      <div class="grid content-start gap-4">
        <p class="eyebrow mb-0">Фото</p>
        <h2 id="next-step-title">Станки, склад и отгрузка</h2>
      </div>
      <div class="grid content-start gap-5">
        <p class="max-w-[640px] text-[1.05rem] leading-[1.6] text-(--color-ink)/85">
          В фотогалерее собраны реальные кадры производственной площадки, готовой продукции и погрузки заказов.
        </p>
        <div class="flex flex-wrap gap-5">
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/foto">Смотреть фотографии</NuxtLink>
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-(--color-forest) no-underline transition-colors duration-150 hover:text-(--color-copper)" to="/kontakty">Связаться с нами</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
