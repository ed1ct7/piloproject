<script setup lang="ts">
definePageMeta({
  path: '/o-nas',
})

useSeoMeta({
  title: 'О пилораме в Разбегаево – производство пиломатериалов',
  description: 'О производстве пиломатериалов в Разбегаево: распил, камерная сушка, строгание, огнебиозащитная обработка и доставка по Санкт-Петербургу и Ленинградской области.',
  ogTitle: 'О пилораме в Разбегаево',
  ogDescription: 'Собственное производство доски, бруса и других пиломатериалов в Ломоносовском районе Ленинградской области.',
  ogImage: `${siteUrl}/images/pilorama-stanok-brevno.jpg`,
  ogType: 'website',
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
    <section class="max-[840px]:grid-cols-1 mx-auto grid min-h-[500px] w-[min(1280px,100%)] grid-cols-[minmax(0,0.58fr)_minmax(340px,0.42fr)] border-b border-[#171916]">
      <div class="max-[560px]:px-[18px] max-[560px]:py-12 flex flex-col justify-center bg-[#e9e5dc] p-10">
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Собственное производство</p>
        <h1 class="max-w-[700px]">О пилораме в Разбегаево</h1>
        <p class="mb-0 max-w-[650px] text-[1.08rem] leading-[1.6] text-[#393d37]">
          Производим пиломатериалы для строительства и отделки на площадке в Ломоносовском районе Ленинградской области.
        </p>
      </div>

      <figure class="max-[840px]:min-h-[420px] max-[840px]:border-l-0 max-[840px]:border-t max-[560px]:min-h-[340px] min-w-0 overflow-hidden border-l border-[#171916] bg-[#13251e] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        <NuxtImg
          src="/images/pilorama-stanok-brevno.jpg"
          alt="Пилорамный станок с бревном на производственной площадке в Разбегаево"
          width="1200"
          height="1200"
          sizes="xs:100vw sm:100vw md:42vw lg:42vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
        />
      </figure>
    </section>

    <section class="max-[840px]:grid-cols-1 mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)] border-b border-[#171916]" aria-labelledby="production-title">
      <div class="max-[840px]:border-r-0 max-[840px]:border-b max-[560px]:px-[18px] max-[560px]:py-12 border-r border-[#171916] p-[56px]">
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Чем занимаемся</p>
        <h2 id="production-title">От распила до готового материала</h2>
        <p>
          Пилорама ИП Макоев Р.А. выпускает доску естественной влажности, сухую и сухую строганую доску, брус, брусок, рейку и имитацию бруса в востребованных размерах.
        </p>
        <p>
          На производстве доступны камерная сушка, строгание и обработка огнебиозащитным составом. Продукция регистрируется в ЛесЕГАИС.
        </p>
        <p class="mb-0">
          Отгружаем заказы с производственной площадки в Разбегаево и организуем доставку по Санкт-Петербургу и Ленинградской области.
        </p>
      </div>

      <div class="max-[560px]:px-[18px] max-[560px]:py-12 bg-[#f5f2eb] p-[56px]">
        <h2>Реквизиты</h2>
        <dl class="mt-9 border-b border-[#171916] [&_div]:border-t [&_div]:border-[#aaa69b] [&_div]:py-[12px] [&_dd]:m-0 [&_dd]:mt-1 [&_dd]:font-[Segoe_UI,Arial,sans-serif] [&_dd]:text-[0.95rem] [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere] [&_dt]:font-[Segoe_UI,Arial,sans-serif] [&_dt]:text-[0.8125rem] [&_dt]:font-[760] [&_dt]:uppercase">
          <div>
            <dt>Организация</dt>
            <dd>{{ businessRequisites.fullName }}</dd>
          </div>
          <div>
            <dt>ИНН</dt>
            <dd>{{ businessRequisites.inn }}</dd>
          </div>
          <div>
            <dt>ОГРНИП</dt>
            <dd>{{ businessRequisites.ogrnip }}</dd>
          </div>
          <div>
            <dt>Учёт продукции</dt>
            <dd>ЛесЕГАИС</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="max-[840px]:grid-cols-1 max-[560px]:px-[18px] grid grid-cols-[minmax(300px,0.82fr)_minmax(360px,1.18fr)] gap-[clamp(40px,7vw,104px)] border-b border-[#171916] bg-[#d8d2c6] px-[max(24px,calc((100vw_-_1280px)/2))] py-[72px] max-[560px]:py-14" aria-labelledby="next-step-title">
      <div>
        <p class="font-[Segoe_UI,Arial,sans-serif] uppercase mb-4 text-[0.8125rem] font-[760] leading-[1.4] tracking-[0.04em]">Увидеть производство</p>
        <h2 id="next-step-title">Станки, склад и отгрузка</h2>
      </div>
      <div>
        <p class="max-w-[640px] text-[1.05rem] leading-[1.6] text-[#393d37]">
          В фотогалерее собраны реальные кадры производственной площадки, готовой продукции и погрузки заказов.
        </p>
        <div class="flex flex-wrap gap-5">
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f]" to="/foto">Смотреть фотографии</NuxtLink>
          <NuxtLink class="w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f]" to="/kontakty">Связаться с нами</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
